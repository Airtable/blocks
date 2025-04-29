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

    /** @hidden */
    constructor(airtableInterface: AirtableInterface) {
        super(airtableInterface);

        const sdkInitData = airtableInterface.sdkInitData;

        // Bind the public methods on this class so users can import
        // just the method, e.g.
        // import {reload} from '@airtable/blocks/base';
        this.unstable_fetchAsync = this.unstable_fetchAsync.bind(this);

        this.viewport = new Viewport(sdkInitData.isFullscreen, airtableInterface);
        this.cursor = new Cursor(this);
        this.settingsButton = new SettingsButton(airtableInterface);
        this.undoRedo = new UndoRedo(airtableInterface);
        this.performRecordAction = new PerformRecordAction(this, airtableInterface);

        // Now that we've constructed our models, let's hook them up to realtime changes.
        this._registerHandlers();

        // TODO: freeze this object before we ship the code editor.
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
