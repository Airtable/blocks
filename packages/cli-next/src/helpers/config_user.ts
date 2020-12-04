import {Result} from './result';

export interface UserConfig {
    readonly airtableApiKey?: string;
}

export function validateUserConfig(value: unknown): Result<UserConfig> {
    if (typeof value !== 'object' || value === null) {
        return {err: new Error('UserConfig is a non-null object.')};
    }
    if (Array.isArray(value)) {
        return {err: new Error('UserConfig is not an array.')};
    }

    const config = value as UserConfig;
    if (typeof config.airtableApiKey !== 'string') {
        return {err: new Error('UserConfig.airtableApiKey is a string.')};
    }
    return {value: config};
}

export function createDefaultUserConfig(): UserConfig {
    return {};
}

export function userConfigHasApiKey(
    config: UserConfig,
): config is Required<Pick<UserConfig, 'airtableApiKey'>> {
    return Boolean(config.airtableApiKey);
}

export function userConfigGetApiKey(config: Required<Pick<UserConfig, 'airtableApiKey'>>): string {
    return config.airtableApiKey;
}

export function userConfigSetApiKey(config: UserConfig, apiKey: string): UserConfig {
    return {...config, airtableApiKey: apiKey};
}
