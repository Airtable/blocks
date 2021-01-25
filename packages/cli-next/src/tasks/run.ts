import {RequestChannel} from '../helpers/task_channels';

export interface RunTaskProducer {
    readyAsync(): Promise<void>;
}

export type RunTaskProducerChannel = RequestChannel<RunTaskProducer>;

export interface RunDevServerOptions {
    port: number;
    mode: 'development' | 'production';
    entry: string;
}

export interface RunTaskConsumer {
    startDevServerAsync(options: RunDevServerOptions): Promise<void>;
    teardownAsync(): Promise<void>;
}

export type RunTaskConsumerChannel = RequestChannel<RunTaskConsumer>;
