import {expect} from '@oclif/test';
import fetch from 'node-fetch';

import run from '../../src/bundler/run';
import {System} from '../../src/helpers/system';
import {RunTaskConsumer} from '../../src/tasks/run';
import {invariant} from '../../src/helpers/error_utils';

import {test} from '../mocks/test';
import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';
import {findPortAsync} from '../../src/helpers/find_port_async';

describe('run bundler', () => {
    const testBundler = test
        .register('runBundlerServer', runBundlerServerOnFixture)
        .timeout(30000)
        .stdout()
        .stderr();

    testBundler
        .prepareFixture('run_src_index_js')
        .runBundlerServer()
        .do(async ({bundlerPort}) => {
            const bundle = await (await fetch(`http://localhost:${bundlerPort}/bundle.js`)).text();
            expect(typeof bundle).to.equal('string');
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('javascript')).to.equal(true);
        })
        .it('bundles empty app with dev server');

    testBundler
        .prepareFixture('run_src_index_ts')
        .runBundlerServer()
        .do(async ({bundlerPort}) => {
            const bundle = await (await fetch(`http://localhost:${bundlerPort}/bundle.js`)).text();
            expect(typeof bundle).to.equal('string');
            // Check directly instead of with expect. On failure expect will
            // diff the normally long bundle.
            expect(bundle.includes('typescript')).to.equal(true);
        })
        .it('bundles empty app with dev server');
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
            const consumer = (ctx.bundlerConsumer = await run({} as any));
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
