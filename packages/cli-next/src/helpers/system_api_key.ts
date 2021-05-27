import {Result} from './result';
import {userConfigGetApiKey, userConfigSetApiKey} from './config_user';

import {spawnUnexpectedError, spawnUserError} from './error_utils';
import {cast} from './private_utils';
import {System} from './system';

import {
    findGlobalUserConfigAsync,
    findAppDirectoryUserConfigAsync,
    readGlobalUserConfigAsync,
    readAppDirectoryUserConfigAsync,
    writeGlobalUserConfigAsync,
    writeAppDirectoryUserConfigAsync,
} from './system_config';

export enum SystemApiKeyErrorName {
    SYSTEM_API_KEY_NOT_FOUND = 'systemApiKeyNotFound',
}

export interface SystemApiKeyErrorNotFound {
    type: SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND;
}

export type SystemApiKeyErrorInfo = SystemApiKeyErrorNotFound;

export enum ConfigLocation {
    USER = 'user',
    APP = 'app',
}

const VALID_API_KEY_REGEX = /^key[a-zA-Z0-9]{14}$/;

export function isValidApiKey(apiKey: unknown): apiKey is string {
    return typeof apiKey === 'string' && VALID_API_KEY_REGEX.test(apiKey);
}

const VALID_API_KEY_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function isValidApiKeyName(apiKeyName: string) {
    return VALID_API_KEY_NAME_REGEX.test(apiKeyName);
}

export function castLocation(location: string): Result<ConfigLocation> {
    const l = location.toLowerCase() as ConfigLocation;
    switch (l) {
        case ConfigLocation.USER:
            return {value: l};
        case ConfigLocation.APP:
            return {value: l};
        default:
            return {err: spawnUnexpectedError('Unknown user config location: %s', cast<never>(l))};
    }
}

export async function findApiKeyConfigPathAsync(
    sys: System,
    location: ConfigLocation,
): Promise<string> {
    switch (location) {
        case ConfigLocation.APP:
            return await findAppDirectoryUserConfigAsync(sys);
        case ConfigLocation.USER:
            return await findGlobalUserConfigAsync(sys);
        default:
            throw spawnUnexpectedError('Unknown user config location: %s', cast<never>(location));
    }
}

export async function readGlobalApiKeyAsync(
    sys: System,
    apiKeyName?: string | null,
): Promise<Result<string>> {
    const userPathUserConfig = await readGlobalUserConfigAsync(sys);
    const userApiKey = userConfigGetApiKey(userPathUserConfig.value, apiKeyName);
    if (userApiKey) {
        return {value: userApiKey};
    }

    return {err: spawnUserError({type: SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND})};
}

export async function readApiKeyAsync(
    sys: System,
    apiKeyName?: string | null,
): Promise<Result<string>> {
    const appRootUserConfig = await readAppDirectoryUserConfigAsync(sys);
    const appRootApiKey = userConfigGetApiKey(appRootUserConfig.value, apiKeyName);
    if (appRootApiKey) {
        return {value: appRootApiKey};
    }

    return await readGlobalApiKeyAsync(sys, apiKeyName);
}

export async function writeApiKeyAsync(
    sys: System,
    location: ConfigLocation,
    apiKey: string,
    apiKeyName?: string | null,
): Promise<void> {
    let userConfig;
    switch (location) {
        case ConfigLocation.APP:
            userConfig = (await readAppDirectoryUserConfigAsync(sys)).value;
            await writeAppDirectoryUserConfigAsync(
                sys,
                userConfigSetApiKey(userConfig, apiKey, apiKeyName),
            );
            break;
        case ConfigLocation.USER:
            userConfig = (await readGlobalUserConfigAsync(sys)).value;
            await writeGlobalUserConfigAsync(
                sys,
                userConfigSetApiKey(userConfig, apiKey, apiKeyName),
            );
            break;
        default:
            throw spawnUnexpectedError('Unknown user config location %s', cast<never>(location));
    }
}
