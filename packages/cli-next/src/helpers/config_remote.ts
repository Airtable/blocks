import {spawnUserError, UserError} from './error_utils';
import {Result} from './result';

export enum RemoteConfigErrorName {
    REMOTE_CONFIG_IS_NOT_VALID = 'remoteConfigIsNotValid',
}

export interface RemoteConfigErrorInvalid {
    type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID;
    file?: string;
    message: string;
}

export type RemoteConfigErrorInfo = RemoteConfigErrorInvalid;

export interface RemoteConfig {
    blockId: string;
    baseId: string;
    server?: string;
    apiKeyName?: string;
    bundleCdn?: string;
}

export function validateRemoteConfig(
    value: unknown,
): Result<RemoteConfig, UserError<RemoteConfigErrorInfo>> {
    if (typeof value !== 'object' || value === null) {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'should be a non-null object',
            }),
        };
    } else if (Array.isArray(value)) {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'should be a non-array object',
            }),
        };
    }

    const config = value as RemoteConfig;
    if (typeof config.blockId !== 'string') {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'blockId should be a string',
            }),
        };
    }

    if (typeof config.baseId !== 'string') {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'baseId should be a string',
            }),
        };
    }

    if (!['undefined', 'string'].includes(typeof config.server)) {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'server should be undefined or a string',
            }),
        };
    }

    if (!['undefined', 'string'].includes(typeof config.apiKeyName)) {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'apiKeyName should be undefined or a string',
            }),
        };
    }

    if (!['undefined', 'string'].includes(typeof config.bundleCdn)) {
        return {
            err: spawnUserError({
                type: RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID,
                message: 'bundleCdn should be undefined or a string',
            }),
        };
    }

    return {value: config};
}
