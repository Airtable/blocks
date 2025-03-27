import {Configuration} from 'webpack-dev-server';

export interface WebpackDevServerOptions {
    /** Port webpack dev server runs on. */
    port: number;
}

export function createWebpackDevServerConfig({port}: WebpackDevServerOptions): Configuration {
    return {
        port,
        client: false,
        hot: false,
        allowedHosts: 'all',
    };
}
