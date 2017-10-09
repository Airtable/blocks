// @flow

// NOTE: Do not require react or react-dom from the block SDK! React will
// automatically be included in the block bundle and we don't want two
// copies of React running on the page.

const GlobalConfig = require('client/blocks/sdk/global_config');
const Base = require('client/blocks/sdk/models/base');
const models = require('client/blocks/sdk/models/models');
const NamespacedStorage = require('client/blocks/sdk/namespaced_storage');
const Viewport = require('client/blocks/sdk/viewport');
const Cursor = require('client/blocks/sdk/cursor');
const UI = require('client/blocks/sdk/ui/ui');
const BlockWrapperComponent = require('client/blocks/sdk/ui/block_wrapper_component');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const {HostMethodNames} = require('client/blocks/block_message_types');
const utils = require('client/blocks/sdk/utils');
const SettingsButton = require('client/blocks/sdk/settings_button');

import type {BaseDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

type RunInfo = {
    isFirstRun: boolean,
    isDevelopmentMode: boolean,
};

class BlockSdk {
    __BlockWrapperComponent: typeof BlockWrapperComponent;
    globalConfig: GlobalConfig;
    base: Base;
    models: typeof models;
    installationId: string;
    localStorage: NamespacedStorage;
    sessionStorage: NamespacedStorage;
    viewport: Viewport;
    runInfo: RunInfo;
    cursor: Cursor;
    UI: typeof UI;
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

        // Wrap localStorage and sessionStorage to namespace
        // items by installation ID. If we run each installation on its
        // own subdomain (e.g. bli123.airtableblocks.com) we can remove
        // this, I think. Note that we can't replace window.localStorage
        // because it's read-only (at least in Chrome).
        this.localStorage = new NamespacedStorage(window.localStorage, args.blockInstallationId);
        this.sessionStorage = new NamespacedStorage(window.sessionStorage, args.blockInstallationId);

        this.viewport = new Viewport(args.isFullscreen);
        this.cursor = new Cursor(args.baseData);
        this.UI = UI;
        this.settingsButton = new SettingsButton();

        this.runInfo = Object.freeze({
            isFirstRun: args.isFirstRun,
            isDevelopmentMode: args.isDevelopmentMode,
        });

        Object.freeze(this);
    }
    reload() {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            HostMethodNames.RELOAD_FRAME,
        ));
    }
}

module.exports = BlockSdk;
