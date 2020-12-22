// Import vanilla node fs to refer to types.
import * as originalFs from 'fs';
import {promisify} from 'util';

// Import graceful-fs wrapper around fs for runtime use.
import * as fs from 'graceful-fs';

export type CallbackFS = Pick<
    typeof fs,
    'mkdir' | 'readdir' | 'readFile' | 'rename' | 'unlink' | 'writeFile'
>;

/** Add `*Async` suffix to fs functions. */
export interface AsyncFS {
    mkdirAsync: typeof originalFs.promises['mkdir'];
    readdirAsync: typeof originalFs.promises['readdir'];
    readFileAsync: typeof originalFs.promises['readFile'];
    renameAsync: typeof originalFs.promises['rename'];
    unlinkAsync: typeof originalFs.promises['unlink'];
    writeFileAsync: typeof originalFs.promises['writeFile'];
}

export function asyncify(callbackFs: CallbackFS): AsyncFS {
    return {
        mkdirAsync: promisify(callbackFs.mkdir.bind(callbackFs)) as any,
        readdirAsync: promisify(callbackFs.readdir.bind(callbackFs)) as any,
        readFileAsync: promisify(callbackFs.readFile.bind(callbackFs)) as any,
        renameAsync: promisify(callbackFs.rename.bind(callbackFs)) as any,
        unlinkAsync: promisify(callbackFs.unlink.bind(callbackFs)) as any,
        writeFileAsync: promisify(callbackFs.writeFile.bind(callbackFs)) as any,
    };
}

export default asyncify(fs as CallbackFS);
