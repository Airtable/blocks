import {promisify} from 'util';

import * as fs from 'graceful-fs';

export type Callback<Result> = Result extends void
    ? (error: Error) => void
    : (error: Error, result: Result) => void;

export interface CallbackFS {
    mkdir(directoryPath: string, callback: Callback<void>): void;
    readdir(directoryPath: string, callback: Callback<string[]>): void;
    readFile(filepath: string, callback: Callback<Buffer>): void;
    rename(oldpath: string, newpath: string, callback: Callback<void>): void;
    unlink(path: string, callback: Callback<void>): void;
    writeFile(path: string, content: Buffer, callback: Callback<void>): void;
}

/** AsyncFS methods follow the naming pattern exported by require('fs').promises
 * whose names also match require('fs'). */
export interface AsyncFS {
    mkdirAsync(directoryPath: string): Promise<void>;
    readdirAsync(directoryPath: string): Promise<string[]>;
    readFileAsync(filepath: string): Promise<Buffer>;
    renameAsync(oldpath: string, newpath: string): Promise<void>;
    unlinkAsync(path: string): Promise<void>;
    writeFileAsync(path: string, content: Buffer): Promise<void>;
}

export function asyncify(callbackFs: CallbackFS): AsyncFS {
    return {
        mkdirAsync: promisify(callbackFs.mkdir.bind(callbackFs)),
        readdirAsync: promisify(callbackFs.readdir.bind(callbackFs)),
        readFileAsync: promisify(callbackFs.readFile.bind(callbackFs)),
        renameAsync: promisify(callbackFs.rename.bind(callbackFs)),
        unlinkAsync: promisify(callbackFs.unlink.bind(callbackFs)),
        writeFileAsync: promisify(callbackFs.writeFile.bind(callbackFs)),
    };
}

export default asyncify(fs as CallbackFS);
