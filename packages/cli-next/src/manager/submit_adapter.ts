import {TeardownRequest} from '../helpers/task';
import {RequestChannel} from '../helpers/task_channels';
import {SubmitFindDependenciesOptions, SubmitFoundDependencies} from '../tasks/submit';

export interface SubmitTaskConsumerAdapter extends TeardownRequest {
    findDependenciesAsync(options: SubmitFindDependenciesOptions): Promise<SubmitFoundDependencies>;
}

export class SubmitTaskAdapter implements SubmitTaskConsumerAdapter {
    constructor(public channel: RequestChannel<SubmitTaskConsumerAdapter>) {}

    async findDependenciesAsync(
        options: SubmitFindDependenciesOptions,
    ): Promise<SubmitFoundDependencies> {
        return await this.channel.requestAsync('findDependenciesAsync', options);
    }
    async teardownAsync() {
        try {
            await this.channel.requestAsync('teardownAsync');
        } catch (err) {
            if (err && !err.message.includes('channel closed while waiting for response')) {
                throw err;
            }
        }
    }
}
