import {RequestChannel} from '../helpers/task_channels';

export {RequestChannel};

export interface ReleaseTaskProducer {
    readyAsync(): Promise<void>;
}

export type ReleaseTaskProducerChannel = RequestChannel<ReleaseTaskProducer>;

export interface ReleaseBundleOptions {
    mode: 'development' | 'production';
    context: string;
    entry: string;
    outputPath: string;
}

export interface ReleaseTaskConsumer {
    bundleAsync(options: ReleaseBundleOptions): Promise<void>;
    teardownAsync(): Promise<void>;
}

export type ReleaseTaskConsumerChannel = RequestChannel<ReleaseTaskConsumer>;
