import * as webpack from 'webpack';

/**
 * Serializable bundler configuration summary.
 *
 * Once transformed into the proper configuration format for the bundling tool,
 * some values may be difficult or not able to be serialized to text.
 */
export interface WebpackSummaryOptions {
    /** Set high level configuration for the bundler. */
    mode: 'development' | 'production';
    /** Root context of source to bundle. */
    context: string;
    /** Path to first module to execute in the produced bundle. */
    entry: string;
    /** Path on disk to write files produced while bundling. */
    outputPath?: string;
    /** When set to true, we always generate a separate .map file with sourcemap information.
     *  This overrides the default behavior based on mode where development would generate inline sourcemaps.
     */
    shouldGenerateSeparateSourceMaps?: boolean;
    /** Configure live reload client. */
    liveReload?: {
        /**
         * Connect the live reload client over an encrypted connection?
         *
         * @default true
         */
        https?: boolean;
        port: number;
    };
    /** Definitions of file types to include in the bundle and how. */
    assets: {
        javascript: JavascriptAssetOptions;
    };
}

export interface JavascriptAssetOptions {
    assetType: 'javascript';

    transpiler: 'babel';
    options: {[key: string]: unknown};
}

export interface BaseWebpackConfig extends webpack.Configuration {
    resolve: {
        extensions: Array<string>;
    };
    module: {
        rules: Array<webpack.RuleSetRule>;
    };
}

/**
 * If the bundler is behind a proxy (it is), we need to manually inject the client.
 *
 * @param entry Path to first module to execute in the produced bundle.
 * @param liveReload Configure live reload client.
 */
function injectLiveReloadClient(entry: string, liveReload: WebpackSummaryOptions['liveReload']) {
    let otherScripts = {};
    if (liveReload) {
        const clientPath = require.resolve('./live-reload-and-report-disconnection');
        const protocol = (liveReload.https ?? true) ? 'https' : 'http';
        otherScripts = {
            'live-reload-and-report-disconnection': `${clientPath}?${protocol}://localhost:${liveReload.port}'`,
        };
    }
    return {
        bundle: entry,
        ...otherScripts,
    };
}

/**
 * Synchronously transform a serializable bundler configuration summary to
 * webpack configuration format.
 *
 * @param param0 summary of webpack compiler config
 */
export function createWebpackCompilerConfig({
    mode,
    context,
    entry,
    outputPath,
    shouldGenerateSeparateSourceMaps,
    liveReload,
    assets: {
        javascript: {options: babelOptions},
    },
}: WebpackSummaryOptions): BaseWebpackConfig {
    let devtool;

    if (mode === 'development') {
        devtool = 'inline-cheap-module-source-map';
    }
    if (shouldGenerateSeparateSourceMaps) {
        devtool = 'source-map';
    }

    return {
        mode,
        devtool,
        context,
        entry: injectLiveReloadClient(entry, liveReload),
        output: {
            path: outputPath,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.mjsx', '.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [require.resolve('style-loader'), require.resolve('css-loader')],
                },
                {
                    test: /\.(?:m?j|t)sx?$/,
                    include: [/node_modules/],
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(?:m?j|t)sx?$/,
                    exclude: [/node_modules/],
                    loader: require.resolve('babel-loader'),
                    options: babelOptions,
                },
            ],
        },
    };
}
