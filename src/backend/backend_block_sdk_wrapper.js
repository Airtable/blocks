// @flow
const BackendBlockSdk = require('block_sdk/backend/backend_block_sdk');
const models = require('block_sdk/shared/models/models');
const invariant = require('invariant');

import type Base from 'block_sdk/shared/models/base';
import type GlobalConfig from 'block_sdk/shared/global_config';
import type AirtableInterfaceBackend from 'block_sdk/backend/airtable_interface_backend';
import type {RunInfo} from 'block_sdk/shared/block_sdk_interface';
import type AirtableApiClient from 'block_sdk/backend/airtable_api_client';

// NOTE: we wrap the sdk to get around the following issue:
// The first time the SDK is required on this lambda instance, node will
// parse and evaluate the SDK stub, which just references global[GLOBAL_SDK_VARIABLE_NAME].
// On subsequent requests, the cached value will be returned, so we can't
// just update global[GLOBAL_SDK_VARIABLE_NAME] with a new instance of the SDK.
// Instead, we wrap the SDK and replace it's internal sdk instance by reference
// on each invocation. Alternatively we could delete everything out of require.cache
// but that will incur parse on every request, and if we're not careful can lead
// to memory leaks, e.g.: https://github.com/nodejs/node/issues/14569

class BackendBlockSdkWrapper {
    _sdk: BackendBlockSdk | null;
    constructor() {
        this._sdk = null;
    }
    async __initializeSdkForEventAsync(eventData: {
        applicationId: string,
        blockInstallationId: string,
        kvValuesByKey: Object | void,
        apiAccessPolicyString: string,
        apiBaseUrl: string,
    }): Promise<void> {
        this._sdk = await BackendBlockSdk.__constructSdkForEventAsync(eventData);
    }
    _getSdkInstance(): BackendBlockSdk {
        invariant(this._sdk, 'SDK is not initialized');
        return this._sdk;
    }
    get apiClient(): AirtableApiClient {
        // Temporarily allow direct access to the API client so we can
        // build blocks while we figure out the backend SDK.
        // Once we're happy with the backend SDK, we can remove this.
        return this.__airtableInterface.apiClient;
    }
    get base(): Base {
        return this._getSdkInstance().base;
    }
    get globalConfig(): GlobalConfig {
        return this._getSdkInstance().globalConfig;
    }
    get models(): typeof models {
        return this._getSdkInstance().models;
    }
    get installationId(): string {
        return this._getSdkInstance().installationId;
    }
    get runInfo(): RunInfo {
        return this._getSdkInstance().runInfo;
    }
    get __airtableInterface(): AirtableInterfaceBackend {
        return this._getSdkInstance().__airtableInterface;
    }
}

module.exports = BackendBlockSdkWrapper;
