import _debug from 'debug';
import {Volume} from 'memfs';
import chai from 'chai';
import {initSnapshotManager} from 'mocha-chai-jest-snapshot';
import chalk from 'chalk';

import * as Config from '@oclif/config';
import {test as _test} from '@oclif/test';
import {loadConfig} from '@oclif/test/lib/load-config';

import {UserConfig} from '../../src/helpers/config_user';
import {System} from '../../src/helpers/system';
import {RenderMessage} from '../../src/helpers/render_message';
import {MessageName, Messages} from '../../src/helpers/verbose_message';
import {ObjectMap} from '../../src/helpers/private_utils';
import {ConfigSystem, ConfigMessages, ConfigChalk} from '../../src/helpers/airtable_command';
import {removeDirOrFileIfExistsAsync} from '../../src/helpers/system_extra';

import {createSystem} from './system';
import {answer} from './answer';
import {prepareFixtureTempCopy} from './fixture';
import {mapFancyTestAsyncPlugin} from './FancyTestAsync';

type ConstructorReturnType<T extends new (...args: any[]) => any> = T extends new (
    ...args: any[]
) => infer R
    ? R
    : never;

type SystemVolume = ConstructorReturnType<typeof Volume>;

export const debug = _debug('block-cli:test');

export const expect = chai.use(initSnapshotManager).expect;

export const test = _test
    .register('_fancyTestContextTestWorkaround', () => {
        return {
            init(context) {
                context.test = Object.assign((title: any, fn?: any) => global.it(title, fn), {
                    only(title: any, fn?: any) {
                        return global.it.only(title, fn);
                    },
                    skip(title: any, fn?: any) {
                        return global.it.skip(title, fn);
                    },
                    retries(n: number) {
                        return global.it.retries(n);
                    },
                }) as typeof context.test;
            },
        };
    })
    ._fancyTestContextTestWorkaround()
    .do(initMockSystemAsync)
    .register('withFiles', withFiles)
    .register('withJSON', withJSON)
    .register('enableDebug', enableDebug)
    .register('wroteFile', wroteFile)
    .register('wroteJsonFile', wroteJsonFile)
    .register('wroteUserConfigFile', wroteUserConfigFile)
    .register('answer', answer)
    .register('prepareFixture', prepareFixtureTempCopy)
    .register('stubDirectoryRemoval', stubDirectoryRemoval)
    .register('filePresence', filePresence);

async function initMockSystemAsync(ctx: {
    config: Config.IConfig & Partial<ConfigSystem & ConfigMessages & ConfigChalk>;
    system: System;
    systemVolume: SystemVolume;
    messages: Messages;
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

    const messages = new RenderMessage(undefined) as Messages;
    for (const key of Object.values(MessageName)) {
        messages[key] = (info: any) => JSON.stringify(info);
    }

    ctx.messages = messages;

    if (!ctx.config.createSystem) {
        ctx.config.createSystem = () => ctx.system;
    }
    if (!ctx.config.createMessages) {
        ctx.config.createMessages = () => ctx.messages;
    }
    if (!ctx.config.createChalk) {
        ctx.config.createChalk = () => new chalk.Instance();
    }
}

function withFiles(files: {[path: string]: Buffer | null}) {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {system: System; systemVolume: SystemVolume}) {
            for (const [key, value] of Object.entries(files)) {
                if (value) {
                    ctx.systemVolume.mkdirpSync(ctx.system.path.dirname(key));
                    ctx.systemVolume.writeFileSync(key, value);
                } else {
                    await removeDirOrFileIfExistsAsync(ctx.system, key);
                }
            }
        },
    });
}

function withJSON<T>(data: {[path: string]: T}) {
    return withFiles(
        Object.entries(data).reduce(
            (carry, [key, value]) => {
                carry[key] = Buffer.from(JSON.stringify(value));
                return carry;
            },
            {} as {[key in keyof typeof data]: Buffer},
        ),
    );
}

function enableDebug(pattern: string) {
    return {
        run(ctx: {debugEnabledPatterns: ObjectMap<string, string>}) {
            if (!ctx.debugEnabledPatterns) {
                ctx.debugEnabledPatterns = {};
            }
            const currentState = _debug.disable();
            ctx.debugEnabledPatterns[pattern] = currentState;
            _debug.enable(`${currentState},${pattern}`);
        },
        finally(ctx: {debugEnabledPatterns: ObjectMap<string, string>}) {
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

function wroteJsonFile(path: string | ((sys: System) => string), expectJson: any) {
    return wroteFile(path, (expectContent) => {
        const actualJson = JSON.parse(expectContent.toString());
        expect(actualJson).deep.equal(expectJson);
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

/**
 * Configure the simulated system to ignore requests to remove directories.
 */
function stubDirectoryRemoval() {
    return {
        run({system}: {system: System}) {
            system.fs.rmdirAsync = () => Promise.resolve();
            system.fs.unlinkAsync = () => Promise.resolve();
        },
    };
}

/**
 * Assert that a file is present or absent.
 */
function filePresence(path: string, isPresent: boolean) {
    return {
        run(ctx: {systemVolume: SystemVolume}) {
            expect(ctx.systemVolume.existsSync(path)).equal(isPresent);
        },
    };
}
