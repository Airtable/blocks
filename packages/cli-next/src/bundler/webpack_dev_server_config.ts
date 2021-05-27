import {Configuration} from 'webpack-dev-server';

export interface WebpackDevServerOptions {
    /** Port webpack dev server runs on. */
    port: number;
}

export function createWebpackDevServerConfig({port}: WebpackDevServerOptions): Configuration {
    const unspecifiedConfiguration = {
        logLevel: 'silent',
    } as any;
    return {
        port,
        injectClient: false,
        hot: false,
        disableHostCheck: true,
        clientLogLevel: 'silent',
        ...unspecifiedConfiguration,
    };
}
