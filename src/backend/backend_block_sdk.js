// @flow
const Base = require('block_sdk/shared/models/base');
const models = require('block_sdk/shared/models/models');
const GlobalConfig = require('block_sdk/shared/global_config');
const AirtableApiClient = require('./airtable_api_client');
const AirtableInterfaceBackend = require('block_sdk/backend/airtable_interface_backend');
const BlockSdkVersions = require('client_server_shared/blocks/block_sdk_versions');
const invariant = require('invariant');

import type {BlockSdkInitData} from 'client_server_shared/blocks/block_sdk_init_data';
import type {BlockSdkInterface, RunInfo} from 'block_sdk/shared/block_sdk_interface';

class BackendBlockSdk implements BlockSdkInterface<AirtableInterfaceBackend> {
    static VERSION = BlockSdkVersions.BACKEND_VERSION;

    __airtableInterface: AirtableInterfaceBackend;

    /** */
    globalConfig: GlobalConfig;
    /** The current base */
    base: Base;
    /** */
    models: typeof models;
    /** */
    installationId: string;
    /** */
    runInfo: RunInfo;

    static async __constructSdkForEventAsync(eventData: {
        applicationId: string,
        blockInstallationId: string,
        kvValuesByKey: Object | void,
        apiAccessPolicyString: string,
        apiBaseUrl: string,
    }): Promise<BackendBlockSdk> {
        const {applicationId, blockInstallationId, apiAccessPolicyString, apiBaseUrl} = eventData;
        const airtableApiClient = new AirtableApiClient({
            applicationId,
            blockInstallationId,
            apiAccessPolicyString,
            apiBaseUrl,
        });
        const airtableInterface = new AirtableInterfaceBackend(airtableApiClient);

        // Requests will sometimes omit kvValuesByKey (if including it would push the request
        // over the size limit). If that's the case, it's our responsibility to fetch them
        // before constructing the sdk.
        let kvValuesByKey = eventData.kvValuesByKey;
        const sdkInitData = await airtableInterface.readBackendSdkInitDataAsync({
            sdkVersion: BackendBlockSdk.VERSION,
            // No need to include kvValuesByKey if we already have them.
            shouldIncludeKvValuesByKey: kvValuesByKey === undefined,
            shouldIncludeBaseData: true,
        });
        const baseData = sdkInitData.baseData;
        if (kvValuesByKey === undefined) {
            kvValuesByKey = sdkInitData.kvValuesByKey;
        }

        invariant(baseData, 'Should have baseData after reading SDK init data');
        invariant(kvValuesByKey, 'Should have kvValuesByKey after reading SDK init data');

        // Now that we're sure we have everything we need, we can construct the sdk.
        return new BackendBlockSdk({
            initialKvValuesByKey: kvValuesByKey,
            isDevelopmentMode: process.env.NODE_ENV === 'development',
            baseData,
            blockInstallationId,

            // NOTE: these don't really make sense in the backend. Just default them to false.
            // TODO: figure out what to do with them.
            isFirstRun: false,
            isFullscreen: false,
        }, airtableInterface);
    }

    constructor(
        sdkInitData: BlockSdkInitData,
        airtableInterface: AirtableInterfaceBackend,
    ) {
        this.globalConfig = new GlobalConfig(sdkInitData.initialKvValuesByKey, airtableInterface);
        this.base = new Base(sdkInitData.baseData, airtableInterface);
        this.models = models;
        this.installationId = sdkInitData.blockInstallationId;

        this.runInfo = Object.freeze({
            isFirstRun: sdkInitData.isFirstRun,
            isDevelopmentMode: sdkInitData.isDevelopmentMode,
        });

        this.__airtableInterface = airtableInterface;

        // TODO: freeze this object before we ship the code editor.
    }
}

module.exports = BackendBlockSdk;
