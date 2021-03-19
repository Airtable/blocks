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
