import {Configuration} from 'webpack-dev-server';

export interface WebpackDevServerOptions {
    /** Port webpack dev server runs on. */
    port: number;
}

export function createWebpackDevServerConfig({port}: WebpackDevServerOptions): Configuration {
    const unspecifiedConfiguration = {
        // The `quiet` option causes the initial status to still be printed ...
        // `logLevel` is more reliable. But its not specified in the
        // configuration type.
        logLevel: 'silent',
    } as any;
    return {
        port,
        // The client will be injected manually in the webpack configuration.
        injectClient: false,
        // Disable hot module replacement, we will just use live reload for the moment.
        hot: false,
        disableHostCheck: true,
        clientLogLevel: 'silent',
        ...unspecifiedConfiguration,
    };
}
