import {spawnUserError, UserError} from './error_utils';
import {Result} from './result';

export enum UserConfigErrorName {
    USER_CONFIG_IS_NOT_VALID = 'userConfigIsNotValid',
}

export interface UserConfigErrorInvalid {
    type: UserConfigErrorName.USER_CONFIG_IS_NOT_VALID;
    file?: string;
    message: string;
}

export type UserConfigErrorInfo = UserConfigErrorInvalid;

export interface UserConfigApiKeyMap {
    [key: string]: string;
}

export interface UserConfig {
    readonly airtableApiKey?: string | UserConfigApiKeyMap;
}

export function validateUserConfig(
    value: unknown,
): Result<UserConfig, UserError<UserConfigErrorInfo>> {
    if (typeof value !== 'object' || value === null) {
        return {
            err: spawnUserError({
                type: UserConfigErrorName.USER_CONFIG_IS_NOT_VALID,
                message: 'should be a non-null object.',
            }),
        };
    }
    if (Array.isArray(value)) {
        return {
            err: spawnUserError({
                type: UserConfigErrorName.USER_CONFIG_IS_NOT_VALID,
                message: 'should be a non-array object.',
            }),
        };
    }

    const config = value as UserConfig;
    const airtableApiKey = config.airtableApiKey;
    if (typeof airtableApiKey === 'object') {
        const badApiKeyEntry = Object.entries(airtableApiKey).find(
            ([key, apiKey]) => typeof apiKey !== 'string',
        );
        if (badApiKeyEntry) {
            return {
                err: spawnUserError({
                    type: UserConfigErrorName.USER_CONFIG_IS_NOT_VALID,
                    message: `airtableApiKey[${JSON.stringify(
                        badApiKeyEntry[0],
                    )}] should be a string.`,
                }),
            };
        }
    } else if (typeof airtableApiKey !== 'string') {
        return {
            err: spawnUserError({
                type: UserConfigErrorName.USER_CONFIG_IS_NOT_VALID,
                message: 'airtableApiKey should be a string or object of strings.',
            }),
        };
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
