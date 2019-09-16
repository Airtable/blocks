// @flow

const path = require('path');
const request = require('request');
const util = require('util');
const url = require('url');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const fsUtils = require('../fs_utils');

import type {Response} from 'request';

const requestAsync = util.promisify(request);

async function fetchBackendSdkAsync(backendSdkBaseUrl: string | null): Promise<string> {
    const sdkUrl = url.resolve(
        backendSdkBaseUrl || blockCliConfigSettings.BACKEND_SDK_BASE_URL,
        blockCliConfigSettings.BACKEND_SDK_URL_PATH,
    );
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

async function downloadBackendSdkAsync(
    backendSdkBaseUrl: string | null,
    canUseCachedBackendSdk: boolean,
): Promise<string> {
    const backendSdkBaseUrlSuffix = backendSdkBaseUrl
        ? `-${Buffer.from(backendSdkBaseUrl).toString('base64')}`
        : '';
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
        const backendSdkJs = await fetchBackendSdkAsync(backendSdkBaseUrl);
        await fsUtils.mkdirPathAsync(path.dirname(cachedBackendSdkJsFilePath));
        await fsUtils.writeFileAsync(cachedBackendSdkJsFilePath, backendSdkJs, 'utf-8');
        return backendSdkJs;
    }
}

module.exports = downloadBackendSdkAsync;
