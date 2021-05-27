import * as originalFs from 'fs';
import {promisify} from 'util';

import * as fs from 'graceful-fs';

export type CallbackFS = Pick<
    typeof fs,
    'copyFile' | 'mkdir' | 'readdir' | 'readFile' | 'rename' | 'rmdir' | 'unlink' | 'writeFile'
>;

/** Add `*Async` suffix to fs functions. */
export interface AsyncFS {
    copyFileAsync: typeof originalFs.promises['copyFile'];
    mkdirAsync: typeof originalFs.promises['mkdir'];
    readdirAsync: typeof originalFs.promises['readdir'];
    readFileAsync: typeof originalFs.promises['readFile'];
    renameAsync: typeof originalFs.promises['rename'];
    rmdirAsync: typeof originalFs.promises['rmdir'];
    unlinkAsync: typeof originalFs.promises['unlink'];
    writeFileAsync: typeof originalFs.promises['writeFile'];
}

export function asyncify(callbackFs: CallbackFS): AsyncFS {
    return {
        copyFileAsync: promisify(callbackFs.copyFile.bind(callbackFs)) as any,
        mkdirAsync: promisify(callbackFs.mkdir.bind(callbackFs)) as any,
        readdirAsync: promisify(callbackFs.readdir.bind(callbackFs)) as any,
        readFileAsync: promisify(callbackFs.readFile.bind(callbackFs)) as any,
        renameAsync: promisify(callbackFs.rename.bind(callbackFs)) as any,
        rmdirAsync: promisify(callbackFs.rmdir.bind(callbackFs)) as any,
        unlinkAsync: promisify(callbackFs.unlink.bind(callbackFs)) as any,
        writeFileAsync: promisify(callbackFs.writeFile.bind(callbackFs)) as any,
    };
}

export default asyncify(fs as CallbackFS);
