import {TeardownRequest} from '../helpers/task';
import {RequestChannel} from '../helpers/task_channels';
import {RunDevServerOptions} from '../tasks/run';

export interface RunTaskConsumerAdapter extends TeardownRequest {
    startDevServerAsync(options: RunDevServerOptions): Promise<void>;
}

export class RunTaskAdapter implements RunTaskConsumerAdapter {
    constructor(public channel: RequestChannel<RunTaskConsumerAdapter>) {}

    async startDevServerAsync(options: RunDevServerOptions) {
        return await this.channel.requestAsync('startDevServerAsync', options);
    }
    async teardownAsync() {
        try {
            await this.channel.requestAsync('teardownAsync');
        } catch (err) {
            if (
                !err?.message ||
                !err.message.includes('channel closed while waiting for response')
            ) {
                throw err;
            }
        }
    }
}
