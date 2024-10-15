import {Configuration} from 'webpack-dev-server';

export interface WebpackDevServerOptions {
    /** Port webpack dev server runs on. */
    port: number;
}

export function createWebpackDevServerConfig({port}: WebpackDevServerOptions): Configuration {
    return {
        port,
        // The client will be injected manually in the webpack configuration.
        client: false,
        // Disable hot module replacement, we will just use live reload for the moment.
        hot: false,
        allowedHosts: 'all',
    };
}
