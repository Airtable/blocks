import {Server} from 'http';
import {promisify} from 'util';

import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import typescript from 'typescript';

import {
    RequestChannel,
    RunTaskProducer,
    RunTaskConsumer,
    RunTaskProducerChannel,
    RunDevServerOptions,
    BuildState,
    BuildStatus,
} from '../tasks/run';
import {
    ReleaseTaskProducer,
    ReleaseTaskConsumer,
    ReleaseBundleOptions,
    ReleaseTaskProducerChannel,
} from '../tasks/release';
import {invariant} from '../helpers/error_utils';
import {createSystem, System} from '../helpers/system';

import {createWebpackCompilerConfig, WebpackSummaryOptions} from './webpack_config';
import {createWebpackDevServerConfig} from './webpack_dev_server_config';
import {createJavascriptAssetConfigAsync} from './javascript_config';

class BundlerProducer implements RunTaskProducer, ReleaseTaskProducer {
    producerChannel: RequestChannel<RunTaskProducer | ReleaseTaskProducer>;

    constructor(producerChannel: RequestChannel<RunTaskProducer | ReleaseTaskProducer>) {
        this.producerChannel = producerChannel;
    }

    async readyAsync() {
        await this.producerChannel.requestAsync('readyAsync');
    }

    async emitBuildStateAsync(buildState: BuildState) {
        await (this.producerChannel as RunTaskProducerChannel).requestAsync(
            'emitBuildStateAsync',
            buildState,
        );
    }
}

class Bundler implements RunTaskConsumer, ReleaseTaskConsumer {
    producer: RunTaskProducer | ReleaseTaskProducer;
    system: System;

    compilerConfig?: webpack.Configuration;
    serverConfig?: WebpackDevServer.Configuration;
    typescriptConfig?: typescript.CompilerOptions;

    compiler?: Compiler;
    webpackDevServer?: WebpackDevServer;
    server?: Server;

    constructor(producer: RunTaskProducer | ReleaseTaskProducer) {
        this.producer = producer;
        this.system = createSystem();
    }

    async _configureCompilerAsync(options: Omit<WebpackSummaryOptions, 'assets'>) {
        this.compilerConfig = createWebpackCompilerConfig({
            ...options,
            assets: {
                javascript: await createJavascriptAssetConfigAsync(this.system),
            },
        });

        this.compiler = webpack(this.compilerConfig);
    }

    async bundleAsync(bundlingOptions: ReleaseBundleOptions) {
        await this._configureCompilerAsync(bundlingOptions);
        invariant(this.compiler, 'compiler must be configured to finish bundling');

        await promisify(this.compiler.run.bind(this.compiler))();
    }

    async startDevServerAsync({port, ...bundlingOptions}: RunDevServerOptions) {
        await this._configureCompilerAsync(bundlingOptions);

        invariant(this.compiler, 'compiler must not be null');

        this.serverConfig = createWebpackDevServerConfig({port});

        this.compiler.hooks.compilation.tap('AirtableCliStatusPlugin', () => {
            (this.producer as RunTaskProducer).emitBuildStateAsync({status: BuildStatus.BUILDING});
        });

        this.compiler.hooks.done.tap('AirtableCliStatusPlugin', stats => {
            if (stats.hasErrors()) {
                const statsJson = stats.toJson({colors: false});
                (this.producer as RunTaskProducer).emitBuildStateAsync({
                    status: BuildStatus.ERROR,
                    error: statsJson.errors[0],
                });
                this.webpackDevServer?.sockWrite(this.webpackDevServer.sockets, 'ok');
            } else {
                (this.producer as RunTaskProducer).emitBuildStateAsync({status: BuildStatus.READY});
            }
        });

        this.compiler.hooks.failed.tap('AirtableCliStatusPlugin', error => {
            (this.producer as RunTaskProducer).emitBuildStateAsync({
                status: BuildStatus.ERROR,
                error,
            });
        });

        const webpackDevServer = (this.webpackDevServer = new WebpackDevServer(
            this.compiler,
            this.serverConfig,
        ));
        this.server = await new Promise((resolve, reject) => {
            const httpServer = webpackDevServer.listen(port, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(httpServer);
                }
            });

            httpServer.once('listening', () => {
                resolve(httpServer);
            });
            httpServer.once('error', err => {
                reject(err);
            });
        });

        invariant(this.server, 'Server must start before getting ip port');
        const address = this.server.address();
        invariant(
            typeof address === 'object' && address !== null,
            'Server must be listening to an ip address',
        );
        invariant(
            address.port === port,
            'dev server must be listening to given port (%s === %s)',
            address.port,
            port,
        );
    }

    async teardownAsync() {
        if (this.webpackDevServer) {
            await promisify(this.webpackDevServer.close.bind(this.webpackDevServer))();
        }
    }
}

export default async function(producer: RunTaskProducerChannel | ReleaseTaskProducerChannel) {
    return new Bundler(new BundlerProducer(producer));
}
