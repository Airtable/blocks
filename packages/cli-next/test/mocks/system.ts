import pathModule from 'path';

import {createFsFromVolume, Volume} from 'memfs';

import {System} from '../../src/helpers/system';
import {asyncify, CallbackFS} from '../../src/helpers/fs_async';

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
    env = {};

    version = '10.0.0';

    cwd() {
        return '/home/projects/my-app';
    }
}

export function createSystem({volume}: {volume: SystemVolume}) {
    const path = pathModule.posix;
    const fs = asyncify(createFsFromVolume(volume) as CallbackFS);
    const os = new MockOS();
    const process = new MockProcess();
    return {
        fs,
        os,
        path,
        process,
    };
}
