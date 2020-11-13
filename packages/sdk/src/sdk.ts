/** @hidden */ /** */
// NOTE: The version of React running in the Block SDK is controlled by the block.
// The SDK should not make too many assumptions about which version of React or
// ReactDOM is running.

// HACK: make sure React.PropTypes is defined. If the block is using a newer
// version of React, PropTypes won't be available, but a few SDK components
// try to reference it. Once grepping React.PropTypes in hyperbase doesn't
// return any matches, we can remove this hack.
import * as React from 'react';
import PropTypes from 'prop-types';
import {ModelChange} from './types/base';
import GlobalConfig from './global_config';
import {GlobalConfigUpdate} from './types/global_config';
import Base from './models/base';
import Session from './models/session';
import Mutations from './models/mutations';
import Cursor from './models/cursor';
import Viewport from './viewport';
import SettingsButton from './settings_button';
import UndoRedo from './undo_redo';
import {PerformRecordAction} from './perform_record_action';
import {AirtableInterface, AppInterface} from './types/airtable_interface';

if (!(React as any).PropTypes) {
    (React as any).PropTypes = PropTypes;
}

/**
 * @hidden
 * @example
 * ```js
 * import {runInfo} from '@airtable/blocks';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to cursor.activeTableId
 * }
 * ```
 */
export interface RunInfo {
    isFirstRun: boolean;
    isDevelopmentMode: boolean;
    intentData: unknown;
}

/** @hidden */
type UpdateBatcher = (applyUpdates: () => void) => void;

/** @internal */
function defaultUpdateBatcher(applyUpdates: () => void) {
    applyUpdates();
}

/**
 * We document this manually.
 *
 * @hidden
 */
export default class BlockSdk {
    /** @hidden */
    static VERSION = global.PACKAGE_VERSION;

    /** @internal */
    __airtableInterface: AirtableInterface;

    /** Storage for this block installation's configuration. */
    globalConfig: GlobalConfig;

    /** Represents the current Airtable {@link Base}. */
    base: Base;

    /** Contains information about the current session. */
    session: Session;

    /** @internal */
    __mutations: Mutations;

    /**
     * Returns the ID for the current block installation.
     *
     * @example
     * ```js
     * import {installationId} from '@airtable/blocks';
     * console.log(installationId);
     * // => 'blifDutUr92OKwnUn'
     * ```
     */
    installationId: string;

    /** Controls the block's viewport. You can fullscreen the block and add size
     * constrains using `viewport`.
     */
    viewport: Viewport;

    /** @hidden */
    runInfo: RunInfo;

    /** Returns information about the active table, active view, and selected records. */
    cursor: Cursor;

    /**
     * Controls the block's {@link settingsButton settings button}.
     */
    settingsButton: SettingsButton;

    /** @hidden */
    undoRedo: UndoRedo;

    /** @internal */
    performRecordAction: PerformRecordAction;

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
    /** @internal */
    _runWithUpdateBatching: UpdateBatcher = defaultUpdateBatcher;

    /** @internal */
    constructor(airtableInterface: AirtableInterface) {
        this.__airtableInterface = airtableInterface;
        airtableInterface.assertAllowedSdkPackageVersion(global.PACKAGE_NAME, BlockSdk.VERSION);

        const sdkInitData = airtableInterface.sdkInitData;
        this.globalConfig = new GlobalConfig(sdkInitData.initialKvValuesByKey, this);
        this.base = new Base(this);
        this.installationId = sdkInitData.blockInstallationId;

        // Bind the public methods on this class so users can import
        // just the method, e.g.
        // import {reload} from '@airtable/blocks';
        this.reload = this.reload.bind(this);

        this.viewport = new Viewport(sdkInitData.isFullscreen, airtableInterface);
        this.cursor = new Cursor(this);
        this.session = new Session(this);
        this.__mutations = new Mutations(
            this,
            this.session,
            this.base,
            changes => this.__applyModelChanges(changes),
            updates => this.__applyGlobalConfigUpdates(updates),
        );
        this.settingsButton = new SettingsButton(airtableInterface);
        this.undoRedo = new UndoRedo(airtableInterface);
        this.performRecordAction = new PerformRecordAction(this, airtableInterface);

        this.runInfo = Object.freeze({
            isFirstRun: sdkInitData.isFirstRun,
            isDevelopmentMode: sdkInitData.isDevelopmentMode,
            intentData: sdkInitData.intentData,
        });

        // Now that we've constructed our models, let's hook them up to realtime changes.
        this._registerHandlers();

        // TODO: freeze this object before we ship the code editor.
    }
    /** @internal */
    __applyModelChanges(changes: ReadonlyArray<ModelChange>) {
        this._runWithUpdateBatching(() => {
            const changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);
            const changedCursorKeys = this.cursor.__applyChangesWithoutTriggeringEvents(changes);
            const changedSessionKeys = this.session.__applyChangesWithoutTriggeringEvents(changes);
            this.base.__triggerOnChangeForChangedPaths(changedBasePaths);
            this.cursor.__triggerOnChangeForChangedKeys(changedCursorKeys);
            this.session.__triggerOnChangeForChangedKeys(changedSessionKeys);
        });
    }
    /** @internal */
    __applyGlobalConfigUpdates(updates: ReadonlyArray<GlobalConfigUpdate>) {
        this._runWithUpdateBatching(() => {
            this.globalConfig.__setMultipleKvPaths(updates);
        });
    }
    /** @internal */
    _registerHandlers() {
        // base

        this.__airtableInterface.subscribeToModelUpdates(({changes}) => {
            this.__applyModelChanges(changes);
        });

        // global config
        this.__airtableInterface.subscribeToGlobalConfigUpdates(({updates}) => {
            this.__applyGlobalConfigUpdates(updates);
        });

        // settings button
        this.__airtableInterface.subscribeToSettingsButtonClick(() => {
            if (this.settingsButton.isVisible) {
                this._runWithUpdateBatching(() => {
                    // Since there's an async gap when communicating with liveapp,
                    // no-op if the button has been hidden since it was clicked.
                    this.settingsButton.__onClick();
                });
            }
        });

        // viewport
        this.__airtableInterface.subscribeToEnterFullScreen(() => {
            this._runWithUpdateBatching(() => {
                this.viewport.__onEnterFullscreen();
            });
        });
        this.__airtableInterface.subscribeToExitFullScreen(() => {
            this._runWithUpdateBatching(() => {
                this.viewport.__onExitFullscreen();
            });
        });
        this.__airtableInterface.subscribeToFocus(() => {
            this._runWithUpdateBatching(() => {
                this.viewport.__focus();
            });
        });
    }
    /**
     * Call this function to reload your block.
     *
     * @example
     * ```js
     * import React from 'react';
     * import {reload} from '@airtable/blocks';
     * import {Button, initializeBlock} from '@airtable/blocks/ui';
     * function MyBlock() {
     *     return <Button onClick={() => reload()}>Reload</Button>;
     * }
     * initializeBlock(() => <MyBlock />);
     * ```
     */
    reload() {
        this.__airtableInterface.reloadFrame();
    }
    /** @internal */
    __setBatchedUpdatesFn(newUpdateBatcher: UpdateBatcher) {
        this._runWithUpdateBatching = newUpdateBatcher;
    }

    /**
     * @internal
     */
    get __appInterface(): AppInterface {
        return this.base._baseData.appInterface;
    }
}
