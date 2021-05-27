import {expect} from '@oclif/test';
import fetch from 'node-fetch';

import run from '../../src/bundler/bundler';
import {System} from '../../src/helpers/system';
import {RunTaskConsumer} from '../../src/tasks/run';
import {ReleaseTaskConsumer} from '../../src/tasks/release';
import {invariant} from '../../src/helpers/error_utils';
import {findPortAsync} from '../../src/helpers/find_port_async';

import {test} from '../mocks/test';
import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';

describe('run bundler', () => {
    const testBundler = test
        .register('runBundlerServer', runBundlerServerOnFixture)
        .register('readServerBundle', readBundleFromServer)
        .register('runBundlerPass', runBundlerPassOnFixture)
        .register('readDiskBundle', readBundleFromDisk)
        .register('bundleIncludes', bundleIncludes)
        .register('bundleExcludes', bundleExcludes)
        .timeout(30000)
        .stdout()
        .stderr();

    testBundler
        .prepareFixture('bundler_babel_transforms')
        .runBundlerPass()
        .readDiskBundle()
        .bundleExcludes('?.')
        .bundleExcludes('??')
        .bundleExcludes('name=')
        .it('transforms newer js syntax to older syntax');

    testBundler
        .prepareFixture('bundler_react_jsx')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react components with server');

    testBundler
        .prepareFixture('bundler_react_jsx')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react components to disk');

    testBundler
        .prepareFixture('bundler_react_jsx')
        .add('compilerMode', () => 'production')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('Hello World')
        .bundleExcludes('ReactApp')
        .it('bundles react components with server (production mode)');

    testBundler
        .prepareFixture('bundler_react_jsx')
        .add('compilerMode', () => 'production')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('Hello World')
        .bundleExcludes('ReactApp')
        .it('bundles react components to disk (production mode)');

    testBundler
        .prepareFixture('bundler_src_index_js')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('javascript')
        .it('bundles empty app with dev server');

    testBundler
        .prepareFixture('bundler_src_index_js')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('javascript')
        .it('bundles empty app to disk');

    testBundler
        .prepareFixture('bundler_src_invalid_js')
        .runBundlerPass()
        .catch(/SyntaxError/)
        .it('reports error');

    testBundler
        .prepareFixture('bundler_react_tsx')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react typescript components with server');

    testBundler
        .prepareFixture('bundler_react_tsx')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react typescript components to disk');

    testBundler
        .prepareFixture('bundler_src_index_ts')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('typescript')
        .it('bundles empty app with dev server');

    testBundler
        .prepareFixture('bundler_src_index_ts')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('typescript')
        .it('bundles empty app to disk');

    testBundler
        .prepareFixture('bundler_react_flow')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react flow components with server');

    testBundler
        .prepareFixture('bundler_react_flow')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('createElement(ReactApp')
        .it('bundles react flow components to disk');
});

function runBundlerServerOnFixture() {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {
            tmpPath: string;
            realSystem: System;
            bundlerConsumer?: RunTaskConsumer;
            bundlerPort?: number;
            compilerMode?: 'development' | 'production';
        }) {
            const bundlerPort = (ctx.bundlerPort = await findPortAsync(0));
            const consumer = (ctx.bundlerConsumer = await run());
            await consumer.startDevServerAsync({
                port: bundlerPort,
                mode: ctx.compilerMode || 'development',
                context: ctx.tmpPath,
                entry: ctx.realSystem.path.join(ctx.tmpPath, 'index'),

                emitBuildState() {},
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
            compilerMode?: 'development' | 'production';
        }) {
            const consumer = (ctx.bundlerConsumer = await run());
            await consumer.bundleAsync({
                mode: ctx.compilerMode || 'development',
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

function bundleIncludes(expectString: string) {
    return {
        run(ctx: {bundle: string}) {
            expect(ctx.bundle.includes(expectString)).to.equal(
                true,
                `bundle includes ${expectString}`,
            );
        },
    };
}

function bundleExcludes(expectString: string) {
    return {
        run(ctx: {bundle: string}) {
            expect(ctx.bundle.includes(expectString)).to.equal(
                false,
                `bundle excludes ${expectString}`,
            );
        },
    };
}
