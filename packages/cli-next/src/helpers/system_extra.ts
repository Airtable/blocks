import crypto from 'crypto';
import _debug from 'debug';
import {spawnUnexpectedError, spawnUserError} from './error_utils';

import {System} from './system';

export enum SystemExtraErrorName {
    SYSTEM_EXTRA_DIR_WITH_FILE_NOT_FOUND = 'systemExtraDirWithFileNotFound',
}

export interface SystemExtraDirWithFileNotFoundError {
    type: SystemExtraErrorName.SYSTEM_EXTRA_DIR_WITH_FILE_NOT_FOUND;
    file: string;
}

export type SystemExtraErrorInfo = SystemExtraDirWithFileNotFoundError;

const debug = _debug('block-cli:system');

const RENAME_SUFFIX = '~';

export async function findAncestorDirIncludingNameAsync(
    {fs: {readdirAsync}, path}: System,
    searchFrom: string,
    name: string,
): Promise<string> {
    const pathRoot = path.parse(searchFrom).root;
    let checkDirectory = searchFrom;

    do {
        const names = await readdirAsync(checkDirectory);
        if (names.includes(name)) {
            return checkDirectory;
        }
        checkDirectory = path.dirname(checkDirectory);
    } while (checkDirectory !== pathRoot);
    throw spawnUserError({
        type: SystemExtraErrorName.SYSTEM_EXTRA_DIR_WITH_FILE_NOT_FOUND,
        file: name,
    });
}

export async function copyAsync(sys: System, sourcePath: string, destinationPath: string) {
    const {fs, path} = sys;

    try {
        await fs.copyFileAsync(sourcePath, destinationPath);
    } catch (err) {
        try {
            const entries = await fs.readdirAsync(sourcePath);
            await mkdirpAsync(sys, destinationPath);
            for (const entry of entries) {
                await copyAsync(
                    sys,
                    path.join(sourcePath, entry),
                    path.join(destinationPath, entry),
                );
            }
        } catch (err2) {
            throw err;
        }
    }
}

export async function mkdirpAsync(sys: System, directoryPath: string): Promise<void> {
    const {
        fs: {mkdirAsync},
        path: {dirname},
    } = sys;

    try {
        await mkdirAsync(directoryPath);
    } catch (err) {
        if (err.code === 'EEXIST') {
            return;
        } else if (err.code === 'ENOENT') {
            await mkdirpAsync(sys, dirname(directoryPath));
            await mkdirAsync(directoryPath);
        } else {
            throw err;
        }
    }
}

export async function rmdirAsync(sys: System, directoryPath: string): Promise<void> {
    const {fs, path} = sys;

    try {
        await fs.rmdirAsync(directoryPath);
    } catch (err) {
        if (err.code === 'ENOTEMPTY') {
            for (const entry of await fs.readdirAsync(directoryPath)) {
                await rmdirAsync(sys, path.join(directoryPath, entry));
            }
            await rmdirAsync(sys, directoryPath);
        } else if (err.code === 'ENOTDIR') {
            await fs.unlinkAsync(directoryPath);
        } else if (err.code !== 'ENOENT') {
            throw err;
        }
    }
}

export async function unlinkIfExistsAsync(
    {fs: {unlinkAsync}}: System,
    filepath: string,
): Promise<void> {
    try {
        await unlinkAsync(filepath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return;
        }
        throw err;
    }
}

export async function writeFileAtomicallyAsync(
    sys: System,
    filepath: string,
    content: Buffer,
): Promise<void> {
    const {
        fs: {renameAsync, writeFileAsync},
    } = sys;

    const atomicFilepath = `${filepath}${RENAME_SUFFIX}`;

    debug(`atomically saving: ${filepath}`);
    await writeFileAsync(atomicFilepath, content);
    await unlinkIfExistsAsync(sys, filepath);
    await renameAsync(atomicFilepath, filepath);
    debug(`atomic save complete: ${filepath}`);
}

export function atomicify(sys: System): System {
    return {
        ...sys,
        fs: {
            ...sys.fs,
            writeFileAsync: (filepath, content) =>
                writeFileAtomicallyAsync(sys, filepath.toString(), Buffer.from(content)),
        },
    };
}

export async function readJsonIfExistsAsync(
    {fs: {readFileAsync}}: System,
    path: string,
): Promise<ReturnType<JSON['parse']> | null> {
    try {
        return JSON.parse((await readFileAsync(path)).toString());
    } catch (err) {
        if (err.code === 'ENOENT') {
            return null;
        }
        throw err;
    }
}

export async function writeFormattedJsonAsync(sys: System, path: string, data: any) {
    await sys.fs.writeFileAsync(path, JSON.stringify(data, null, 4) + '\n');
}

export async function findExtensionAsync(
    {fs: {readFileAsync}}: System,
    name: string,
    extensions: string[],
) {
    for (const ext of extensions) {
        try {
            await readFileAsync(`${name}${ext}`);
            return `${name}${ext}`;
        } catch (err) {
            continue;
        }
    }

    throw spawnUnexpectedError('Cannot find file %s with extensions %s', name, extensions);
}

/**
 * Determine whether a directory exists in a given system on a given path.
 */
export async function dirExistsAsync(sys: System, path: string): Promise<boolean> {
    try {
        await sys.fs.readdirAsync(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }

        throw error;
    }
}

async function hashFileAsync(sys: System, path: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(await sys.fs.readFileAsync(path));
    return hash.digest('hex');
}

interface WhenModified {
    whenModified: Promise<void>;
}

/**
 * Wait for the modification or deletion of a file located on a given System
 * and at a given path.
 *
 * To promote cross-platform consistency (and to tolerate certain kinds of file
 * operations), this function detects change by reading the watched file's
 * contents. This heuristic may make the function unsuitable for use with large
 * files.
 */
export async function watchFileAsync(sys: System, path: string): Promise<WhenModified> {
    const initialHash = await hashFileAsync(sys, path);
    const hasChanged = async () => {
        const hash = await hashFileAsync(sys, path).catch(() => null);
        return hash !== initialHash;
    };
    let isWatching = false;

    const viaFsWatch = new Promise<void>(resolve => {
        let watcher: ReturnType<typeof sys.fs.watch>;
        const handler = async () => {
            if (!(await hasChanged())) {
                return;
            }

            watcher.close();
            resolve();
        };
        try {
            watcher = sys.fs.watch(path, {persistent: false}, handler);
            isWatching = true;
        } catch (error) {
        }
    });

    if (isWatching) {
        return {whenModified: viaFsWatch};
    }

    const viaFsWatchFile = new Promise<void>(resolve => {
        const listener = async () => {
            if (!(await hasChanged())) {
                return;
            }

            sys.fs.unwatchFile(path, listener);
            resolve();
        };
        sys.fs.watchFile(path, {persistent: false, interval: 1000}, listener);
    });

    return {whenModified: viaFsWatchFile};
}
