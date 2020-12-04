import {BLOCK_FILE_NAME, USER_CONFIG_FILE_NAME} from '../settings';
import {Result} from './result';

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

export async function findUserConfigUserPathAsync(sys: System): Promise<string> {
    return sys.path.join(await getUserPathAsync(sys), USER_CONFIG_FILE_NAME);
}

async function findAppRootAsync(sys: System, dirpath: string): Promise<string> {
    return await findAncestorDirIncludingNameAsync(sys, dirpath, BLOCK_FILE_NAME);
}

export async function findUserConfigAppPathAsync(sys: System): Promise<string> {
    const {
        path,
        process: {cwd},
    } = sys;

    const blockRoot = await findAppRootAsync(sys, cwd());
    return path.join(blockRoot, USER_CONFIG_FILE_NAME);
}

export async function readUserConfigUserPathAsync(sys: System): Promise<Result<UserConfig>> {
    return validateUserConfig(readJsonIfExistsAsync(sys, await findUserConfigUserPathAsync(sys)));
}

export async function readUserConfigAppRootAsync(sys: System): Promise<Result<UserConfig>> {
    return validateUserConfig(readJsonIfExistsAsync(sys, await findUserConfigAppPathAsync(sys)));
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

export async function writeUserConfigUserPathAsync(sys: System, config: UserConfig): Promise<void> {
    await writeUserConfigAsync(sys, await findUserConfigUserPathAsync(sys), config);
}

export async function writeUserConfigAppPathAsync(sys: System, config: UserConfig): Promise<void> {
    await writeUserConfigAsync(sys, await findUserConfigAppPathAsync(sys), config);
}
