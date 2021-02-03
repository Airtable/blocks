import {expect} from '@oclif/test';
import fetch from 'node-fetch';

import run from '../../src/bundler/bundler';
import {System} from '../../src/helpers/system';
import {RunTaskConsumer, RunTaskProducer} from '../../src/tasks/run';
import {ReleaseTaskConsumer, ReleaseTaskProducer} from '../../src/tasks/release';
import {invariant} from '../../src/helpers/error_utils';
import {findPortAsync} from '../../src/helpers/find_port_async';
import {RequestChannelAdapter} from '../../src/helpers/task_channels';

import {test} from '../mocks/test';
import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';

describe('run bundler', () => {
    const testBundler = test
        .register('runBundlerServer', runBundlerServerOnFixture)
        .register('readServerBundle', readBundleFromServer)
        .register('runBundlerPass', runBundlerPassOnFixture)
        .register('readDiskBundle', readBundleFromDisk)
        .timeout(30000)
        .stdout()
        .stderr();

    testBundler
        .prepareFixture('run_src_index_js')
        .runBundlerServer()
        .readServerBundle()
        .it('bundles empty app with dev server', ({bundle}) => {
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('javascript')).to.equal(true);
        });

    testBundler
        .prepareFixture('run_src_index_ts')
        .runBundlerServer()
        .readServerBundle()
        .it('bundles empty app with dev server', ({bundle}) => {
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('typescript')).to.equal(true);
        });

    testBundler
        .prepareFixture('run_src_index_js')
        .runBundlerPass()
        .readDiskBundle()
        .it('bundles empty app to disk', ({bundle}) => {
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('javascript')).to.equal(true);
        });

    testBundler
        .prepareFixture('run_src_index_ts')
        .runBundlerPass()
        .readDiskBundle()
        .it('bundles empty app to disk', ({bundle}) => {
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('typescript')).to.equal(true);
        });
});

function runBundlerServerOnFixture() {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {
            tmpPath: string;
            realSystem: System;
            bundlerConsumer?: RunTaskConsumer;
            bundlerPort?: number;
        }) {
            const bundlerPort = (ctx.bundlerPort = await findPortAsync(0));
            const consumer = (ctx.bundlerConsumer = await run(
                new RequestChannelAdapter<RunTaskProducer>({
                    async readyAsync() {},
                }),
            ));
            await consumer.startDevServerAsync({
                port: bundlerPort,
                mode: 'development',
                context: ctx.tmpPath,
                entry: ctx.realSystem.path.join(ctx.tmpPath, 'index'),
            });
        },
        async finallyAsync(ctx) {
            invariant(ctx.bundlerConsumer, 'Bundler was not started on fixture');
            await ctx.bundlerConsumer.teardownAsync();
        },
    });
}

function readBundleFromServer() {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {bundlerPort: string; bundle: string}) {
            const bundle = await (
                await fetch(`http://localhost:${ctx.bundlerPort}/bundle.js`)
            ).text();
            ctx.bundle = bundle;
            expect(typeof ctx.bundle).to.equal('string');
        },
    });
}

function runBundlerPassOnFixture() {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {
            tmpPath: string;
            realSystem: System;
            bundlerConsumer?: ReleaseTaskConsumer;
        }) {
            const consumer = (ctx.bundlerConsumer = await run(
                new RequestChannelAdapter<ReleaseTaskProducer>({
                    async readyAsync() {},
                }),
            ));
            await consumer.bundleAsync({
                mode: 'development',
                context: ctx.tmpPath,
                entry: ctx.realSystem.path.join(ctx.tmpPath, 'index'),
                outputPath: ctx.realSystem.path.join(ctx.tmpPath, 'dist'),
            });
        },
        async finallyAsync(ctx) {
            invariant(ctx.bundlerConsumer, 'Bundler was not started on fixture');
            await ctx.bundlerConsumer.teardownAsync();
        },
    });
}

function readBundleFromDisk() {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {realSystem: System; tmpPath: string; bundle: string}) {
            const bundle = await ctx.realSystem.fs.readFileAsync(
                ctx.realSystem.path.join(ctx.tmpPath, 'dist', 'bundle.js'),
            );
            ctx.bundle = bundle.toString();
            expect(typeof ctx.bundle).to.equal('string');
        },
    });
}
