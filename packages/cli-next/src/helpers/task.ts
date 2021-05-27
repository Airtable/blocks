import {System} from './system';
import {findExtensionAsync} from './system_extra';
import {ChannelMethods, RequestChannel, RequestChannelAdapter} from './task_channels';
import {forkTaskAsync} from './fork_task_async';
import {Bridge} from './task_bridge';

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
    /**
     * Absolute path without file extension to the a file that injects methods
     * into data sent by producer.
     */
    bridgePath: string;
    /** Absolute path without file extension to the entry to the task consumer. */
    entryPath: string;
}

export async function resolveBuiltinModuleAsync(
    sys: System,
    workingdir: string,
    ...modulePath: string[]
) {
    return await findExtensionAsync(sys, sys.path.join(workingdir, ...modulePath), ['.ts', '.js']);
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
    {process, bridgePath, entryPath}: Options,
): Promise<RequestChannel<Consumer>> {
    if (process === TaskProcess.IN_PROCESS) {
        const producerAdapter = new RequestChannelAdapter(producer);
        (async () => {
            await Promise.resolve();
            await (producerAdapter as RequestChannel<HandshakeRequest>).requestAsync('readyAsync');
        })();

        const bridge = require(bridgePath).default as Bridge<Producer, Consumer>;
        const createEntry = async () => await require(entryPath).default();
        const consumer: Consumer = await bridge(producerAdapter, createEntry);
        return new RequestChannelAdapter(consumer);
    } else {
        return await forkTaskAsync(sys, producer, bridgePath, entryPath);
    }
}
