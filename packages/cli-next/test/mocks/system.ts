import pathModule from 'path';
import * as originalFs from 'fs';

import {createFsFromVolume, Volume} from 'memfs';

import {System} from '../../src/helpers/system';
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

export function createSystem({volume}: {volume: SystemVolume}) {
    const path = pathModule.posix;
    const volumeFs = createFsFromVolume(volume);
    const fs = {
        ...asyncify((volumeFs as unknown) as CallbackFS),
        unwatchFile: (volumeFs.unwatchFile as unknown) as typeof originalFs.unwatchFile,
        watch: (volumeFs.watch as unknown) as typeof originalFs.watch,
        watchFile: (volumeFs.watchFile as unknown) as typeof originalFs.watchFile,
        ...streamify((volumeFs as unknown) as StreamFS),
    };
    const os = new MockOS();
    const process = new MockProcess();
    return {
        fs,
        os,
        path,
        process,
    };
}
