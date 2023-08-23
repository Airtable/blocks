import {invariant} from '../helpers/error_utils';
import {RequestChannel} from '../helpers/task_channels';
import {RunDevServerOptions, RunTaskConsumer} from '../tasks/run';
import {RunTaskProducer} from './run';
import {RunTaskConsumerAdapter} from './run_adapter';

class RunBridge implements RunTaskConsumerAdapter {
    constructor(
        public producerChannel: RequestChannel<RunTaskProducer>,
        public target: RunTaskConsumer,
    ) {}

    async startDevServerAsync(devServerOptions: RunDevServerOptions) {
        const {producerChannel} = this;
        return await this.target.startDevServerAsync({
            ...devServerOptions,
            emitBuildState(buildState) {
                producerChannel.requestAsync('emitBuildState', buildState);
            },
        });
    }

    async teardownAsync() {
        return await this.target.teardownAsync();
    }
}

export default async function bridgeRunTaskAsync(
    producerChannel: RequestChannel<RunTaskProducer>,
    createConsumer: () => Promise<RunTaskConsumer>,
) {
    const consumer = await createConsumer();
    invariant(
        typeof consumer === 'object',
        'extension entry default function must return an object',
    );
    invariant(
        typeof consumer['startDevServerAsync'] === 'function',
        'extension must have a method startDevServerAsync',
    );
    invariant(
        typeof consumer['teardownAsync'] === 'function',
        'extension must have a method teardownAsync',
    );

    return new RunBridge(producerChannel, await createConsumer());
}
