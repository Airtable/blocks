import {invariant} from '../helpers/error_utils';
import {RequestChannel} from '../helpers/task_channels';
import {SubmitFindDependenciesOptions, SubmitTaskConsumer} from '../tasks/submit';
import {SubmitTaskProducer} from './submit';
import {SubmitTaskConsumerAdapter} from './submit_adapter';

class SubmitBridge implements SubmitTaskConsumerAdapter {
    constructor(
        public producerChannel: RequestChannel<SubmitTaskProducer>,
        public target: SubmitTaskConsumer,
    ) {}

    async findDependenciesAsync(options: SubmitFindDependenciesOptions) {
        return await this.target.findDependenciesAsync(options);
    }

    async teardownAsync() {
        return await this.target.teardownAsync();
    }
}

export default async function bridgeSubmitTaskAsync(
    producerChannel: RequestChannel<SubmitTaskProducer>,
    createConsumer: () => Promise<SubmitTaskConsumer>,
) {
    const consumer = await createConsumer();
    invariant(
        typeof consumer === 'object',
        'extension entry default function must return an object',
    );
    invariant(
        typeof consumer['findDependenciesAsync'] === 'function',
        'extension must have a method findDependenciesAsync',
    );
    invariant(
        typeof consumer['teardownAsync'] === 'function',
        'extension must have a method teardownAsync',
    );

    return new SubmitBridge(producerChannel, consumer);
}
