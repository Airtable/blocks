// @flow

// NOTE: The version of React running in the Block SDK is controlled by the block.
// The SDK should not make too many assumptions about which version of React or
// ReactDOM is running.

// HACK: make sure React.PropTypes is defined. If the block is using a newer
// version of React, PropTypes won't be available, but a few SDK components
// try to reference it. Once grepping React.PropTypes in hyperbase doesn't
// return any matches, we can remove this hack.
const React = require('react');
const PropTypes = require('prop-types');
if (!React.PropTypes) {
    // eslint-disable-line react/no-deprecated
    React.PropTypes = PropTypes; // eslint-disable-line react/no-deprecated
}

const BlockMessageTypes = window.__requirePrivateModuleFromAirtable(
    'client/blocks/block_message_types',
);
const GlobalConfig = require('./global_config');
const Base = require('./models/base');
const models = require('./models/models');
const InMemoryStorage = window.__requirePrivateModuleFromAirtable(
    'client/helpers/browser_storage/in_memory_storage',
);
const {
    isLocalStorageAvailable,
    isSessionStorageAvailable,
} = window.__requirePrivateModuleFromAirtable(
    'client/helpers/browser_storage/is_storage_available',
);
const Viewport = require('./viewport');
const Cursor = require('./cursor');
const UI = require('./ui/ui');
const BlockWrapperComponent = require('./ui/block_wrapper_component');
const SettingsButton = require('./settings_button');
const UndoRedo = require('./undo_redo');

import type {AirtableInterface} from './injected/airtable_interface';
import type {BlockSdkInitData} from 'client_server_shared/blocks/block_sdk_init_data';

/**
 * @example
 * import {runInfo} from 'airtable-block';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to base.activeTable
 * }
 */
export type RunInfo = {
    isFirstRun: boolean,
    isDevelopmentMode: boolean,
};

/**
 * Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.
 */
class BlockSdk {
    static VERSION = PACKAGE_VERSION;

    __BlockWrapperComponent: typeof BlockWrapperComponent;

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
    constructor(airtableInterface: AirtableInterface) {
        this.__airtableInterface = airtableInterface;
        airtableInterface.assertAllowedSdkPackageVersion(PACKAGE_NAME, BlockSdk.VERSION);

        this.__BlockWrapperComponent = BlockWrapperComponent;
        const sdkInitData = airtableInterface.sdkInitData;
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
    _registerHandlers() {
        // base
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.UPDATE_MODELS,
            data => {
                this.base.__applyChanges(data.changes);
            },
        );

        // global config
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.SET_MULTIPLE_KV_PATHS,
            data => {
                this.globalConfig.__onSetMultipleKvPaths(data.updates);
            },
        );

        // settings button
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_CLICK_SETTINGS_BUTTON,
            () => {
                if (this.settingsButton.isVisible) {
                    // Since there's an async gap when communicating with liveapp,
                    // no-op if the button has been hidden since it was clicked.
                    this.settingsButton.__onClick();
                }
            },
        );

        // viewport
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_ENTER_FULLSCREEN,
            () => {
                this.viewport.__onEnterFullscreen();
            },
        );
        this.__airtableInterface.registerHandler(
            BlockMessageTypes.HostToBlock.DID_EXIT_FULLSCREEN,
            () => {
                this.viewport.__onExitFullscreen();
            },
        );
        this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.FOCUS, () => {
            this.viewport.__focus();
        });
    }
    /** */
    reload() {
        this.__airtableInterface.reloadFrame();
    }
}

module.exports = BlockSdk;
