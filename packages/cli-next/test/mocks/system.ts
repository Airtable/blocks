import pathModule from 'path';
import * as originalFs from 'fs';

import {createFsFromVolume, Volume} from 'memfs';

import {System} from '../../src/helpers/system';
import {spawnUnexpectedError} from '../../src/helpers/error_utils';
import {asyncify, CallbackFS} from '../../src/helpers/fs_async';
import {StreamFS, streamify} from '../../src/helpers/fs_stream';

type SystemOS = System['os'];
type SystemProcess = System['process'];

type ConstructorReturnType<T extends new (...args: any[]) => any> = T extends new (
    ...args: any[]
) => infer R
    ? R
    : never;

type SystemVolume = ConstructorReturnType<typeof Volume>;

class MockOS implements SystemOS {
    homedir() {
        return '/home';
    }
    platform(): NodeJS.Platform {
        return 'linux';
    }
}

class MockProcess implements SystemProcess {
    _cwd: string = '/home/projects/my-app';

    env = {};

    version = '10.0.0';

    chdir(dirpath: string) {
        this._cwd = pathModule.posix.resolve(this._cwd, dirpath);
    }

    cwd() {
        return this._cwd;
    }
}

export function createSystem({volume}: {volume: SystemVolume}): System {
    const path = pathModule.posix;
    const volumeFs = createFsFromVolume(volume);
    const fs = {
        ...asyncify(volumeFs as unknown as CallbackFS),
        existsSync: volumeFs.existsSync as unknown as typeof originalFs.existsSync,
        unwatchFile: volumeFs.unwatchFile as unknown as typeof originalFs.unwatchFile,
        watch: volumeFs.watch as unknown as typeof originalFs.watch,
        watchFile: volumeFs.watchFile as unknown as typeof originalFs.watchFile,
        ...streamify(volumeFs as unknown as StreamFS),
    };
    const os = new MockOS();
    const process = new MockProcess();
    const requireResolve = (id: string, options?: {paths?: string[]}) => {
        const filePath = options?.paths ? path.resolve(...options.paths, id) : id;
        if (!volumeFs.existsSync(filePath)) {
            throw spawnUnexpectedError('No such file %s', filePath);
        }
        return filePath;
    };
    requireResolve.paths = () => null;
    return {
        fs,
        os,
        path,
        process,
        require: {resolve: requireResolve},
    };
}
