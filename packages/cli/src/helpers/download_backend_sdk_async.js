// @flow

const request = require('request');
const util = require('util');
const url = require('url');
const blockCliConfigSettings = require('../config/block_cli_config_settings');

import type {Response} from 'request';

const requestAsync = util.promisify(request);

async function downloadBackendSdkAsync(backendSdkBaseUrl: string | null): Promise<Response> {
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
    return response;
}

module.exports = downloadBackendSdkAsync;
