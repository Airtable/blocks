import {System} from './system';
import {findExtensionAsync} from './system_extra';
import {ChannelMethods, RequestChannel, RequestChannelAdapter} from './task_channels';
import {forkTaskAsync} from './fork_task_async';

/** Should the task be run in the same or a different process. */
export enum TaskProcess {
    /** Run the task consumer in the same process. */
    IN_PROCESS,
    /** Run the task consumer in another process. */
    OUT_OF_PROCESS,
}

export interface HandshakeRequest {
    readyAsync(): Promise<void>;
}

export interface TeardownRequest {
    teardownAsync(): Promise<void>;
}

/** Task creation options */
interface Options {
    /** Should the task be run in the same process or an external process. */
    process: TaskProcess;
    /** Absolute path without file extension to the entry to the task consumer. */
    entryBase: string;
}

/**
 * Create a task consumer for some work.
 *
 * @param sys Host system
 * @param producer Representation of the task producer to the task consumer
 * @param options Task options
 */
export async function createTaskAsync<
    Producer extends ChannelMethods<Producer> & HandshakeRequest,
    Consumer extends ChannelMethods<Consumer> & TeardownRequest
>(
    sys: System,
    producer: Producer,
    {process, entryBase}: Options,
): Promise<RequestChannel<Consumer>> {
    const entryPath = await findExtensionAsync(sys, entryBase, ['.ts', '.js']);

    if (process === TaskProcess.IN_PROCESS) {
        const producerAdapter = new RequestChannelAdapter(producer);
        (async () => {
            await Promise.resolve();
            await (producerAdapter as RequestChannel<HandshakeRequest>).requestAsync('readyAsync');
        })();

        const entryPoint = require(entryPath).default;
        const consumer: Consumer = await entryPoint(producerAdapter);
        return new RequestChannelAdapter(consumer);
    } else {
        return await forkTaskAsync(sys, producer, entryPath);
    }
}
