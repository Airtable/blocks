import {spawnError} from './error_utils';
import {Result} from './result';

export interface UserConfigApiKeyMap {
    [key: string]: string;
}

export interface UserConfig {
    readonly airtableApiKey?: string | UserConfigApiKeyMap;
}

export function validateUserConfig(value: unknown): Result<UserConfig> {
    if (typeof value !== 'object' || value === null) {
        return {err: spawnError('UserConfig must be an object.')};
    }
    if (Array.isArray(value)) {
        return {err: spawnError('UserConfig must be a non-array object.')};
    }

    const config = value as UserConfig;
    const airtableApiKey = config.airtableApiKey;
    if (typeof airtableApiKey === 'object') {
        const badApiKeyEntry = Object.values(airtableApiKey).find(
            ([key, apiKey]) => typeof apiKey !== 'string',
        );
        if (badApiKeyEntry) {
            return {
                err: spawnError(
                    'UserConfig.airtableApiKey["%s"] must be a string.',
                    badApiKeyEntry[0],
                ),
            };
        }
    } else if (typeof airtableApiKey !== 'string') {
        return {err: spawnError('UserConfig.airtableApiKey must be a string.')};
    }
    return {value: config};
}

export function castApiKeyMap(
    apiKeyMap: UserConfigApiKeyMap | string | undefined,
): UserConfigApiKeyMap {
    if (apiKeyMap === undefined) {
        return {};
    } else if (typeof apiKeyMap === 'string') {
        return {default: apiKeyMap};
    }
    return apiKeyMap;
}

export function apiKeyMapGetApiKey(
    apiKeyMap: UserConfigApiKeyMap | string | undefined,
    apiKeyName: string,
): string | undefined {
    return castApiKeyMap(apiKeyMap)[apiKeyName];
}

export function apiKeyMapSetApiKey(
    apiKeyMap: UserConfigApiKeyMap | string | undefined,
    apiKeyName: string,
    apiKey: string,
): UserConfigApiKeyMap {
    return {...castApiKeyMap(apiKeyMap), [apiKeyName]: apiKey};
}

export function userConfigGetApiKey(
    config: UserConfig | undefined,
    apiKeyName?: string | null,
): string | undefined {
    return apiKeyMapGetApiKey(config?.airtableApiKey, apiKeyName ?? 'default');
}

export function userConfigSetApiKey(
    config: UserConfig | undefined,
    apiKey: string,
    apiKeyName?: string | null,
): UserConfig {
    const newApiKeyMap = apiKeyMapSetApiKey(
        config?.airtableApiKey,
        apiKeyName ?? 'default',
        apiKey,
    );
    return {...config, airtableApiKey: newApiKeyMap};
}
