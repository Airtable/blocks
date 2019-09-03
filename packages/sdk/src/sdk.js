// @flow

// NOTE: The version of React running in the Block SDK is controlled by the block.
// The SDK should not make too many assumptions about which version of React or
// ReactDOM is running.

// HACK: make sure React.PropTypes is defined. If the block is using a newer
// version of React, PropTypes won't be available, but a few SDK components
// try to reference it. Once grepping React.PropTypes in hyperbase doesn't
// return any matches, we can remove this hack.
import * as React from 'react';
import PropTypes from 'prop-types';
import {type ModelChange} from './types/base';
import GlobalConfig, {type GlobalConfigUpdate} from './global_config';
import Base from './models/base';
import models from './models/models';
import Session from './models/session';
import Mutations from './models/mutations';
import Cursor from './models/cursor';
import Viewport from './viewport';
import UI from './ui/ui';
import SettingsButton from './settings_button';
import UndoRedo from './undo_redo';
import {type AirtableInterface} from './injected/airtable_interface';
import {cloneDeep} from './private_utils';
import {spawnError, invariant} from './error_utils';

// eslint-disable-next-line react/no-deprecated
if (!React.PropTypes) {
    // eslint-disable-next-line react/no-deprecated
    React.PropTypes = PropTypes;
}

const BlockMessageTypes = window.__requirePrivateModuleFromAirtable(
    'client/blocks/block_message_types',
);
const InMemoryStorage = window.__requirePrivateModuleFromAirtable(
    'client/helpers/browser_storage/in_memory_storage',
);
const {
    isLocalStorageAvailable,
    isSessionStorageAvailable,
} = window.__requirePrivateModuleFromAirtable(
    'client/helpers/browser_storage/is_storage_available',
);
const UserScopedAppInterface = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/user_scoped_app_interface',
);
const {PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);

/* NOTE: runInfo is not publicly documented yet.
 * @example
 * import {runInfo} from '@airtable/blocks';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to cursor.activeTableId
 * }
 */
export type RunInfo = {
    isFirstRun: boolean,
    isDevelopmentMode: boolean,
};

type UpdateBatcher = (applyUpdates: () => void) => void;
/** @private */
function defaultUpdateBatcher(applyUpdates: () => void) {
    applyUpdates();
}

/**
 * Import the SDK from `'@airtable/blocks'`.
 * @private because we document this manually in index.js
 */
class BlockSdk {
    static VERSION = global.PACKAGE_VERSION;

    // NOTE: in most cases, we should pass the Airtable interface to models when we
    // construct them (to reduce usage of getSdk). But in some cases, that isn't
    // feasible (i.e. expandRecord, since that can be called directly from block code),
    // so we allow accessing it through getSdk().__airtableInterface for convenience.
    __airtableInterface: AirtableInterface;

    /** Storage for this block installation's configuration. */
    globalConfig: GlobalConfig;

    /** Represents the current Airtable {@link Base}. */
    base: Base;

    /** Contains information about the current session. */
    session: Session;

    /** @private */
    __mutations: Mutations;

    /**
     * Contains the model classes, field types, view types, and utilities for
     * working with record coloring and record aggregation.
     */
    models: typeof models;

    /**
     * Returns the ID for the current block installation.
     * @example
     * import {installationId} from '@airtable/blocks';
     * console.log(installationId);
     * // => 'blifDutUr92OKwnUn'
     */
    installationId: string;

    /**
     * Wrapper for
     * [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) which
     * will automatically fall back to in-memory storage when `window.localStorage` is unavailable.
     *
     * @example
     * import {localStorage} from '@airtable/blocks';
     * localStorage.setItem('lastScrollTop', 0);
     */
    localStorage: Storage | InMemoryStorage;

    /**
     * Wrapper for
     * [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) which
     * will automatically fall back to in-memory storage when `window.sessionStorage` is unavailable.
     *
     * @example
     * import {sessionStorage} from '@airtable/blocks';
     * sessionStorage.setItem('lastScrollTop', 0);
     */
    sessionStorage: Storage | InMemoryStorage;

    /** Controls the block's viewport. You can fullscreen the block and add size
     * constrains using `viewport`.
     */
    viewport: Viewport;

    runInfo: RunInfo;

    /** Returns information about the active table, active view, and selected records. */
    cursor: Cursor;

    /** React components, hooks, and UI helpers. */
    UI: typeof UI;

    /**
     * Controls the block's {@link settingsButton settings button}.
     */
    settingsButton: SettingsButton;

    undoRedo: UndoRedo;

    /** @private */
    spawnError = spawnError;
    /** @private */
    invariant = invariant;

    /**
     * Call this function to reload your block.
     *
     * @example
     * import React from 'react';
     * import {UI, reload} from '@airtable/blocks';
     * function MyBlock() {
     *     return <UI.Button onClick={() => reload()}>Reload</UI.Button>;
     * }
     * UI.initializeBlock(() => <MyBlock />);
     */
    reload: () => void;

