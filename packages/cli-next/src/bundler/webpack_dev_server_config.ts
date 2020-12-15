import {Configuration} from 'webpack-dev-server';

export interface WebpackDevServerOptions {
    port: number;
}

export function createWebpackDevServerConfig({port}: WebpackDevServerOptions): Configuration {
    return {
        port,
    };
}
