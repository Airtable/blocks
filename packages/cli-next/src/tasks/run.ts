export type RunTaskProducerMessage = never;

export interface RunTaskProducer {
    update?(message: RunTaskConsumerMessage): void;
}

export type RunTaskConsumerMessage = never;

export interface RunTaskConsumer {
    initAsync(options: {mode: 'development' | 'production'}): Promise<void>;
    startBundlingAsync(options: {entry: string}): Promise<void>;
    startDevServerAsync(options: {port: number}): Promise<void>;
    getDevServerPortAsync(): Promise<number>;
    teardownAsync(): Promise<void>;

    update?(message: RunTaskProducerMessage): void;
}
