// @flow

const path = require('path');
const request = require('postman-request');
const util = require('util');
const url = require('url');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const fsUtils = require('./fs_utils');

import type {Response} from 'postman-request';
import type {RemoteJson} from '../types/remote_json_type.js';

const requestAsync = util.promisify(request);

function _getBackendSdkBaseUrl(
    backendSdkBaseUrlIfExists: string | null,
    remoteJson: RemoteJson,
): string {
    if (backendSdkBaseUrlIfExists) {
        return backendSdkBaseUrlIfExists;
    } else if (remoteJson.server) {
        // HACKISH: The 'server' attribute in RemoteJson files point to the API URL
        // of our Airtable servers. However, the backend SDK base URL should come from
        // the base Airtable URL. Therefore, we strip out the following API prefix patterns
        // we use for our API URLs:
        //   * 'api-' - for staging env
        //   * 'api.' - for prod or dev env
        const apiUrl = remoteJson.server;

        return apiUrl.replace('api-', '').replace('api.', '');
    } else {
        return blockCliConfigSettings.BACKEND_SDK_BASE_URL;
    }
}

async function _fetchBackendSdkAsync(backendSdkBaseUrl: string): Promise<string> {
    const sdkUrl = url.resolve(backendSdkBaseUrl, blockCliConfigSettings.BACKEND_SDK_URL_PATH);
    const response: Response = await requestAsync({
        method: 'GET',
        uri: sdkUrl,
        headers: {
            'User-Agent': blockCliConfigSettings.USER_AGENT,
        },
    });
    if (response.statusCode !== 200) {
        throw new Error(
            `Failed to download backend SDK from ${sdkUrl} with status code: ${response.statusCode}`,
        );
    }
    return response.body;
}

async function downloadBackendSdkAsync(args: {
    backendSdkBaseUrlIfExists: string | null,
    remoteJson: RemoteJson,
    canUseCachedBackendSdk: boolean,
}): Promise<string> {
    const {backendSdkBaseUrlIfExists, remoteJson, canUseCachedBackendSdk} = args;
    const backendSdkBaseUrl = _getBackendSdkBaseUrl(backendSdkBaseUrlIfExists, remoteJson);

    const backendSdkBaseUrlSuffix = `-${Buffer.from(backendSdkBaseUrl).toString('base64')}`;
    const cachedBackendSdkJsFilePath = path.join(
        blockCliConfigSettings.TEMP_DIR_PATH,
        `${blockCliConfigSettings.BACKEND_SDK_MODULE}-cached${backendSdkBaseUrlSuffix}.js`,
    );
    const stats = await fsUtils.statIfExistsAsync(cachedBackendSdkJsFilePath);
    const now = new Date();
    if (
        canUseCachedBackendSdk &&
        stats &&
        stats.size > 0 &&
        stats.mtime.getTime() + blockCliConfigSettings.BACKEND_SDK_CACHE_TTL_MS > now.getTime()
    ) {
        return await fsUtils.readFileAsync(cachedBackendSdkJsFilePath, 'utf-8');
    } else {
        const backendSdkJs = await _fetchBackendSdkAsync(backendSdkBaseUrl);
        await fsUtils.mkdirPathAsync(path.dirname(cachedBackendSdkJsFilePath));
        await fsUtils.writeFileAsync(cachedBackendSdkJsFilePath, backendSdkJs, 'utf-8');
        return backendSdkJs;
    }
}

module.exports = downloadBackendSdkAsync;
