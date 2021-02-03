import _debug from 'debug';
import {Volume} from 'memfs';

import * as Config from '@oclif/config';
import {expect, test as _test} from '@oclif/test';
import {loadConfig} from '@oclif/test/lib/load-config';

import {UserConfig} from '../../src/helpers/config_user';
import {System} from '../../src/helpers/system';

import {createSystem} from './system';
import {answer} from './answer';
import {prepareFixtureTempCopy} from './fixture';

export const debug = _debug('block-cli:test');

type ConstructorReturnType<T extends new (...args: any[]) => any> = T extends new (
    ...args: any[]
) => infer R
    ? R
    : never;

type SystemVolume = ConstructorReturnType<typeof Volume>;

export const test = _test
    .do(initMockSystemAsync)
    .register('withFiles', withFiles)
    .register('enableDebug', enableDebug)
    .register('wroteFile', wroteFile)
    .register('wroteJsonFile', wroteJsonFile)
    .register('wroteUserConfigFile', wroteUserConfigFile)
    .register('answer', answer)
    .register('prepareFixture', prepareFixtureTempCopy);

async function initMockSystemAsync(ctx: {
    config: Config.IConfig & {createSystem?: () => System};
    system: System;
    systemVolume: SystemVolume;
}) {
    if (!ctx.config) {
        ctx.config = (await loadConfig().run({} as any)) as Config.IConfig;
    }

    const vol = new Volume();
    vol.fromJSON({
        '/home': null,
        '/home/projects/my-app': null,
    });

    ctx.systemVolume = vol;

    ctx.system = createSystem({volume: ctx.systemVolume});

    if (!ctx.config.createSystem) {
        ctx.config.createSystem = () => ctx.system;
    }
}

function withFiles(files: {[path: string]: Buffer | null}) {
    return {
        run(ctx: {system: System; systemVolume: SystemVolume}) {
            for (const [key, value] of Object.entries(files)) {
                if (value) {
                    ctx.systemVolume.mkdirpSync(ctx.system.path.dirname(key));
                    ctx.systemVolume.writeFileSync(key, value);
                } else {
                    ctx.systemVolume.unlinkSync(key);
                }
            }
        },
    };
}

function enableDebug(pattern: string) {
    return {
        run(ctx: {debugEnabledPatterns: Record<string, string>}) {
            if (!ctx.debugEnabledPatterns) {
                ctx.debugEnabledPatterns = {};
            }
            const currentState = _debug.disable();
            ctx.debugEnabledPatterns[pattern] = currentState;
            _debug.enable(`${currentState},${pattern}`);
        },
        finally(ctx) {
            _debug.enable(ctx.debugEnabledPatterns[pattern]);
        },
    };
}

function wroteUserConfigFile(expectConfig: Partial<UserConfig>) {
    return wroteJsonFile(
        ({path, os: {homedir}}) => path.join(homedir(), '.config', '.airtableblocksrc.json'),
        expectConfig,
    );
}

function wroteJsonFile(
    path: string | ((sys: System) => string),
    expectConfig: Partial<UserConfig>,
) {
    return wroteFile(path, expectContent => {
        const actualConfig = JSON.parse(expectContent.toString());
        expect(actualConfig).deep.equal(expectConfig);
    });
}

function wroteFile(
    path: string | ((sys: System) => string),
    expectContent: (content: Buffer) => void,
) {
    return {
        run(ctx: {system: System; systemVolume: SystemVolume}) {
            const filePath = typeof path === 'string' ? path : path(ctx.system);
            expectContent(ctx.systemVolume.readFileSync(filePath, 'buffer') as Buffer);
        },
    };
}
