import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../settings';

import {Result} from './result';

import {AppConfig, AppConfigErrorInfo, AppConfigErrorName, validateAppConfig} from './config_app';
import {
    RemoteConfig,
    RemoteConfigErrorInfo,
    RemoteConfigErrorName,
    validateRemoteConfig,
} from './config_remote';
import {
    validateUserConfig,
    UserConfig,
    UserConfigErrorName,
    UserConfigErrorInfo,
} from './config_user';
import {
    findAncestorDirIncludingNameAsync,
    mkdirpAsync,
    readJsonIfExistsAsync,
    SystemExtraErrorName,
} from './system_extra';
import {System} from './system';
import {spawnUserError, UserError} from './error_utils';

export enum SystemConfigErrorName {
    SYSTEM_CONFIG_INVALID_REMOTE_NAME = 'systemConfigInvalidRemoteName',
    SYSTEM_CONFIG_APP_DIRECTORY_NOT_FOUND = 'systemConfigAppDirectoryNotFound',
}

export interface SystemConfigInvalidRemoteNameError {
    type: SystemConfigErrorName.SYSTEM_CONFIG_INVALID_REMOTE_NAME;
    name: string;
}

export interface SystemConfigAppDirectoryNotFoundError {
    type: SystemConfigErrorName.SYSTEM_CONFIG_APP_DIRECTORY_NOT_FOUND;
}

export type SystemConfigErrorInfo =
    | SystemConfigInvalidRemoteNameError
    | SystemConfigAppDirectoryNotFoundError;

async function getUserPathAsync({
    path,
    process: {env},
    os: {platform, homedir},
}: System): Promise<string> {
    if (platform() === 'win32') {
        return env.APPDATA || path.join(homedir(), 'AppData', 'Roaming');
    } else {
        return env.XDG_CONFIG_HOME || path.join(homedir(), '.config');
    }
}

export async function findGlobalUserConfigAsync(sys: System): Promise<string> {
    return sys.path.join(await getUserPathAsync(sys), USER_CONFIG_FILE_NAME);
}

export async function findAppDirectoryAsync(sys: System, dirpath: string): Promise<string> {
    try {
        return await findAncestorDirIncludingNameAsync(sys, dirpath, BLOCK_FILE_NAME);
    } catch (err) {
        if (err?.__userInfo?.type === SystemExtraErrorName.SYSTEM_EXTRA_DIR_WITH_FILE_NOT_FOUND) {
            throw spawnUserError({
                type: SystemConfigErrorName.SYSTEM_CONFIG_APP_DIRECTORY_NOT_FOUND,
            });
        }
        throw err;
    }
}

/**
 * Find the path to a file in the App's root directory.
 *
 * @param sys Host system to search
 * @param filename Name of the file in the App root directory
 * @param workingdir Working directory function starts its search from
 */
async function findAppDirectoryFileAsync(
    sys: System,
    filename: string,
    workingdir = sys.process.cwd(),
): Promise<string> {
    const {path} = sys;

    const appRoot = await findAppDirectoryAsync(sys, workingdir);
    return path.join(appRoot, filename);
}

/**
 * Find the AppConfig file in the App's root directory.
 *
 * @param sys Host system to search
 * @param workingdir Directory to start search from
 */
export async function findAppConfigAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<string> {
    return await findAppDirectoryFileAsync(sys, BLOCK_FILE_NAME, workingdir);
}

export async function findRemoteConfigPathByNameAsync(
    sys: System,
    workingdir?: string,
    remoteName?: string,
) {
    const remoteFile = remoteName
        ? `${remoteName}.${REMOTE_JSON_BASE_FILE_PATH}`
        : REMOTE_JSON_BASE_FILE_PATH;
    const appRoot = await findAppDirectoryAsync(sys, workingdir ?? sys.process.cwd());
    return sys.path.join(appRoot, BLOCK_CONFIG_DIR_NAME, remoteFile);
}

export async function findAppDirectoryUserConfigAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<string> {
    return await findAppDirectoryFileAsync(sys, USER_CONFIG_FILE_NAME, workingdir);
}

export async function readAppConfigAsync(
    sys: System,
    appConfigPath: string,
): Promise<Result<AppConfig, UserError<AppConfigErrorInfo>>> {
    const result = validateAppConfig(await readJsonIfExistsAsync(sys, appConfigPath));
    if (result.err?.__userInfo?.type === AppConfigErrorName.APP_CONFIG_IS_NOT_VALID) {
        result.err.__userInfo.file = sys.path.relative(sys.process.cwd(), appConfigPath);
    }
    return result;
}

export async function readRemoteConfigAsync(
    sys: System,
    remotePath: string,
): Promise<Result<RemoteConfig, UserError<RemoteConfigErrorInfo>>> {
    const result = validateRemoteConfig(await readJsonIfExistsAsync(sys, remotePath));
    if (result.err?.__userInfo?.type === RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID) {
        result.err.__userInfo.file = sys.path.relative(sys.process.cwd(), remotePath);
    }
    return result;
}

async function readUserConfigAsync(
    sys: System,
    file: string,
): Promise<Result<UserConfig, UserError<UserConfigErrorInfo>>> {
    const result = validateUserConfig(await readJsonIfExistsAsync(sys, file));
    if (result.err?.__userInfo?.type === UserConfigErrorName.USER_CONFIG_IS_NOT_VALID) {
        result.err.__userInfo.file = sys.path.relative(sys.process.cwd(), file);
    }
    return result;
}

export async function readGlobalUserConfigAsync(sys: System): Promise<Result<UserConfig>> {
    return await readUserConfigAsync(sys, await findGlobalUserConfigAsync(sys));
}

export async function readAppDirectoryUserConfigAsync(sys: System): Promise<Result<UserConfig>> {
    return await readUserConfigAsync(sys, await findAppDirectoryUserConfigAsync(sys));
}

async function writeUserConfigAsync(
    sys: System,
    configPath: string,
    config: UserConfig,
): Promise<void> {
    const {
        fs: {writeFileAsync},
        path,
    } = sys;

    await mkdirpAsync(sys, path.dirname(configPath));
    await writeFileAsync(configPath, Buffer.from(JSON.stringify(config, null, '    ')));
}

export async function writeGlobalUserConfigAsync(sys: System, config: UserConfig): Promise<void> {
    await writeUserConfigAsync(sys, await findGlobalUserConfigAsync(sys), config);
}

export async function writeAppDirectoryUserConfigAsync(
    sys: System,
    config: UserConfig,
): Promise<void> {
    await writeUserConfigAsync(sys, await findAppDirectoryUserConfigAsync(sys), config);
}

export async function writeRemoteConfigAsync(
    sys: System,
    configPath: string,
    config: RemoteConfig,
): Promise<void> {
    const {fs, path} = sys;

    await mkdirpAsync(sys, path.dirname(configPath));
    await fs.writeFileAsync(configPath, Buffer.from(JSON.stringify(config, null, '    ')));
}

const VALID_REMOTE_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateRemoteName(name: string): Result<string> {
    if (VALID_REMOTE_NAME_REGEX.test(name)) {
        return {value: name};
    }
    return {
        err: spawnUserError({
            type: SystemConfigErrorName.SYSTEM_CONFIG_INVALID_REMOTE_NAME,
            name,
        }),
    };
}
