import {sep, dirname, join, parse, relative} from 'path';
import {cwd, env, version} from 'process';
import {platform, homedir} from 'os';

import asyncFs, {AsyncFS} from './fs_async';
import {atomicify} from './system_extra';

export {AsyncFS};

export interface SystemPath {
    sep: typeof sep;
    dirname: typeof dirname;
    join: typeof join;
    parse: typeof parse;
    relative: typeof relative;
}

export interface SystemProcess {
    cwd: typeof cwd;
    env: typeof env;
    version: typeof version;
}

export interface SystemOS {
    homedir: typeof homedir;
    platform: typeof platform;
}

export interface System {
    fs: AsyncFS;
    path: SystemPath;
    process: SystemProcess;
    os: SystemOS;
}

export function createSystem({
    fs = asyncFs,
    path = {sep, dirname, join, parse, relative},
    process = {cwd, env, version},
    os = {homedir, platform},
}: Partial<System> = {}): System {
    return atomicify({
        fs,
        path,
        process,
        os,
    });
}
