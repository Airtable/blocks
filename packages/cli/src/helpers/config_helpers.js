// @flow
const os = require('os');
const path = require('path');

const {CONFIG_FILE_NAME} = require('../config/block_cli_config_settings');
const {ConfigKeys, ConfigLocations, DEFAULT_API_KEY_NAME} = require('../types/config_helpers_type');
const getBlockDirPathModule = require('../get_block_dir_path');
const fsUtils = require('../fs_utils');

import type {
    ConfigLocation,
    UserOrBlockConfig,
    AirtableApiKeyOrApiKeyByName,
} from '../types/config_helpers_type';
import type {Result} from '../types/result';

function _parseAndValidateUserOrBlockConfig(
    fileContents: mixed,
    configPath: string,
): Result<UserOrBlockConfig> {
    if (Array.isArray(fileContents)) {
        return {err: new Error('config file should not be an Array')};
    }

    if (fileContents instanceof Object) {
        if (fileContents.airtableApiKey !== undefined) {
            if (
                fileContents.airtableApiKey instanceof Object ||
                typeof fileContents.airtableApiKey === 'string'
            ) {
                return {value: fileContents};
            }
        } else {
            return {value: fileContents};
        }
    }

    return {err: new Error('invalid config file format at ' + configPath)};
}

function getConfigPath(location: ConfigLocation): string {
    let folderPath: string;
    if (location === ConfigLocations.BLOCK) {
        folderPath = getBlockDirPathModule.getBlockDirPath();
    } else if (location === ConfigLocations.USER) {
        if (os.platform() === 'win32') {
            folderPath = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
        } else {
            folderPath = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
        }
    } else {
        throw new Error('Unsupported config location: ' + location);
    }
    return path.join(folderPath, CONFIG_FILE_NAME);
}

async function _getConfigIfExistsAsync(
    location: ConfigLocation,
): Promise<UserOrBlockConfig | null> {
    const configPath = getConfigPath(location);
    const fileContents = await fsUtils.readJsonIfExistsAsync(configPath);

    if (fileContents === null) {
        return null;
    }

    const userOrBlockConfig = _parseAndValidateUserOrBlockConfig(fileContents, configPath);
    if (userOrBlockConfig.err) {
        throw userOrBlockConfig.err;
    }
    return userOrBlockConfig.value;
}

async function _getApiKeyFromConfigIfExistsAsync(
    location: ConfigLocation,
    apiKeyName: string | null,
): Promise<AirtableApiKeyOrApiKeyByName | null> {
    const configData = await _getConfigIfExistsAsync(location);

    if (configData === null || !configData.hasOwnProperty(ConfigKeys.API_KEY)) {
        return null;
    }
    const apiKeyOrApiKeyByRemote = configData[ConfigKeys.API_KEY];

    let apiKey;
    if (typeof apiKeyOrApiKeyByRemote === 'string') {
        if (apiKeyName === DEFAULT_API_KEY_NAME || apiKeyName === null) {
            apiKey = apiKeyOrApiKeyByRemote;
        } else {
            // Return null in this case because the config value is just a string but a lookup by
            // apiKeyName was requested; a string type should only represent the default case.
            apiKey = null;
        }
    } else if (apiKeyOrApiKeyByRemote instanceof Object) {
        if (apiKeyName !== null) {
            apiKey = apiKeyOrApiKeyByRemote[apiKeyName];
        } else {
            apiKey = apiKeyOrApiKeyByRemote[DEFAULT_API_KEY_NAME];
        }
    } else {
        throw new Error('API Key from config is an incorrect format');
    }

    return apiKey || null;
}

async function setApiKeyAsync(
    location: ConfigLocation,
    apiKey: string,
    apiKeyName: string | null,
): Promise<void> {
    // So this is forwards compatible, we don't clobber any existing config settings (except for
    // apiKey, of course!)
    const currentConfig = await _getConfigIfExistsAsync(location);

    const newConfig = currentConfig !== null ? {...currentConfig} : {};

    const existingApiKeyOrApiKeyObject = newConfig[ConfigKeys.API_KEY];
    if (existingApiKeyOrApiKeyObject instanceof Object) {
        const remoteNameToUpdate = apiKeyName || DEFAULT_API_KEY_NAME;
        existingApiKeyOrApiKeyObject[remoteNameToUpdate] = apiKey;
    } else {
        if (apiKeyName === null) {
            newConfig[ConfigKeys.API_KEY] = apiKey;
        } else {
            const apiKeyObject = {};
            if (existingApiKeyOrApiKeyObject) {
                apiKeyObject[DEFAULT_API_KEY_NAME] = existingApiKeyOrApiKeyObject;
            }
            apiKeyObject[apiKeyName] = apiKey;
            newConfig[ConfigKeys.API_KEY] = apiKeyObject;
        }
    }

    await fsUtils.outputJsonAsync(getConfigPath(location), newConfig);
}

async function getApiKeyIfExistsAsync(
    apiKeyName: string | null,
): Promise<AirtableApiKeyOrApiKeyByName | null> {
    // Prioritise reading the key from blockConfig if it exists, and userConfig if it doesn't.
    // TODO: Similarly to setApiKeyAsync, if we support multiple config values in the future, we'll
    // have to update our getters to read from all config locations and merge results, as each
    // config file could contain any subset of config keys.
    const blockConfigApiKey = await _getApiKeyFromConfigIfExistsAsync(
        ConfigLocations.BLOCK,
        apiKeyName,
    );
    if (blockConfigApiKey !== null) {
        return blockConfigApiKey;
    }

    return await _getApiKeyFromConfigIfExistsAsync(ConfigLocations.USER, apiKeyName);
}

async function hasApiKeyAsync(
    location: ConfigLocation,
    apiKeyName: string | null,
): Promise<boolean> {
    return (await _getApiKeyFromConfigIfExistsAsync(location, apiKeyName)) !== null;
}

module.exports = {
    getConfigPath,
    setApiKeyAsync,
    getApiKeyIfExistsAsync,
    hasApiKeyAsync,
};
