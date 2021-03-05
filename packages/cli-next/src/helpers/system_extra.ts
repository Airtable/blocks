import _debug from 'debug';
import {spawnUnexpectedError} from './error_utils';

import {System} from './system';

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
    throw spawnUnexpectedError('Could not find directory that includes a %s entry.', name);
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
