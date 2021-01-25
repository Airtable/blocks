import {RunTaskConsumer, RunTaskProducer} from '../tasks/run';

import {createTaskAsync, TaskProcess} from '../helpers/task';
import {System} from '../helpers/system';
import {RequestChannel} from '../helpers/task_channels';

export async function createRunTaskAsync(
    sys: System,
    producer: RunTaskProducer,
): Promise<RequestChannel<RunTaskConsumer>> {
    const entryBase = sys.path.join(__dirname, '..', 'bundler', 'run');

    return await createTaskAsync(sys, producer, {
        process: TaskProcess.OUT_OF_PROCESS,
        entryBase,
    });
}
