import * as fs from 'fs';
import {Server} from 'net';
import * as path from 'path';
import {promisify} from 'util';

import {expect, test, FancyTypes} from '@oclif/test';
import fetch from 'node-fetch';

import createBundler from '../src/index';
import {ReleaseTaskConsumer, RunTaskConsumer} from '@airtable/blocks-cli';

describe('run bundler', () => {
    const testBundler = test
        .register('prepareFixture', prepareFixtureTempCopy)
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
        .it('reports syntax error');

    testBundler
        .prepareFixture('bundler_src_module_not_found')
        .runBundlerPass()
        .catch(/Module not found/)
        .it('reports module not found');

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
        .prepareFixture('bundler_react_css')
        .runBundlerServer()
        .readServerBundle()
        .bundleIncludes('color: red;')
        .it('bundles react with css imports with server');

    testBundler
        .prepareFixture('bundler_react_css')
        .runBundlerPass()
        .readDiskBundle()
        .bundleIncludes('color: red;')
        .it('bundles react with css imports to disk');

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
        .prepareFixture('bundler_custom_config')
        .runBundlerPass(baseConfig => {
            baseConfig.module.rules.push({
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        path.join(
                            __dirname,
                            'fixtures/bundler_custom_config/custom_babel_plugin.js',
                        ),
                    ],
                },
            });
            return baseConfig;
        })
        .readDiskBundle()
        .bundleIncludes('console.log("test", "hello world")')
        .it('works with a custom bundler');
});

function prepareFixtureTempCopy(fixtureName: string, tempName: string = fixtureName) {
    function cleanRecursively(dirOrFilePath: string) {
        try {
            for (const name of fs.readdirSync(dirOrFilePath)) {
                cleanRecursively(path.join(dirOrFilePath, name));
            }
            fs.rmdirSync(dirOrFilePath);
        } catch (err) {
            if (err.code === 'ENOTDIR') {
                fs.unlinkSync(dirOrFilePath);
            }
        }
    }

    function copyRecursively(src: string, dest: string) {
        try {
            const names = fs.readdirSync(src);
            fs.mkdirSync(dest, {recursive: true});
            for (const name of names) {
                copyRecursively(path.join(src, name), path.join(dest, name));
            }
        } catch (err) {
            if (err.code === 'ENOTDIR') {
                fs.writeFileSync(dest, fs.readFileSync(src));
            } else {
                throw err;
            }
        }
    }

    return {
        async run(ctx: {fixtureName: string; tmpPath: string}) {
            const fixtureHome = path.join(__dirname, 'fixtures');
            const fixturePath = path.join(fixtureHome, fixtureName);
            const tempRoot = path.join(__dirname, '..', '.test-tmp');
            const tempPath = path.join(tempRoot, tempName);

            cleanRecursively(tempPath);
            copyRecursively(fixturePath, tempPath);

            ctx.fixtureName = tempName;
            ctx.tmpPath = tempPath;
        },
    };
}

function runBundlerServerOnFixture(): FancyTypes.Plugin<{
    tmpPath: string;
    bundlerConsumer?: RunTaskConsumer;
    bundlerPort?: number;
    compilerMode?: 'development' | 'production';
}> {
    async function findPortAsync(port: number): Promise<number> {
        const server = new Server();
        await new Promise<void>((resolve, reject) => {
            server.once('error', reject);
            server.listen(port, resolve);
        });
        try {
            const address = server.address();
            if (address === null || typeof address !== 'object') {
                throw new Error('server must be listening to an ip address');
            }
            return address.port;
        } finally {
            await promisify(server.close.bind(server))();
        }
    }

    return {
        async run(ctx) {
            const bundlerPort = (ctx.bundlerPort = await findPortAsync(0));
            const consumer = (ctx.bundlerConsumer = await createBundler());
            await consumer.startDevServerAsync({
                port: bundlerPort,
                mode: ctx.compilerMode || 'development',
                context: ctx.tmpPath,
                entry: path.join(ctx.tmpPath, 'index'),

                // eslint-disable-next-line @typescript-eslint/no-empty-function
                emitBuildState() {},
            });
        },
        async finally(ctx) {
            if (!ctx.bundlerConsumer) {
                throw new Error('Bundler was not started on fixture');
            }
            await ctx.bundlerConsumer.teardownAsync();
        },
    };
}

function readBundleFromServer() {
    return {
        async run(ctx: {bundlerPort: string; bundle: string}) {
            const bundle = await (
                await fetch(`http://localhost:${ctx.bundlerPort}/bundle.js`)
            ).text();
            ctx.bundle = bundle;
            expect(typeof ctx.bundle).to.equal('string');
        },
    };
}

function runBundlerPassOnFixture(
    customizeWebpackConfig?: Parameters<typeof createBundler>[0],
): FancyTypes.Plugin<{
    tmpPath: string;
    bundlerConsumer?: ReleaseTaskConsumer;
    compilerMode?: 'development' | 'production';
}> {
    return {
        async run(ctx) {
            const consumer = (ctx.bundlerConsumer = await createBundler(customizeWebpackConfig));
            await consumer.bundleAsync({
                mode: ctx.compilerMode || 'development',
                context: ctx.tmpPath,
                entry: path.join(ctx.tmpPath, 'index'),
                outputPath: path.join(ctx.tmpPath, 'dist'),
            });
        },
        async finally(ctx) {
            if (!ctx.bundlerConsumer) {
                throw new Error('Bundler was not started on fixture');
            }
            await ctx.bundlerConsumer.teardownAsync();
        },
    };
}

function readBundleFromDisk(): FancyTypes.Plugin<{tmpPath: string; bundle: string}> {
    return {
        async run(ctx) {
            const bundle = fs.readFileSync(path.join(ctx.tmpPath, 'dist', 'bundle.js'));
            ctx.bundle = bundle.toString();
            expect(typeof ctx.bundle).to.equal('string');
        },
    };
}

function bundleIncludes(expectString: string): FancyTypes.Plugin<{bundle: string}> {
    return {
        run(ctx) {
            expect(ctx.bundle.includes(expectString)).to.equal(
                true,
                `bundle includes ${expectString}`,
            );
        },
    };
}

function bundleExcludes(expectString: string): FancyTypes.Plugin<{bundle: string}> {
    return {
        run(ctx) {
            expect(ctx.bundle.includes(expectString)).to.equal(
                false,
                `bundle excludes ${expectString}`,
            );
        },
    };
}
