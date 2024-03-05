// @flow

const path = require('path');
const request = require('postman-request');
const util = require('util');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const fsUtils = require('./fs_utils');

import type {Response} from 'postman-request';
import type {RemoteJson} from '../types/remote_json_type';

const requestAsync = util.promisify(request);

async function _fetchBackendSdkAsync(backendSdkUrl: string): Promise<string> {
    const response: Response = await requestAsync({
        method: 'GET',
        uri: backendSdkUrl,
        headers: {
            'User-Agent': blockCliConfigSettings.USER_AGENT,
        },
    });
    if (response.statusCode !== 200) {
        throw new Error(
            `Failed to download backend SDK from ${backendSdkUrl} with status code: ${response.statusCode}`,
        );
    }
    return response.body;
}

function _getFilepathForCachedBackendSdkFromLocalMachine(backendSdkUrl: string): string {
    const backendSdkUrl64 = `-${Buffer.from(backendSdkUrl).toString('base64')}`;
    const cachedBackendSdkJsFilePath = path.join(
        blockCliConfigSettings.TEMP_DIR_PATH,
        `${blockCliConfigSettings.BACKEND_SDK_MODULE}-cached${backendSdkUrl64}.js`,
    );

    return cachedBackendSdkJsFilePath;
}

async function _setLocalBackendSdkCacheAsync(
    backendSdkUrl: string,
    backendSdkJs: string,
): Promise<void> {
    const cachedBackendSdkJsFilePath = _getFilepathForCachedBackendSdkFromLocalMachine(
        backendSdkUrl,
    );

    await fsUtils.mkdirPathAsync(path.dirname(cachedBackendSdkJsFilePath));
    await fsUtils.writeFileAsync(cachedBackendSdkJsFilePath, backendSdkJs, 'utf-8');
}

async function _getLocalBackendSdkCacheIfExistsAsync(
    backendSdkUrl: string,
    canUseCachedBackendSdk: boolean,
): Promise<string | null> {
    const cachedBackendSdkJsFilePath = _getFilepathForCachedBackendSdkFromLocalMachine(
        backendSdkUrl,
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
        return null;
    }
}

function _formulateBackendSdkUrlFromRemoteName(remoteNameIfExists?: string | null): string {
    let backendSdkUrlBase: string;
    let hyperbaseRunEnvironment: string;
    switch (remoteNameIfExists) {
        case 'staging':
            backendSdkUrlBase = `https://${blockCliConfigSettings.BACKEND_SDK_BASE_URL_STAGING}`;
            hyperbaseRunEnvironment = remoteNameIfExists;
            break;
        case 'alpha':
            backendSdkUrlBase = `https://${blockCliConfigSettings.BACKEND_SDK_BASE_URL_ALPHA}`;
            hyperbaseRunEnvironment = remoteNameIfExists;
            break;
        case 'bravo':
            backendSdkUrlBase = `https://${blockCliConfigSettings.BACKEND_SDK_BASE_URL_BRAVO}`;
            hyperbaseRunEnvironment = remoteNameIfExists;
            break;
        case 'development':
            backendSdkUrlBase = `https://${blockCliConfigSettings.BACKEND_SDK_BASE_URL_DEVELOPMENT}`;
            hyperbaseRunEnvironment = remoteNameIfExists;

            break;
        default:
            backendSdkUrlBase = `https://${blockCliConfigSettings.BACKEND_SDK_BASE_URL_PRODUCTION}`;
            hyperbaseRunEnvironment = 'production';
    }

    const backendSdkUrl = new URL(
        `${blockCliConfigSettings.BACKEND_SDK_JS_COMPILED_ESBUILD_URL_PATH}/${hyperbaseRunEnvironment}/${blockCliConfigSettings.BACKEND_SDK_MODULE}.js`,
        backendSdkUrlBase,
    );
    return backendSdkUrl.toString();
}

async function downloadBackendSdkAsync(args: {
    backendSdkUrlIfExists: string | null,
    remoteJson: RemoteJson,
    canUseCachedBackendSdk: boolean,
}): Promise<string> {
    const {backendSdkUrlIfExists, remoteJson, canUseCachedBackendSdk} = args;

    let backendSdkJsIfExists: string | null;
    // If the backendSdkUrl argument is provided, always fetch the SDK JS straight from the network using backendSdkUrl,
    // and refresh the locally cached version of the backend block SDK. Reason for this is because it provides the
    // developer a lever to fetch directly from the hyperbase enviornment, as well as refresh their local machine's
    // cache when running the block command with a CLI option flag:
    // e.g. `block release --backend-sdk-url https://example.com`
    if (backendSdkUrlIfExists) {
        backendSdkJsIfExists = await _fetchBackendSdkAsync(backendSdkUrlIfExists);
        await _setLocalBackendSdkCacheAsync(backendSdkUrlIfExists, backendSdkJsIfExists);

        return backendSdkJsIfExists;
    } else {
        const backendSdkJsUrl = _formulateBackendSdkUrlFromRemoteName(remoteJson.remoteName);
        backendSdkJsIfExists = await _getLocalBackendSdkCacheIfExistsAsync(
            backendSdkJsUrl,
            canUseCachedBackendSdk,
        );

        if (backendSdkJsIfExists === null) {
            backendSdkJsIfExists = await _fetchBackendSdkAsync(backendSdkJsUrl);
            await _setLocalBackendSdkCacheAsync(backendSdkJsUrl, backendSdkJsIfExists);
        }

        return backendSdkJsIfExists;
    }
}

module.exports = downloadBackendSdkAsync;
