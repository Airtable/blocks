import {spawnUserError, UserError} from './error_utils';
import {Result} from './result';

export enum AppConfigErrorName {
    APP_CONFIG_IS_NOT_VALID = 'appConfigIsNotValid',
}

export interface AppConfigErrorInvalid {
    type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID;
    file?: string;
    message: string;
}

export type AppConfigErrorInfo = AppConfigErrorInvalid;

export interface AppBundlerConfig {
    /** Resolvable module to run to bundle the block. */
    readonly module?: string;

    /** Options passed to the bundler by the CLI. */
    readonly options?: null;
}

export interface AppConfig {
    readonly version?: '1.0';

    /** Frontend entry file for application. */
    readonly frontendEntry: string;

    /** Swappable bundler extension and options. */
    readonly bundler?: AppBundlerConfig;
}

export function validateAppConfig(
    value: unknown,
): Result<AppConfig, UserError<AppConfigErrorInfo>> {
    if (typeof value !== 'object' || value === null) {
        return {
            err: spawnUserError({
                type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                message: 'should be a non-null object',
            }),
        };
    } else if (Array.isArray(value)) {
        return {
            err: spawnUserError({
                type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                message: 'should be a non-array object',
            }),
        };
    }

    const config = value as AppConfig;
    if (!['1.0', undefined].includes(config.version)) {
        return {
            err: spawnUserError({
                type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                message: 'version should be "1.0" or undefined',
            }),
        };
    }

    if (typeof config.frontendEntry !== 'string') {
        return {
            err: spawnUserError({
                type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                message: 'frontendEntry should be a string',
            }),
        };
    }

    if ('bundler' in config) {
        if (typeof config.bundler === 'object' && config.bundler !== null) {
            if ('module' in config.bundler && typeof config.bundler.module !== 'string') {
                return {
                    err: spawnUserError({
                        type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                        message: 'bundler.module should be a string or not set',
                    }),
                };
            }
            if ('options' in config.bundler && typeof config.bundler.options !== 'object') {
                return {
                    err: spawnUserError({
                        type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                        message: 'bundler.options should be an object',
                    }),
                };
            }
        } else {
            return {
                err: spawnUserError({
                    type: AppConfigErrorName.APP_CONFIG_IS_NOT_VALID,
                    message: 'bundler should be an object',
                }),
            };
        }
    }

    return {value: config};
}

export function appConfigGetFrontendEntry(appConfig: AppConfig): string {
    return appConfig.frontendEntry;
}
