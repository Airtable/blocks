import {Server} from 'http';
import {promisify} from 'util';

import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import typescript from 'typescript';

import {
    RunTaskProducer,
    RunTaskConsumer,
    RunTaskProducerChannel,
    RunDevServerOptions,
} from '../tasks/run';
import {
    ReleaseTaskProducer,
    ReleaseTaskConsumer,
    ReleaseBundleOptions,
    ReleaseTaskProducerChannel,
} from '../tasks/release';
import {invariant} from '../helpers/error_utils';
import {createSystem, System} from '../helpers/system';

import {createWebpackCompilerConfig} from './webpack_config';
import {createWebpackDevServerConfig} from './webpack_dev_server_config';
import {createTypescriptAssetConfigAsync} from './typescript_config';

class BundlerProducer implements RunTaskProducer, ReleaseTaskProducer {
    producerChannel: RunTaskProducerChannel | ReleaseTaskProducerChannel;

    constructor(producerChannel: RunTaskProducerChannel | ReleaseTaskProducerChannel) {
        this.producerChannel = producerChannel;
    }

    async readyAsync() {
        await this.producerChannel.requestAsync('readyAsync');
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

    async _configureCompilerAsync({
        mode,
        context,
        entry,
        outputPath,
    }: Omit<ReleaseBundleOptions, 'outputPath'> &
        Partial<Pick<ReleaseBundleOptions, 'outputPath'>>) {
        this.compilerConfig = createWebpackCompilerConfig({
            mode,
            context,
            entry,
            outputPath,
            assets: {
                typescript: await createTypescriptAssetConfigAsync(this.system, context),
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
