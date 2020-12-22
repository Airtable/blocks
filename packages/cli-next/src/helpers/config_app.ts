import {spawnError} from './error_utils';
import {Result} from './result';

export interface AppConfig {
    readonly version?: '1.0';

    /** Frontend entry file for application.  */
    readonly frontendEntry: string;
}

export function validateAppConfig(value: unknown): Result<AppConfig> {
    if (typeof value !== 'object' || value === null) {
        return {err: spawnError('"block.json" should be a non-null object')};
    } else if (Array.isArray(value)) {
        return {err: spawnError('"block.json" should be a non-array object')};
    }

    const config = value as AppConfig;
    if (!['1.0', undefined].includes(config.version)) {
        return {err: spawnError('"block.json".version should be "1.0" or undefined')};
    }

    if (typeof config.frontendEntry !== 'string') {
        return {err: spawnError('"block.json".frontendEntry should be a string')};
    }

    return {value: config};
}
