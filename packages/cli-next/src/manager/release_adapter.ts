import {TeardownRequest} from '../helpers/task';
import {RequestChannel} from '../helpers/task_channels';
import {ReleaseBundleOptions} from '../tasks/release';

export interface ReleaseTaskConsumerAdapter extends TeardownRequest {
    bundleAsync(options: ReleaseBundleOptions): Promise<void>;
}

export class ReleaseTaskAdapter implements ReleaseTaskConsumerAdapter {
    constructor(public channel: RequestChannel<ReleaseTaskConsumerAdapter>) {}

    async bundleAsync(options: ReleaseBundleOptions) {
        return await this.channel.requestAsync('bundleAsync', options);
    }
    async teardownAsync() {
        try {
            await this.channel.requestAsync('teardownAsync');
        } catch (err) {
            // It's ok if the channel closes while tearing down the task.
            if (err && !err.message.includes('channel closed while waiting for response')) {
                throw err;
            }
        }
    }
}
