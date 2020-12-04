import {Result} from './result';
import {
    createDefaultUserConfig,
    userConfigHasApiKey,
    userConfigGetApiKey,
    userConfigSetApiKey,
} from './config_user';

import {spawnError} from './error_utils';
import {cast} from './private_utils';
import {System} from './system';

import {
    findUserConfigUserPathAsync,
    findUserConfigAppPathAsync,
    readUserConfigUserPathAsync,
    readUserConfigAppRootAsync,
    writeUserConfigUserPathAsync,
    writeUserConfigAppPathAsync,
} from './system_config';

export enum ConfigLocation {
    USER = 'user',
    APP = 'app',
}

export function isValidApiKey(apiKey: unknown): apiKey is string {
    return typeof apiKey === 'string' && apiKey.startsWith('key');
}

export function castLocation(location: string): Result<ConfigLocation> {
    const l = location.toLowerCase() as ConfigLocation;
    switch (l) {
        case ConfigLocation.USER:
            return {value: l};
        case ConfigLocation.APP:
            return {value: l};
        default:
            return {err: spawnError('Unknown user config location: %s', cast<never>(l))};
    }
}

export async function findApiKeyConfigPathAsync(
    sys: System,
    location: ConfigLocation,
): Promise<string> {
    switch (location) {
        case ConfigLocation.APP:
            return await findUserConfigAppPathAsync(sys);
        case ConfigLocation.USER:
            return await findUserConfigUserPathAsync(sys);
        default:
            throw spawnError('Unknown user config location: %s', cast<never>(location));
    }
}

export async function readApiKeyAsync(sys: System): Promise<Result<string>> {
    const appRootUserConfig = await readUserConfigAppRootAsync(sys);
    if (appRootUserConfig.value && userConfigHasApiKey(appRootUserConfig.value)) {
        return {value: userConfigGetApiKey(appRootUserConfig.value)};
    }

    const userPathUserConfig = await readUserConfigUserPathAsync(sys);
    if (userPathUserConfig.value && userConfigHasApiKey(userPathUserConfig.value)) {
        return {value: userConfigGetApiKey(userPathUserConfig.value)};
    }

    return {err: spawnError('No available airtableApiKey from configuration files')};
}

export async function writeApiKeyAsync(
    sys: System,
    location: ConfigLocation,
    apiKey: string,
): Promise<void> {
    let userConfig;
    switch (location) {
        case ConfigLocation.APP:
            userConfig = (await readUserConfigAppRootAsync(sys)).value || createDefaultUserConfig();
            await writeUserConfigAppPathAsync(sys, userConfigSetApiKey(userConfig, apiKey));
            break;
        case ConfigLocation.USER:
            userConfig =
                (await readUserConfigUserPathAsync(sys)).value || createDefaultUserConfig();
            await writeUserConfigUserPathAsync(sys, userConfigSetApiKey(userConfig, apiKey));
            break;
        default:
            throw spawnError('Unknown user config location %s', cast<never>(location));
    }
}
