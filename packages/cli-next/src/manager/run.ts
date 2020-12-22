import {RunTaskConsumer, RunTaskProducer} from '../tasks/run';
import {spawnError} from '../helpers/error_utils';
import {System} from '../helpers/system';

export async function createRunTaskAsync(
    sys: System,
    manager: RunTaskProducer = {},
): Promise<RunTaskConsumer> {
    throw spawnError('not implemented');
}
