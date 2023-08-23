import {RequestChannel} from './task_channels';

export interface Bridge<Producer, Consumer> {
    (
        producerChannel: RequestChannel<Producer>,
        createConsumerAsync: () => Promise<Consumer>,
    ): Promise<Consumer>;
}
