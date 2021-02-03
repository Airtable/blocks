import {spawnError} from './error_utils';
import {Result} from './result';

export interface RemoteConfig {
    blockId: string;
    baseId: string;
    server?: string;
    apiKeyName?: string;
    bundleCdn?: string;
}

export function validateRemoteConfig(value: unknown): Result<RemoteConfig> {
    if (typeof value !== 'object' || value === null) {
        return {err: spawnError('"remote.json" should be a non-null object')};
    } else if (Array.isArray(value)) {
        return {err: spawnError('"remote.json" should be a non-array object')};
    }

    const config = value as RemoteConfig;
    if (typeof config.blockId !== 'string') {
        return {err: spawnError('"remote.json".blockId should be a string')};
    }

    if (typeof config.baseId !== 'string') {
        return {err: spawnError('"remote.json".baseId should be a string')};
    }

    if (!['undefined', 'string'].includes(typeof config.server)) {
        return {err: spawnError('"remote.json".server should be undefined or a string')};
    }

    if (!['undefined', 'string'].includes(typeof config.apiKeyName)) {
        return {err: spawnError('"remote.json".apiKeyName should be undefined or a string')};
    }

    if (!['undefined', 'string'].includes(typeof config.bundleCdn)) {
        return {err: spawnError('"remote.json".bundleCdn should be undefined or a string')};
    }

    return {value: config};
}
