export enum BundleMode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

export interface ReleaseBundleOptions {
    mode: 'development' | 'production';
    /** Absolute directory path to the root of the package to bundle. */
    context: string;
    entry: string;
    /** Absolute directory path to write the produced bundle to. */
    outputPath: string;
    /** Whether or not to generate a separate sourcemap file. This will override the default behavior for mode. */
    shouldGenerateSeparateSourceMaps?: boolean;
}

export interface ReleaseTaskConsumer {
    /**
     * Bundle the specified directory starting with entry and resolve the
     * promise when complete.
     */
    bundleAsync(options: ReleaseBundleOptions): Promise<void>;
    /** Instruction to clean up. Shared with {@link RunTaskConsumer}. */
    teardownAsync(): Promise<void>;
}
