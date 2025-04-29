/** @hidden */ /** */


import * as React from 'react';
import PropTypes from 'prop-types';
import {ModelChange} from '../shared/types/base_core';
import {GlobalConfigUpdate} from '../shared/types/global_config';
import {BlockSdkCore} from '../shared/sdk_core';
import {BaseSdkMode} from '../sdk_mode';
import Viewport from './viewport';
import Base from './models/base';
import Session from './models/session';
import Mutations from './models/mutations';
import Cursor from './models/cursor';
import SettingsButton from './settings_button';
import UndoRedo from './undo_redo';
import {PerformRecordAction} from './perform_record_action';
import {AirtableInterface, BlockRunContext} from './types/airtable_interface';
import {RequestJson, ResponseJson} from './types/backend_fetch_types';

if (!(React as any).PropTypes) {
    (React as any).PropTypes = PropTypes;
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
export default class BaseBlockSdk extends BlockSdkCore<BaseSdkMode> {
    /** Controls the block's viewport. You can fullscreen the block and add size
     * constrains using `viewport`.
     */
    viewport: Viewport;

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

    /** @hidden */
    constructor(airtableInterface: AirtableInterface) {
        super(airtableInterface);

        const sdkInitData = airtableInterface.sdkInitData;

        this.unstable_fetchAsync = this.unstable_fetchAsync.bind(this);

        this.viewport = new Viewport(sdkInitData.isFullscreen, airtableInterface);
        this.cursor = new Cursor(this);
        this.settingsButton = new SettingsButton(airtableInterface);
        this.undoRedo = new UndoRedo(airtableInterface);
        this.performRecordAction = new PerformRecordAction(this, airtableInterface);

        this._registerHandlers();

    }
    /** @internal */
    _constructSession(): Session {
        return new Session(this);
    }
    /** @internal */
    _constructBase(): Base {
        return new Base(this);
    }
    /** @internal */
    _constructMutations(): Mutations {
        return new Mutations(
            this,
            this.session,
            this.base,
            changes => this.__applyModelChanges(changes),
            updates => this.__applyGlobalConfigUpdates(updates),
        );
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
    /** @internal */
    __setBatchedUpdatesFn(newUpdateBatcher: UpdateBatcher) {
        this._runWithUpdateBatching = newUpdateBatcher;
    }

    /** @hidden */
    async unstable_fetchAsync(requestJson: RequestJson): Promise<ResponseJson> {
        return await this.__airtableInterface.performBackendFetchAsync(requestJson);
    }

    /** @hidden */
    getBlockRunContext(): BlockRunContext {
        return this.__airtableInterface.sdkInitData.runContext;
    }
}
