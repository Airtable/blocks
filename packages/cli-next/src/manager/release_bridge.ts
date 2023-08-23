import {invariant} from '../helpers/error_utils';
import {RequestChannel} from '../helpers/task_channels';
import {ReleaseBundleOptions, ReleaseTaskConsumer} from '../tasks/bundle';
import {ReleaseTaskProducer} from './release';
import {ReleaseTaskConsumerAdapter} from './release_adapter';

class ReleaseBridge implements ReleaseTaskConsumerAdapter {
    constructor(
        public producerChannel: RequestChannel<ReleaseTaskProducer>,
        public target: ReleaseTaskConsumer,
    ) {}

    async bundleAsync(bundleOptions: ReleaseBundleOptions) {
        return await this.target.bundleAsync(bundleOptions);
    }

    async teardownAsync() {
        return await this.target.teardownAsync();
    }
}

export default async function bridgeReleaseTaskAsync(
    producerChannel: RequestChannel<ReleaseTaskProducer>,
    createConsumer: () => Promise<ReleaseTaskConsumer>,
) {
    const consumer = await createConsumer();
    invariant(
        typeof consumer === 'object',
        'extension entry default function must return an object',
    );
    invariant(
        typeof consumer['bundleAsync'] === 'function',
        'extension must have a method bundleAsync',
    );
    invariant(
        typeof consumer['teardownAsync'] === 'function',
        'extension must have a method teardownAsync',
    );

    return new ReleaseBridge(producerChannel, consumer);
}
