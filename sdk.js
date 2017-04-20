// @flow

// NOTE: Do not require react or react-dom from the block SDK! React will
// automatically be included in the block bundle and we don't want two
// copies of React running on the page.

const GlobalConfig = require('client/blocks/sdk/global_config');
const Base = require('client/blocks/sdk/models/base');
const models = require('client/blocks/sdk/models/models');
const NamespacedStorage = require('client/blocks/sdk/namespaced_storage');
const Viewport = require('client/blocks/sdk/viewport');

import type {BaseDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type {UIType} from 'client/blocks/sdk/ui/ui';

// The UI module depends on React being available on window (via window[GLOBAL_REACT_VARIABLE_NAME]).
// React won't be available until all the scripts for the block frame have loaded,
// so we require that module lazily the first time BlockSdk.UI is accessed, since
// BlockSdk itself is initialized before scripts are loaded in run_block_frame.
let UI: UIType | null = null;

class BlockSdk {
    globalConfig: GlobalConfig;
    base: Base;
    models: typeof models;
    installationId: string;
    localStorage: NamespacedStorage;
    sessionStorage: NamespacedStorage;
    viewport: Viewport;
    constructor(args: {
        initialKvStringifiedValuesByKey: {[key: string]: string},
        isDevelopmentMode: boolean,
        isFullscreen: boolean,
        baseData: BaseDataForBlocks,
        blockInstallationId: string,
    }) {
        this.globalConfig = new GlobalConfig(args.initialKvStringifiedValuesByKey, args.isDevelopmentMode);
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

        Object.freeze(this);
    }
    get UI(): UIType {
        if (!UI) {
            UI = require('client/blocks/sdk/ui/ui');
        }
        return UI;
    }
}

module.exports = BlockSdk;
