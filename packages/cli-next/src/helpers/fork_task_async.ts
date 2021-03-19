import {fork} from 'child_process';
import {System} from './system';
import {HandshakeRequest} from './task';
import {
    ChannelMethods,
    createEventEmitterChannel,
    createRequestChannel,
    createResponseChannel,
} from './task_channels';

export async function forkTaskAsync<
    Producer extends ChannelMethods<Producer> & HandshakeRequest,
    Consumer extends ChannelMethods<Consumer>
>(sys: System, producer: Producer, entryPath: string) {
    const taskHost = fork(sys.path.join(__dirname, 'task_tshost.js'), [entryPath]);
    const channel = createEventEmitterChannel(taskHost);

    const requestChannel = createRequestChannel<Consumer>(channel);
    createResponseChannel(channel, producer);

    return requestChannel;
}
