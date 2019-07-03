// @flow
const invariant = require('invariant');
const os = require('os');
const path = require('path');

const {CONFIG_FILE_NAME} = require('../config/block_cli_config_settings');
const getBlockDirPathModule = require('../get_block_dir_path');
const fsUtils = require('../fs_utils');

const CONFIG_KEY_API_KEY = 'airtableApiKey';

const ConfigLocations = Object.freeze({
    BLOCK: ('block': 'block'),
    USER: ('user': 'user'),
});

export type ConfigLocation = $Values<typeof ConfigLocations>;

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
): Promise<{[string]: mixed} | null> {
    const configPath = getConfigPath(location);
    const fileContents = await fsUtils.readJsonIfExistsAsync(configPath);

    if ((fileContents instanceof Object && !Array.isArray(fileContents)) || fileContents === null) {
        return fileContents;
    } else {
        // TODO: Handle invalid config files more gracefully
        throw new Error('Invalid config file at ' + configPath);
    }
}

async function _getApiKeyFromConfigIfExistsAsync(location: ConfigLocation): Promise<string | null> {
    const configData = await _getConfigIfExistsAsync(location);

    if (configData !== null && configData.hasOwnProperty(CONFIG_KEY_API_KEY)) {
        const apiKey = configData[CONFIG_KEY_API_KEY];
        invariant(typeof apiKey === 'string', 'expect apiKey to be a string');
        return apiKey;
    }

    return null;
}

async function setApiKeyAsync(location: ConfigLocation, apiKey: string): Promise<void> {
    // So this is forwards compatible, we don't clobber any existing config settings (except for
    // apiKey, of course!)
    const currentConfig = await _getConfigIfExistsAsync(location);

    const newConfig = currentConfig !== null ? {...currentConfig} : {};
    newConfig[CONFIG_KEY_API_KEY] = apiKey;

    await fsUtils.outputJsonAsync(getConfigPath(location), newConfig);
}

async function getApiKeyIfExistsAsync(): Promise<string | null> {
    // Prioritise reading the key from blockConfig if it exists, and userConfig if it doesn't.
    // TODO: Similarly to setApiKeyAsync, if we support multiple config values in the future, we'll
    // have to update our getters to read from all config locations and merge results, as each
    // config file could contain any subset of config keys.
    const blockConfigApiKey = await _getApiKeyFromConfigIfExistsAsync(ConfigLocations.BLOCK);

    if (blockConfigApiKey !== null) {
        return blockConfigApiKey;
    }

    return await _getApiKeyFromConfigIfExistsAsync(ConfigLocations.USER);
}

async function hasApiKeyAsync(location: ConfigLocation): Promise<boolean> {
    return (await _getApiKeyFromConfigIfExistsAsync(location)) !== null;
}

module.exports = {
    ConfigLocations,
    getConfigPath,
    setApiKeyAsync,
    getApiKeyIfExistsAsync,
    hasApiKeyAsync,
    _test: {
        CONFIG_KEY_API_KEY,
    },
};
