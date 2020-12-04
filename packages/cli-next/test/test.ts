import _debug from 'debug';

import * as Config from '@oclif/config';
import {expect, test as _test} from '@oclif/test';
import {loadConfig} from '@oclif/test/lib/load-config';

import {UserConfig} from '../src/helpers/config_user';
import {System} from '../src/helpers/system';
import {spawnError} from '../src/helpers/error_utils';

const debug = _debug('block-cli:test');

function spawnSystemError(code: string) {
    return Object.assign(spawnError('System error: %s', code), {code});
}

export const test = _test
    .do(
        async (ctx: {
            config: Config.IConfig & {createSystem?: () => System};
            system: System;
            systemFixture: {files: Record<any, Buffer>};
        }) => {
            if (!ctx.config) {
                ctx.config = (await loadConfig().run({} as any)) as Config.IConfig;
            }

            ctx.systemFixture = {files: {}};
            ctx.system = {
                fs: {
                    async mkdirAsync(path) {},
                    async readdirAsync(path) {
                        return [];
                    },
                    async readFileAsync(path) {
                        if (path in ctx.systemFixture.files) {
                            return ctx.systemFixture.files[path].slice();
                        }
                        throw spawnSystemError('ENOENT');
                    },
                    async renameAsync(src, dest) {
                        if (ctx.systemFixture.files[dest]) {
                            throw spawnSystemError('EEXIST');
                        }
                        ctx.systemFixture.files[dest] = ctx.systemFixture.files[src];
                        delete ctx.systemFixture.files[src];
                    },
                    async unlinkAsync(path) {
                        delete ctx.systemFixture.files[path];
                    },
                    async writeFileAsync(path, content) {
                        ctx.systemFixture.files[path] = content.slice();
                    },
                },
                path: {
                    dirname(path) {
                        return path.substring(path.lastIndexOf('/'));
                    },
                    join(...paths) {
                        return paths.join('/');
                    },
                    parse(path) {
                        return {} as any;
                    },
                },
                process: {
                    cwd() {
                        return '/home/projects/my-app';
                    },
                    env: {},
                },
                os: {
                    homedir() {
                        return '/home';
                    },
                    platform(): NodeJS.Platform {
                        return 'linux';
                    },
                },
            };

            if (!ctx.config.createSystem) {
                ctx.config.createSystem = () => ctx.system;
            }
        },
    )
    .register('wroteUserConfigFile', (expectConfig: Partial<UserConfig>) => {
        return {
            run(ctx) {
                const userConfigPath = '/home/.config/.airtableblocksrc.json';
                expect(ctx.systemFixture.files).to.haveOwnProperty(userConfigPath);
                const actualConfig = JSON.parse(ctx.systemFixture.files[userConfigPath].toString());
                expect(actualConfig).deep.equal(expectConfig);
            },
        };
    })
    .register('answer', (prompt: string, response: string) => {
        debug('will answer: %s', prompt);
        let write: (...args: any[]) => any;
        let writes: string[] = [];
        let on: (...args: any[]) => any;
        let responded = false;
        return {
            run(ctx) {
                write = process.stderr.write;
                process.stderr.write = (data: string | Uint8Array, ...args: any[]): boolean => {
                    write.apply(process.stderr, [data, ...args]);
                    writes.push(ArrayBuffer.isView(data) ? new TextDecoder().decode(data) : data);
                    return true;
                };
                on = process.stdin.on;
                process.stdin.on = (...args: any[]) => {
                    on.apply(process.stdin, args);
                    if (writes.join('').includes(prompt)) {
                        debug('give response: %s', response);
                        process.stdin.emit('data', response);
                        process.stdin.emit('data', '\n');
                        writes = [];
                        responded = true;
                    }
                    return process.stdin;
                };
            },
            finally(ctx) {
                process.stderr.write = write;
                process.stdin.on = on;
                expect(responded).to.equal(true);
                debug('responded');
            },
        };
    });
