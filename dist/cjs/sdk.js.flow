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
import {type GlobalConfigUpdate} from './types/global_config';
import GlobalConfig from './global_config';
import Base from './models/base';
import models from './models/models';
import Cursor from './models/cursor';
import Viewport from './viewport';
import UI from './ui/ui';
import SettingsButton from './settings_button';
import UndoRedo from './undo_redo';
import {type AirtableInterface} from './injected/airtable_interface';
import {cloneDeep} from './private_utils';

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

/**
 * @example
 * import {runInfo} from 'airtable-block';
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
function defaultUpdateBatcher(applyUpdates: () => void) {
    applyUpdates();
}

/**
 * Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.
 */
class BlockSdk {
    static VERSION = global.PACKAGE_VERSION;

    // NOTE: in most cases, we should pass the Airtable interface to models when we
    // construct them (to reduce usage of getSdk). But in some cases, that isn't
    // feasible (i.e. expandRecord, since that can be called directly from block code),
    // so we allow accessing it through getSdk().__airtableInterface for convenience.
    __airtableInterface: AirtableInterface;

    /** */
    globalConfig: GlobalConfig;
    /** The current base */
    base: Base;
    /** */
    models: typeof models;
    /** */
    installationId: string;
    /**
     * Wrapper for window.localStorage which will automatically fall back
     * to in-memory storage when window.localStorage is unavailable.
     */
    localStorage: Storage | InMemoryStorage;
    /**
     * Wrapper for window.sessionStorage which will automatically fall back
     * to in-memory storage when window.sessionStorage is unavailable.
     */
    sessionStorage: Storage | InMemoryStorage;
    /** */
    viewport: Viewport;
    /** */
    runInfo: RunInfo;
    /** */
    cursor: Cursor;
    /** */
    UI: typeof UI;
    /** */
    settingsButton: SettingsButton;
    /** */
    undoRedo: UndoRedo;
    /** */
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

    constructor(airtableInterface: AirtableInterface) {
        this.__airtableInterface = airtableInterface;
        // TODO(alex): remove check once hyperbase is deployed
        if (airtableInterface.assertAllowedSdkPackageVersion) {
            airtableInterface.assertAllowedSdkPackageVersion(global.PACKAGE_NAME, BlockSdk.VERSION);
        }

        // TODO(alex): remove initial data fallback once hyperbase is deployed
        const sdkInitData = cloneDeep(
            airtableInterface.sdkInitData || airtableInterface.initialData,
        );
        this.globalConfig = new GlobalConfig(sdkInitData.initialKvValuesByKey, airtableInterface);
        this.base = new Base(sdkInitData.baseData, airtableInterface);
        this.models = models;
        this.installationId = sdkInitData.blockInstallationId;

        // Bind the public methods on this class so users can import
        // just the method, e.g.
        // import {reload} from 'airtable-block';
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
    __applyModelChanges(changes: Array<ModelChange>) {
        this._runWithUpdateBatching(() => {
            const changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);
            const changedCursorKeys = this.cursor.__applyChangesWithoutTriggeringEvents(changes);
            this.base.__triggerOnChangeForChangedPaths(changedBasePaths);
            this.cursor.__triggerOnChangeForChangedKeys(changedCursorKeys);
        });
    }
    __applyGlobalConfigUpdates(updates: Array<GlobalConfigUpdate>) {
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
    /** */
    reload() {
        this.__airtableInterface.reloadFrame();
    }
    __setBatchedUpdatesFn(newUpdateBatcher: UpdateBatcher) {
        this._runWithUpdateBatching = newUpdateBatcher;
    }
}

export default BlockSdk;
