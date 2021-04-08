export interface SubmitFindDependenciesOptions {
    mode: 'development' | 'production';
    context: string;
    entry: string;
}

export interface SubmitFoundDependencies {
    files: string[];
}

export interface SubmitTaskConsumer {
    findDependenciesAsync(options: SubmitFindDependenciesOptions): Promise<SubmitFoundDependencies>;
    teardownAsync(): Promise<void>;
}