    // When models are updated on the frontend, we want to batch them together and have React do a
    // single render.
    //
    // Without this, in sync-mode React (the current default), anything that triggers an update
    // (like .setState or .forceUpdate) will instantly, synchronously re-render. So if you have an
    // update that triggers multiple updates across your tree, you get multiple renders in an
    // unpredictable order. This is bad because it's unnecessary work and the update order can
    // contradict react's normal top-down data flow which can cause subtle bugs.
    //
    // We set _runWithUpdateBatching to ReactDOM.unstable_batchedUpdates to facilitate this. We
    // don't know for sure though that React is in use on the page, so we leave actually setting
    // this when the developer sets up their block with React, in UI.initializeBlock.
    _runWithUpdateBatching: UpdateBatcher = defaultUpdateBatcher;

    /** @hideconstructor */
    constructor(airtableInterface: AirtableInterface) {
        this.__airtableInterface = airtableInterface;
        airtableInterface.assertAllowedSdkPackageVersion(global.PACKAGE_NAME, BlockSdk.VERSION);

        const sdkInitData = cloneDeep(airtableInterface.sdkInitData);
        this.globalConfig = new GlobalConfig(sdkInitData.initialKvValuesByKey, airtableInterface);
        this.base = new Base(sdkInitData.baseData, airtableInterface);
        this.models = models;
        this.installationId = sdkInitData.blockInstallationId;

        // Bind the public methods on this class so users can import
        // just the method, e.g.
        // import {reload} from '@airtable/blocks';
        this.reload = this.reload.bind(this);

        // When localStorage/sessionStorage aren't available (e.g. when
        // "Block third-party cookies" is enabled in Chrome), we provide
        // an in-memory replacement. Otherwise, accessing window.localStorage or
        // window.sessionStorage will throw an exception.
        this.localStorage = isLocalStorageAvailable() ? window.localStorage : new InMemoryStorage();
        this.sessionStorage = isSessionStorageAvailable()
            ? window.sessionStorage
            : new InMemoryStorage();

        this.viewport = new Viewport(sdkInitData.isFullscreen, airtableInterface);
        this.cursor = new Cursor(sdkInitData.baseData, airtableInterface);
        this.session = new Session(sdkInitData.baseData, airtableInterface);
        this.__mutations = new Mutations(
            airtableInterface,
            this.session,
            this.base,
            changes => this.__applyModelChanges(changes),
            updates => this.__applyGlobalConfigUpdates(updates),
        );
        this.UI = UI;
        this.settingsButton = new SettingsButton(airtableInterface);
        this.undoRedo = new UndoRedo(airtableInterface);

        this.runInfo = Object.freeze({
            isFirstRun: sdkInitData.isFirstRun,
            isDevelopmentMode: sdkInitData.isDevelopmentMode,
        });

        // Now that we've constructed our models, let's hook them up to realtime changes.
        this._registerHandlers();

        // TODO: freeze this object before we ship the code editor.
    }
    __applyModelChanges(changes: $ReadOnlyArray<ModelChange>) {
        this._runWithUpdateBatching(() => {
            const changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);
            const changedCursorKeys = this.cursor.__applyChangesWithoutTriggeringEvents(changes);
            const changedSessionKeys = this.session.__applyChangesWithoutTriggeringEvents(changes);
            this.base.__triggerOnChangeForChangedPaths(changedBasePaths);
            this.cursor.__triggerOnChangeForChangedKeys(changedCursorKeys);
            this.session.__triggerOnChangeForChangedKeys(changedSessionKeys);
        });
    }
    __applyGlobalConfigUpdates(updates: $ReadOnlyArray<GlobalConfigUpdate>) {
        this._runWithUpdateBatching(() => {
            this.globalConfig.__setMultipleKvPaths(updates);
        });
    }
    _registerHandlers() {
        // base
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.UPDATE_MODELS,
            data => {
                this.__applyModelChanges(data.changes);
            },
        );

        // global config
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.SET_MULTIPLE_KV_PATHS,
            data => {
                this.__applyGlobalConfigUpdates(data.updates);
            },
        );

        // settings button
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_CLICK_SETTINGS_BUTTON,
            () => {
                if (this.settingsButton.isVisible) {
                    this._runWithUpdateBatching(() => {
                        // Since there's an async gap when communicating with liveapp,
                        // no-op if the button has been hidden since it was clicked.
                        this.settingsButton.__onClick();
                    });
                }
            },
        );

        // viewport
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_ENTER_FULLSCREEN,
            () => {
                this._runWithUpdateBatching(() => {
                    this.viewport.__onEnterFullscreen();
                });
            },
        );
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_EXIT_FULLSCREEN,
            () => {
                this._runWithUpdateBatching(() => {
                    this.viewport.__onExitFullscreen();
                });
            },
        );
        this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.FOCUS, () => {
            this._runWithUpdateBatching(() => {
                this.viewport.__focus();
            });
        });
    }
    reload() {
        this.__airtableInterface.reloadFrame();
    }
    __setBatchedUpdatesFn(newUpdateBatcher: UpdateBatcher) {
        this._runWithUpdateBatching = newUpdateBatcher;
    }

    /**
     * @private
     */
    get __appInterface(): UserScopedAppInterface {
        return new UserScopedAppInterface({
            applicationId: this.base.id,
            appBlanket: this.base.__appBlanket,
            sortTiebreakerKey: this.base.__sortTiebreakerKey,
            currentSessionUserId:
                this.session.__currentUserId || PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID,
            isFeatureEnabled: featureName => this.session.__isFeatureEnabled(featureName),
        });
    }
}

export default BlockSdk;
