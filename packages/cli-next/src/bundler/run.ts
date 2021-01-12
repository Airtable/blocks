import {Server} from 'http';
import {promisify} from 'util';

import newApp, {Express} from 'express';

import {RunTaskProducer, RunTaskConsumer, RunTaskProducerMessage} from '../tasks/run';
import {invariant} from '../helpers/error_utils';

class Run implements RunTaskConsumer {
    app?: Express;
    server?: Server;

    producer: RunTaskProducer;

    constructor(producer: RunTaskProducer) {
        this.producer = producer;
    }

    async initAsync() {}

    async startBundlingAsync() {}

    async startDevServerAsync({port}: {port: number}) {
        [this.app, this.server] = await new Promise((resolve, reject) => {
            const app = newApp();
            app.get('/main.js', (req, res) => res.end('document.write("<h1>Hello World</h1>");'));
            const server = app.listen(port, () => {
                resolve([app, server]);
            });
            server.on('error', err => {
                reject(err);
            });
        });
    }

    async getDevServerPortAsync() {
        invariant(this.server, 'dev server must start before getting ip port');
        const address = this.server.address();
        invariant(
            typeof address === 'object' && address !== null,
            'dev server must be listening to an ip address',
        );
        return address.port;
    }

    async teardownAsync() {
        if (this.server) {
            await promisify(this.server.close.bind(this.server))();
        }
    }

    update(message: RunTaskProducerMessage): void {}
}

export default async function(producer: RunTaskProducer) {
    return new Run(producer);
}
