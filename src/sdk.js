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
    React.PropTypes = PropTypes;
}

const GlobalConfig = require('client/blocks/sdk/global_config');
const Base = require('client/blocks/sdk/models/base');
const models = require('client/blocks/sdk/models/models');
const InMemoryStorage = require('client/helpers/browser_storage/in_memory_storage');
const {
    isLocalStorageAvailable,
    isSessionStorageAvailable,
} = require('client/helpers/browser_storage/is_storage_available');
const Viewport = require('client/blocks/sdk/viewport');
const Cursor = require('client/blocks/sdk/cursor');
const UI = require('client/blocks/sdk/ui/ui');
const BlockWrapperComponent = require('client/blocks/sdk/ui/block_wrapper_component');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const {HostMethodNames} = require('client/blocks/block_message_types');
const utils = require('client/blocks/sdk/utils');
const SettingsButton = require('client/blocks/sdk/settings_button');

import type {BaseDataForBlocks} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

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
type RunInfo = {
    isFirstRun: boolean,
    isDevelopmentMode: boolean,
};

/**
 * Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.
 */
class BlockSdk {
    __BlockWrapperComponent: typeof BlockWrapperComponent;
    globalConfig: GlobalConfig;
    /** The current base */
    base: Base;
    /** */
    models: typeof models;
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
    constructor(args: {
        initialKvValuesByKey: {[string]: BlockKvValue},
        isDevelopmentMode: boolean,
        isFullscreen: boolean,
        isFirstRun: boolean,
        baseData: BaseDataForBlocks,
        blockInstallationId: string,
    }) {
        this.__BlockWrapperComponent = BlockWrapperComponent;
        this.globalConfig = new GlobalConfig(args.initialKvValuesByKey, args.isDevelopmentMode);
        this.base = new Base(args.baseData);
        this.models = models;
        this.installationId = args.blockInstallationId;

        // When localStorage/sessionStorage aren't availabe (e.g. when
        // "Block third-party cookies" is enabled in Chrome), we provide
        // an in-memory replacement. Otherwise, accessing window.localStorage or
        // window.sessionStorage will throw an exception.
        this.localStorage = isLocalStorageAvailable() ? window.localStorage : new InMemoryStorage();
        this.sessionStorage = isSessionStorageAvailable() ? window.sessionStorage : new InMemoryStorage();

        this.viewport = new Viewport(args.isFullscreen);
        this.cursor = new Cursor(args.baseData);
        this.UI = UI;
        this.settingsButton = new SettingsButton();

        this.runInfo = Object.freeze({
            isFirstRun: args.isFirstRun,
            isDevelopmentMode: args.isDevelopmentMode,
        });

        // TODO: freeze this object before we ship the code editor.
    }
    /** */
    reload() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            HostMethodNames.RELOAD_FRAME,
        ));
    }
}

module.exports = BlockSdk;
