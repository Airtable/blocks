import {Configuration} from 'webpack';

import {BUNDLE_NAME} from '../settings';

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
    options: any;
}

/**
 * If the bundler is behind a proxy (it is), we need to manualy inject the client.
 *
 * @param entry Path to first module to execute in the produced bundle.
 * @param liveReload Configure live reload client.
 */
function injectLiveReloadClient(entry: string, liveReload: WebpackSummaryOptions['liveReload']) {
    let otherScripts = {};
    if (liveReload) {
        const clientPath = require.resolve('webpack-dev-server/client');
        const protocol = liveReload.https ?? true ? 'https' : 'http';
        otherScripts = {
            poll_script: `${clientPath}?${protocol}://localhost:${liveReload.port}'`,
        };
    }
    return {
        [BUNDLE_NAME]: entry,
        ...otherScripts,
    };
}

/**
 * Syncronyously transform a serializable bundler configuration summary to
 * webpack configuration format.
 *
 * @param param0 summary of webpack compiler config
 */
export function createWebpackCompilerConfig({
    mode,
    context,
    entry,
    outputPath,
    liveReload,
    assets: {
        javascript: {options: babelOptions},
    },
}: WebpackSummaryOptions): Configuration {
    let devtool;

    if (mode === 'development') {
        devtool = 'inline-cheap-module-source-map';
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
                    test: /\.(?:m?j|t)sx?$/,
                    include: [/node_modules/],
                    resolve: {
                        // Modules in node_modules might have a package.json
                        // stating "type": "module" (such as
                        // @babel/runtime/helpers/esm). In such a case any
                        // import statements are required to have mandatory file
                        // extensions.
                        //
                        // See:
                        // https://nodejs.org/api/esm.html#esm_mandatory_file_extensions
                        //
                        // To disable this set this resolution option to false.
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
