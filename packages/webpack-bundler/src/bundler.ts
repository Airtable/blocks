import {Server} from 'http';
import {promisify} from 'util';

import * as webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

import {
    RunTaskConsumer,
    RunDevServerOptions,
    BuildStatus,
    RunDevServerMethods,
    ReleaseTaskConsumer,
    ReleaseBundleOptions,
    SubmitFindDependenciesOptions,
    SubmitTaskConsumer,
} from '@airtable/blocks-cli';

import {createWebpackCompilerConfig, WebpackSummaryOptions} from './webpack_config';
import {createWebpackDevServerConfig} from './webpack_dev_server_config';
import {createJavascriptAssetConfig} from './javascript_config';

const AIRTABLE_CANCEL_BUILD_ERROR = 'AirtableCancelBuildPlugin: Bail' as const;

class Bundler implements RunTaskConsumer, ReleaseTaskConsumer, SubmitTaskConsumer {
    webpackDevServer?: WebpackDevServer;

    _configureCompiler(options: Omit<WebpackSummaryOptions, 'assets'>) {
        const compilerConfig = createWebpackCompilerConfig({
            ...options,
            assets: {
                javascript: createJavascriptAssetConfig(),
            },
        });

        return webpack(compilerConfig);
    }

    async bundleAsync(bundlingOptions: ReleaseBundleOptions) {
        const compiler = this._configureCompiler(bundlingOptions);

        const stats = await promisify(compiler.run.bind(compiler))();

        if (stats?.hasErrors()) {
            const jsonError = stats.toJson().errors[0];
            const e = new Error(jsonError.message);
            e.name = jsonError.name;
            e.stack = jsonError.stack;
            throw e;
        }
    }

    async findDependenciesAsync(options: SubmitFindDependenciesOptions) {
        const compiler = this._configureCompiler({...options});

        let fileDependencies: string[] = [];
        // The compiler's make hook finds modules starting from the entry
        // module. After make cause the compiler to stop with an error. We can
        // allow the compiler to continue past this point, but that will not
        // impact the list of fileDependencies that we are after in this
        // function.
        compiler.hooks.finishMake.tapPromise('AirtableCancelBuildPlugin', async compilation => {
            if (compilation.errors.length > 0) {
                throw compilation.errors[0];
            } else {
                compilation.summarizeDependencies();
                fileDependencies = Array.from(compilation.fileDependencies.values());
                // Throw an error at this point. The compiler is configured with
                // other plugins that will perform a lot more work to produce a
                // bundle that we will not use.
                throw new Error(AIRTABLE_CANCEL_BUILD_ERROR);
            }
        });

        try {
            await promisify(compiler.run.bind(compiler))();
        } catch (err) {
            if (err.message !== AIRTABLE_CANCEL_BUILD_ERROR) {
                throw err;
            }
        }

        return {
            files: fileDependencies,
        };
    }

    async startDevServerAsync({
        port,
        emitBuildState,
        ...bundlingOptions
    }: RunDevServerOptions & RunDevServerMethods) {
        const compiler = this._configureCompiler(bundlingOptions);

        const serverConfig = createWebpackDevServerConfig({port});

        compiler.hooks.compilation.tap('AirtableCliStatusPlugin', () => {
            emitBuildState({status: BuildStatus.BUILDING});
        });

        compiler.hooks.done.tap('AirtableCliStatusPlugin', stats => {
            if (stats.hasErrors()) {
                const statsJson = stats.toJson({colors: false});
                emitBuildState({
                    status: BuildStatus.ERROR,
                    error: statsJson.errors[0],
                });
                this.webpackDevServer?.sockWrite(this.webpackDevServer.sockets, 'ok');
            } else {
                emitBuildState({status: BuildStatus.READY});
            }
        });

        compiler.hooks.failed.tap('AirtableCliStatusPlugin', error => {
            emitBuildState({
                status: BuildStatus.ERROR,
                error,
            });
        });

        const webpackDevServer = (this.webpackDevServer = new WebpackDevServer(
            compiler,
            serverConfig,
        ));
        const server = await new Promise<Server>((resolve, reject) => {
            const httpServer = webpackDevServer.listen(port);

            httpServer.once('listening', () => {
                resolve(httpServer);
            });
            httpServer.once('error', err => {
                reject(err);
            });
        });

        const address = server.address();
        if (address === null || typeof address !== 'object') {
            throw new Error('Server must be listening to an ip address');
        }
        if (address.port !== port) {
            throw new Error(
                `dev server must be listening to given port (${address.port} === ${port})`,
            );
        }
    }

    async teardownAsync() {
        if (this.webpackDevServer) {
            await promisify(this.webpackDevServer.close.bind(this.webpackDevServer))();
        }
    }
}

export default async function(): Promise<Bundler> {
    return new Bundler();
}
