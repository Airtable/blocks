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
import {invariant} from '../helpers/error_utils';
import {createSystem, System} from '../helpers/system';

import {createWebpackCompilerConfig} from './webpack_config';
import {createWebpackDevServerConfig} from './webpack_dev_server_config';
import {createTypescriptAssetConfigAsync} from './typescript_config';

class RunProducer implements RunTaskProducer {
    producerChannel: RunTaskProducerChannel;

    constructor(producerChannel: RunTaskProducerChannel) {
        this.producerChannel = producerChannel;
    }

    async readyAsync() {
        await this.producerChannel.requestAsync('readyAsync');
    }
}

class Run implements RunTaskConsumer {
    producer: RunTaskProducer;
    system: System;

    compilerConfig?: webpack.Configuration;
    serverConfig?: WebpackDevServer.Configuration;
    typescriptConfig?: typescript.CompilerOptions;

    compiler?: Compiler;
    webpackDevServer?: WebpackDevServer;
    server?: Server;

    constructor(producer: RunTaskProducer) {
        this.producer = producer;
        this.system = createSystem();
    }

    async startDevServerAsync({port, mode, context, entry}: RunDevServerOptions) {
        this.compilerConfig = createWebpackCompilerConfig({
            mode,
            context,
            entry,
            assets: {
                typescript: await createTypescriptAssetConfigAsync(this.system, context),
            },
        });

        this.compiler = webpack(this.compilerConfig);

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

export default async function(producer: RunTaskProducerChannel) {
    return new Run(new RunProducer(producer));
}
