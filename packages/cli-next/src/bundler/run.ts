import {Server} from 'http';
import {promisify} from 'util';

import newApp, {Express} from 'express';

import {RunTaskProducer, RunTaskConsumer, RunTaskProducerChannel} from '../tasks/run';
import {invariant} from '../helpers/error_utils';

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
    app?: Express;
    server?: Server;

    producer: RunTaskProducer;

    constructor(producer: RunTaskProducer) {
        this.producer = producer;
    }

    async startDevServerAsync({
        port,
        mode,
        entry,
    }: {
        port: number;
        mode: 'development' | 'production';
        entry: string;
    }) {
        [this.app, this.server] = await new Promise((resolve, reject) => {
            const app = newApp();
            app.get('/bundle.js', (req, res) => res.end('document.write("<h1>Hello World</h1>");'));
            const server = app.listen(port, () => {
                resolve([app, server]);
            });
            server.on('error', err => {
                reject(err);
            });
        });

        invariant(this.server, 'dev server must start before getting ip port');
        const address = this.server.address();
        invariant(
            typeof address === 'object' && address !== null,
            'dev server must be listening to an ip address',
        );
        invariant(address.port === port, 'dev server must be listening to given port');
    }

    async teardownAsync() {
        if (this.server) {
            await promisify(this.server.close.bind(this.server))();
        }
    }
}

export default async function(producer: RunTaskProducerChannel) {
    return new Run(new RunProducer(producer));
}
