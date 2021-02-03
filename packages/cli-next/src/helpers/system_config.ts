import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../settings';

import {Result} from './result';

import {AppConfig, validateAppConfig} from './config_app';
import {RemoteConfig, validateRemoteConfig} from './config_remote';
import {validateUserConfig, UserConfig} from './config_user';
import {
    findAncestorDirIncludingNameAsync,
    mkdirpAsync,
    readJsonIfExistsAsync,
} from './system_extra';
import {System} from './system';

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
    return await findAncestorDirIncludingNameAsync(sys, dirpath, BLOCK_FILE_NAME);
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
 * @param workingdir Working directory function starts its search from
 */
export async function findAppConfigPathAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<string> {
    return await findAppDirectoryFileAsync(sys, BLOCK_FILE_NAME, workingdir);
}

export async function findRemoteConfigPathAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<string> {
    const {path} = sys;

    const appRoot = await findAppDirectoryAsync(sys, workingdir);
    return path.join(appRoot, BLOCK_CONFIG_DIR_NAME, REMOTE_JSON_BASE_FILE_PATH);
}

export async function findAppDirectoryUserConfigAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<string> {
    return await findAppDirectoryFileAsync(sys, USER_CONFIG_FILE_NAME, workingdir);
}

export async function readAppConfigAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<Result<AppConfig>> {
    return validateAppConfig(
        await readJsonIfExistsAsync(sys, await findAppConfigPathAsync(sys, workingdir)),
    );
}

export async function readRemoteConfigAsync(
    sys: System,
    workingdir = sys.process.cwd(),
): Promise<Result<RemoteConfig>> {
    return validateRemoteConfig(
        await readJsonIfExistsAsync(sys, await findRemoteConfigPathAsync(sys, workingdir)),
    );
}

export async function readGlobalUserConfigAsync(sys: System): Promise<Result<UserConfig>> {
    return validateUserConfig(
        await readJsonIfExistsAsync(sys, await findGlobalUserConfigAsync(sys)),
    );
}

export async function readAppDirectoryUserConfigAsync(sys: System): Promise<Result<UserConfig>> {
    return validateUserConfig(
        await readJsonIfExistsAsync(sys, await findAppDirectoryUserConfigAsync(sys)),
    );
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
    await writeFileAsync(configPath, Buffer.from(JSON.stringify(config)));
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
