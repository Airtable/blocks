import {RunTaskProducer, RunTaskConsumer, RunTaskProducerMessage} from '../tasks/run';
import {spawnError} from '../helpers/error_utils';

class Run implements RunTaskConsumer {
    producer: RunTaskProducer;

    constructor(producer: RunTaskProducer) {
        this.producer = producer;
    }

    async initAsync() {}

    async startBundlingAsync() {}

    async startDevServerAsync({port}: {port: number}) {
        throw spawnError('not implemented');
    }

    async getDevServerPortAsync(): Promise<number> {
        throw spawnError('not implemented');
    }

    async teardownAsync() {
        throw spawnError('not implemented');
    }

    update(message: RunTaskProducerMessage): void {}
}

export default async function(producer: RunTaskProducer) {
    return new Run(producer);
}
