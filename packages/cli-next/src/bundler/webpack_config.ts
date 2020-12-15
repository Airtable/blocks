import {Configuration} from 'webpack';

import {BUNDLE_FILE_NAME} from '../settings';

/**
 * Serializable bundler configuration summary.
 *
 * Once transformed into the proper configuration format for the bundling tool,
 * some values may be difficult or not able to be serialized to text.
 */
export interface WebpackSummaryOptions {
    mode: 'development' | 'production';
    /** Root context of source to bundle. */
    context: string;
    /** Path to first module to execute in the produced bundle. */
    entry: string;
    /** Definitions of file types to include in the bundle and how. */
    assets: {
        typescript: TypeScriptConfigFile | TypeScriptCompilerOptions;
    };
}

export interface TypeScriptCompilerOptions {
    assetType: 'typescript';
    // Types provided by the typescript library are for options passed to it
    // directly but we are going to pass to ts-loader which expects
    // tsconfig.json options.
    compilerOptions: any;
}

export interface TypeScriptConfigFile {
    assetType: 'typescript';
    configFile: string;
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
    assets: {
        typescript: {assetType: _, ...typescriptOptions},
    },
}: WebpackSummaryOptions): Configuration {
    return {
        mode,
        context,
        entry,
        output: {
            filename: BUNDLE_FILE_NAME,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: require.resolve('ts-loader'),
                    options: {
                        transpileOnly: true,
                        ...typescriptOptions,
                    },
                },
            ],
        },
    };
}
