import {RequestChannel} from '../helpers/task_channels';

export {RequestChannel};

export enum BuildStatus {
    START = 'start',
    BUILDING = 'building',
    READY = 'ready',
    ERROR = 'error',
}

export interface BuildStateStart {
    status: BuildStatus.START;
}
export interface BuildStateBuilding {
    status: BuildStatus.BUILDING;
}
export interface BuildStateBuilt {
    status: BuildStatus.READY;
}
export interface BuildStateError {
    status: BuildStatus.ERROR;
    error: {
        message: string;
    };
}

export type BuildState = BuildStateStart | BuildStateBuilding | BuildStateBuilt | BuildStateError;

export interface RunTaskProducer {
    readyAsync(): Promise<void>;

    emitBuildStateAsync(buildState: BuildState): Promise<void>;
}

export type RunTaskProducerChannel = RequestChannel<RunTaskProducer>;

export interface RunDevServerOptions {
    port: number;
    liveReload?: {
        https?: boolean;
        port: number;
    };
    mode: 'development' | 'production';
    context: string;
    entry: string;
}

export interface RunTaskConsumer {
    startDevServerAsync(options: RunDevServerOptions): Promise<void>;
    teardownAsync(): Promise<void>;
}

export type RunTaskConsumerChannel = RequestChannel<RunTaskConsumer>;
