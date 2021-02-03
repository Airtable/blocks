import {ReleaseTaskConsumerChannel, ReleaseTaskProducer} from '../tasks/release';

import {createTaskAsync, TaskProcess} from '../helpers/task';
import {System} from '../helpers/system';

export async function createReleaseTaskAsync(
    sys: System,
    producer: ReleaseTaskProducer,
): Promise<ReleaseTaskConsumerChannel> {
    const entryBase = sys.path.join(__dirname, '..', 'bundler', 'bundler');

    return await createTaskAsync(sys, producer, {
        process: TaskProcess.OUT_OF_PROCESS,
        entryBase,
    });
}
