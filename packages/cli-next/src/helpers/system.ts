import {sep, dirname, join, parse, relative, resolve} from 'path';
import {chdir, cwd, env, version} from 'process';
import {platform, homedir} from 'os';

import asyncFs, {AsyncFS} from './fs_async';
import nonAsyncFs, {NonAsyncFs} from './fs_non_async';
import streamFs, {StreamFS} from './fs_stream';
import {atomicify} from './system_extra';

export {AsyncFS};

export interface SystemPath {
    sep: typeof sep;
    dirname: typeof dirname;
    join: typeof join;
    parse: typeof parse;
    relative: typeof relative;
    resolve: typeof resolve;
}

export interface SystemProcess {
    chdir: typeof chdir;
    cwd: typeof cwd;
    env: typeof env;
    version: typeof version;
}

export interface SystemOS {
    homedir: typeof homedir;
    platform: typeof platform;
}

export interface System {
    fs: AsyncFS & NonAsyncFs & StreamFS;
    path: SystemPath;
    process: SystemProcess;
    os: SystemOS;
}

export function createSystem({
    fs = {...asyncFs, ...nonAsyncFs, ...streamFs},
    path = {sep, dirname, join, parse, relative, resolve},
    process = {chdir, cwd, env, version},
    os = {homedir, platform},
}: Partial<System> = {}): System {
    return atomicify({
        fs,
        path,
        process,
        os,
    });
}
