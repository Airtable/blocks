import {dirname, join, parse} from 'path';
import {cwd, env} from 'process';
import {platform, homedir} from 'os';

import asyncFs, {AsyncFS} from './fs_async';
import {atomicify} from './system_extra';

export {AsyncFS};

export interface SystemPath {
    dirname: typeof dirname;
    join: typeof join;
    parse: typeof parse;
}

export interface SystemProcess {
    cwd: typeof cwd;
    env: typeof env;
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
    path = {dirname, join, parse},
    process = {cwd, env},
    os = {homedir, platform},
}: Partial<System> = {}): System {
    return atomicify({
        fs,
        path,
        process,
        os,
    });
}
