import _debug from 'debug';

import {invariant} from './error_utils';
import {HandshakeRequest, TeardownRequest} from './task';
import {
    ChannelMethods,
    createEventEmitterChannel,
    createRequestChannel,
    createResponseChannel,
    RequestChannel,
} from './task_channels';

const debug = _debug('block-cli:task:host');

type Defines<T, K extends keyof T> = T & Required<Pick<T, K>>;

function has<O, K extends keyof O>(o: O, key: K): o is Defines<O, K> {
    return o[key] !== undefined;
}

export async function mainAsync<
    Producer extends ChannelMethods<Producer> & HandshakeRequest,
    Consumer extends ChannelMethods<Consumer> & TeardownRequest
>(entryPoint: (producer: RequestChannel<Producer>) => Promise<Consumer> | Consumer) {
    debug('starting task host');
    invariant(has(process, 'send'), 'This process must be a forked child process.');
    const channel = createEventEmitterChannel(process);

    const requestChannel = createRequestChannel<Producer>(channel);

    const consumer = await entryPoint(requestChannel);
    const responseChannel = createResponseChannel(channel, consumer);

    (async () => {
        for await (const {method, result} of responseChannel) {
            if (method === 'teardownAsync') {
                await result;
                break;
            }
        }
        channel.close();
    })();

    (async () => {
        await Promise.resolve();
        await (requestChannel as RequestChannel<HandshakeRequest>).requestAsync('readyAsync');
    })();

    debug('running task communications');
    await responseChannel.channelClosedPromise;
}

mainAsync(require(process.argv[2]).default);
