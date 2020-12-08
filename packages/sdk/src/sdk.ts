/** @hidden */ /** */


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
import {RequestJson, ResponseJson} from './types/backend_fetch_types';

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

        this.reload = this.reload.bind(this);
        this.unstable_fetchAsync = this.unstable_fetchAsync.bind(this);

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

        this._registerHandlers();

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

        this.__airtableInterface.subscribeToModelUpdates(({changes}) => {
            this.__applyModelChanges(changes);
        });

        this.__airtableInterface.subscribeToGlobalConfigUpdates(({updates}) => {
            this.__applyGlobalConfigUpdates(updates);
        });

        this.__airtableInterface.subscribeToSettingsButtonClick(() => {
            if (this.settingsButton.isVisible) {
                this._runWithUpdateBatching(() => {
                    this.settingsButton.__onClick();
                });
            }
        });

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

    /** @hidden */
    async unstable_fetchAsync(requestJson: RequestJson): Promise<ResponseJson> {
        return await this.__airtableInterface.performBackendFetchAsync(requestJson);
    }
}
