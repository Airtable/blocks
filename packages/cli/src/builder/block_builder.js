// @flow
/* eslint-disable no-console */
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const fsUtils = require('../fs_utils');
const envify = require('envify/custom');
const invariant = require('invariant');
const babel = require('@babel/core');
const chokidar = require('chokidar');
const chalk = require('chalk');
const {npmAsync} = require('../helpers/node_modules_command_helpers');
const browserify = require('browserify');
const watchify = require('watchify');
const Terser = require('terser');
const downloadBackendSdkAsync = require('../helpers/download_backend_sdk_async');
const getBlocksCliProjectRootPath = require('../helpers/get_blocks_cli_project_root_path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper');
const BlockBuildTypes = require('../types/block_build_types');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const BlockBuilderJobQueue = require('./block_builder_job_queue');
const ErrorCodes = require('../types/error_codes');
const {RESULT_OK} = require('../types/result');
const {getBlockDirPath} = require('../get_block_dir_path');
const hasBackendRoutes = require('../helpers/has_backend_routes');

import type {BlockBuildType} from '../types/block_build_types';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {BlockJson} from '../types/block_json_type';
import type {Result} from '../types/result';
import type {PromiseResolveFunction} from '../types/promise_types';
import type {ErrorWithCode, TranspileError} from '../types/error_codes';

type FilePath = string;
type DirectoryPath = string;

type BuildPackagePaths = {|
    frontendBundlePath: FilePath,
    backendDeploymentPackagePath: FilePath | null,
|};

const FILES_TO_TRANSPILE_REGEX = /\.(es6|js|es|jsx|ts|tsx)$/;

// Minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
const developmentBrowsers: Array<string> = [
    'chrome 61', // Desktop (electron) app.
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 1 safari version',
    'last 1 edge version',
];

// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
const allSupportedBrowsers: Array<string> = [
    'firefox >= 29',
    'chrome >= 32',
    'safari >= 9',
    'edge >= 13',
];

/**
 * BlockBuilder can be used in two ways (defined by buildTypeMode):
 * - DEVELOPMENT mode - an interactive mode, which watches for and responds to changes in the
 *   the user's block code. This is the mode used by `block run`.
 * - RELEASE mode - a non-interactive mode, which will transpile, bundle, and package the user's
 *   block code. This is the mode used by `block release`.
 */
class BlockBuilder {
    _buildTypeMode: BlockBuildType;
    _blockJson: BlockJson;
    _shouldTranspileForAllBrowsers: boolean;
    _blockDirPath: DirectoryPath;
    _outputTranspiledDirPath: string;
    _outputUserTranspiledDirPath: string;
    _outputBuildArtifactsDirPath: string;
    _browserify: browserify;
    _initialBuildResolveIfExists: PromiseResolveFunction | null;
    _blockBuilderJobQueue: BlockBuilderJobQueue;
    _backendSdkBaseUrl: string | null;

    constructor(args: {
        buildTypeMode: BlockBuildType,
        blockJson: BlockJson,
        transpileForAllBrowsers?: boolean,
        backendSdkBaseUrl?: string | null,
    }) {
        this._buildTypeMode = args.buildTypeMode;
        this._blockJson = args.blockJson;
        this._shouldTranspileForAllBrowsers = args.transpileForAllBrowsers || false;
        this._backendSdkBaseUrl = args.backendSdkBaseUrl || null;
        this._blockDirPath = getBlockDirPath();

        const outputBuildDirPath = path.join(
            this._blockDirPath,
            blockCliConfigSettings.BUILD_DIR,
            this._buildTypeMode.toLowerCase(),
        );
        this._outputTranspiledDirPath = path.join(outputBuildDirPath, 'transpiled');
        this._outputUserTranspiledDirPath = path.join(this._outputTranspiledDirPath, 'user');
        this._outputBuildArtifactsDirPath = path.join(outputBuildDirPath, 'build_artifacts');

        this._initialBuildResolveIfExists = null;

        this._setupBlockBuilderJobQueue();
        this._setupBrowserify();
    }

    static async createDevelopmentBlockBuilderAsync(args: {
        blockJson: BlockJson,
        transpileForAllBrowsers?: boolean,
    }): Promise<BlockBuilder> {
        const {blockJson, transpileForAllBrowsers} = args;
        return new BlockBuilder({
            buildTypeMode: BlockBuildTypes.DEVELOPMENT,
            blockJson,
            transpileForAllBrowsers,
        });
    }
    static async createReleaseBlockBuilderAsync(args: {
        blockJson: BlockJson,
        backendSdkBaseUrl: string | null,
    }): Promise<BlockBuilder> {
        const {blockJson, backendSdkBaseUrl} = args;

        return new BlockBuilder({
            buildTypeMode: BlockBuildTypes.RELEASE,
            blockJson,
            transpileForAllBrowsers: true,
            backendSdkBaseUrl,
        });
    }
    static getBlockBuilderError(
        blockBuilderStateData: BlockBuilderStateData,
    ): ErrorWithCode | TranspileError {
        // TODO(richsinn): Handle multiple errors on block frame.
        invariant(
            blockBuilderStateData.status === BlockBuilderStatuses.ERROR,
            'expect blockBuilderStateData.status to be ERROR',
        );
        let err;
        if (blockBuilderStateData.transpileErrs && blockBuilderStateData.transpileErrs.length > 0) {
            err = blockBuilderStateData.transpileErrs[0];
        } else if (blockBuilderStateData.bundleErr) {
            err = blockBuilderStateData.bundleErr;
        } else {
            // This should never happen.
            throw new Error('error information missing!');
        }

        return err;
    }

    get blockJson(): BlockJson {
        return this._blockJson;
    }
    get blockDirPath(): DirectoryPath {
        return this._blockDirPath;
    }
    get browserify(): browserify {
        return this._browserify;
    }
    get outputBuildArtifactsDirPath(): string {
        return this._outputBuildArtifactsDirPath;
    }
    get blockBuilderStateData(): BlockBuilderStateData {
        return this._blockBuilderJobQueue.blockBuilderStateData;
    }
    get blockBuilderJobQueue(): BlockBuilderJobQueue {
        return this._blockBuilderJobQueue;
    }
    _setupBlockBuilderJobQueue(): void {
        this._blockBuilderJobQueue = new BlockBuilderJobQueue(this._buildTypeMode);
        this._blockBuilderJobQueue
            .on('initialBundleSuccessfullyCompleted', () => {
                // NOTE: The `update` event handler will enqueue `BUNDLE` jobs, but we only attach
                // the `update` event handler after the first successful bundle for two reasons:
                //   1. The watchify plugin will emit the `update` event on the first call
                //      to `bundle()` before `bundle()` even completes. But we only want to start
                //      listening for `update` events after the initial `bundle()` completes,
                //      otherwise we'll trigger two `bundle()` requests on initial building.
                //   2. If the initial `bundle()` fails, the `update` event will never emit again,
                //      until a successful `bundle()` completes. Therefore, we rely on the
                //      BlockBuildJobQueue to enqueue until an initial `bundle()` success before
                //      we start enqueuing `BUNDLE` jobs from here.
                this._browserify.on('update', () => {
                    this._blockBuilderJobQueue.enqueue({
                        action: BlockBuilderJobQueue.JOB_ACTIONS.BUNDLE,
                    });
                });
            })
            .on('buildComplete', () => {
                if (this._initialBuildResolveIfExists !== null) {
                    this._initialBuildResolveIfExists();
                }
            });
    }
    _doesPathStartWith(sourcePath: string, searchPath: string): boolean {
        const normalizedSourcePath = path.normalize(sourcePath);
        const normalizedSearchPath = path.normalize(searchPath);

        return normalizedSourcePath.startsWith(normalizedSearchPath);
    }
    /**
     * Use chokidar to do the initial walk of the user's block directory.
     *
     * In DEVELOPMENT mode:
     *   - chokidar watches for changes in the blocks code by setting `persistent` option to true.
     *
     * In RELEASE mode:
     *   - chokidar is only needed for the initial walk of the user's block directory. We don't
     *     need to watch for code changes, so we set the `persistent` option to false.
     *
     * As chokidar detects files/changes, it will enqueue 'transpile' jobs to the BlockBuilderJobQueue.
     * It is also responsible for starting the BlockBuilderJobQueue consumer after it finishes the
     * initial walk through of the block directory.
     *
     * see: https://github.com/paulmillr/chokidar#persistence
     */
    _startChokidarWatchAndStartBuildJobQueueConsumer(
        chokidarOpts: {
            persistent?: boolean,
        } = {},
    ): void {
        const {persistent = true} = chokidarOpts;

        // TODO(richsinn): Should we respect the user's .gitignore contents here?
        const ignored = [
            // HACK: For some reason, we need to use a function here to ignore the 'build' and
            // the 'node_modules' directories. Using glob patterns is not properly ignored and
            // it copies things over in an endless recursion.
            p =>
                this._doesPathStartWith(
                    p,
                    path.join(this._blockDirPath, blockCliConfigSettings.BUILD_DIR),
                ),
            p => this._doesPathStartWith(p, path.join(this._blockDirPath, 'node_modules')),
            path.join(this._blockDirPath, blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME),
            path.join(this._blockDirPath, blockCliConfigSettings.CONFIG_FILE_NAME),
            '.git',
            '**/.git/**',

            // This is here for legacy purposes. API Keys are now in blockCliConfigSettings.CONFIG_FILE_NAME)
            '**/.airtableAPIKey',
        ];

        const chokidarInstance = chokidar.watch(this._blockDirPath, {
            ignored,
            persistent,
            cwd: this._blockDirPath,
            alwaysStat: true,
            awaitWriteFinish: true,
        });

        const chokidarEvents = ['add', 'addDir', 'change'];
        for (const chokidarEvent of chokidarEvents) {
            chokidarInstance.on(chokidarEvent, (fileOrDirPath: string, stats?: fs.Stats) => {
                if (fileOrDirPath === blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME) {
                    throw new Error(
                        `${blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME} is a reserved file name!`,
                    );
                }

                // Exiting the CLI process if changes detected to the 'block.json' file because
                // it requires re-bootstrapping the block code.
                // TODO(richsinn): re-bootstrap/restart the process automatically (i.e. rewrite the
                //   'block_client_wrapper.js' file, etc.)
                if (
                    fileOrDirPath === blockCliConfigSettings.BLOCK_FILE_NAME &&
                    this._buildTypeMode === BlockBuildTypes.DEVELOPMENT &&
                    this._blockBuilderJobQueue.blockBuilderStateData.status !==
                        BlockBuilderStatuses.START
                ) {
                    console.log(
                        `Detected changes to '${chalk.bold(
                            blockCliConfigSettings.BLOCK_FILE_NAME,
                        )}' file. Please restart ${chalk.bold('block run')}.`,
                    );
                    process.exit(1);
                }

                invariant(stats, 'stats');
                this._blockBuilderJobQueue.enqueue({
                    action: BlockBuilderJobQueue.JOB_ACTIONS.TRANSPILE_OR_UNLINK,
                    eventType: chokidarEvent,
                    fileOrDirPath,
                    fsStatsIfExists: stats,
                });
            });
        }

        chokidarInstance
            .on('unlink', (filePath: string) => {
                if (filePath === blockCliConfigSettings.BLOCK_FILE_NAME) {
                    console.log(
                        `Should not delete the '${chalk.bold(
                            blockCliConfigSettings.BLOCK_FILE_NAME,
                        )}' file!`,
                    );
                    process.exit(1);
                }

                this._blockBuilderJobQueue.enqueue({
                    action: BlockBuilderJobQueue.JOB_ACTIONS.TRANSPILE_OR_UNLINK,
                    eventType: 'unlink',
                    fileOrDirPath: filePath,
                    fsStatsIfExists: null,
                });
            })
            .on('ready', () =>
                this._blockBuilderJobQueue.startQueueConsumerLoop({
                    outputUserTranspiledDirPath: this._outputUserTranspiledDirPath,
                    transpileOrCopyAsyncFn: this._transpileOrCopyAsync.bind(this),
                    generateFrontendBundleAsyncFn: this._generateFrontendBundleAsync.bind(this),
                }),
            )
            .on('error', err => {
                throw err;
            });
    }
    /**
     * Use browserify to bundle the user's transpiled frontend code. NOTE: browserify acts on
     * the user's transpiled files in the `transpiled` directory, NOT the raw user code files to
     * bundle the frontend file.
     *
     * In DEVELOPMENT mode:
     *   - Instantiate browserify instance with the watchify plugin. The watchify plugin watches
     *     the `transpiled` directory for any changes.
     *     NOTE: The `browserify.bundle()` method must be triggered at least once for watchify to
     *     start. Logic to guarantee a successful `bundle()` after startup actually occurs in
     *     BlockBuilderJobQueue.
     *   - When watchify detects changes to the transpiled code, it is responsible for enqueuing
     *     the `BUNDLE` jobs to the BlockBuilderJobQueue.
     *   - Set NODE_ENV to 'development' via envify for proper bundling of `node_modules`
     *     dependencies
     *
     * In RELEASE mode:
     *   - Instantiates browserify instance with all default options.
     *   - Set NODE_ENV to 'production' via envify for proper bundling of node_modules dependencies.
     */
    _setupBrowserify(): void {
        const clientWrapperFilePath = path.join(
            this._outputUserTranspiledDirPath,
            blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );

        let nodeEnv;
        switch (this._buildTypeMode) {
            case BlockBuildTypes.DEVELOPMENT: {
                nodeEnv = 'development';

                // NOTE: The cache and packageCache properties are required by watchify
                // src: https://github.com/browserify/watchify#watchifyb-opts
                const browserifyWatchOptions = {
                    cache: {},
                    packageCache: {},
                    debug: true,
                    paths: [this._blockDirPath],
                };
                this._browserify = browserify(clientWrapperFilePath, browserifyWatchOptions);
                this._browserify.plugin(watchify, {delay: 0});
                break;
            }
            case BlockBuildTypes.RELEASE:
                nodeEnv = 'production';
                this._browserify = browserify(clientWrapperFilePath);
                break;

            default:
                throw new Error(`unrecognized buildTypeMode: ${this._buildTypeMode}`);
        }
        this._browserify.transform(
            // 'global' is required in order to process node_modules files
            {global: true},
            envify({
                NODE_ENV: nodeEnv,
            }),
        );
        this._browserify.bundleAsync = promisify(this._browserify.bundle.bind(this._browserify));

        if (this._buildTypeMode === BlockBuildTypes.DEVELOPMENT) {
            this._browserify.on('bundle', () => console.log('Updating bundle...'));
        }
    }
    async _transpileFileAsync(filePath: FilePath): Promise<Object> {
        const targets = {
            browsers: this._shouldTranspileForAllBrowsers
                ? allSupportedBrowsers
                : developmentBrowsers,
        };
        // We use the '@babel/transform-flow-strip-types' plugin instead of the
        // '@babel/preset-flow' preset due to a Babel bug:
        // https://github.com/babel/babel/issues/8593#issuecomment-419862386
        const presets = [
            ['@babel/preset-env', {targets}],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ];
        const plugins = [
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-proposal-class-properties',
        ];

        // Use the blocks-cli dir as the cwd so babel can properly find presets/plugins.
        return await babel.transformFileAsync(filePath, {presets, plugins, cwd: __dirname});
    }
    async _transpileOrCopyAsync(
        fileOrDirectoryPath: string,
        stats?: fs.Stats | null,
    ): Promise<Result<string, TranspileError>> {
        const dirPath = path.dirname(fileOrDirectoryPath);
        const targetDirPath = path.join(this._outputUserTranspiledDirPath, dirPath);

        await fsUtils.mkdirPathAsync(targetDirPath);

        // Create symlinks in node_modules for the user's block code's top-level directories to
        // allow require with absolute paths:
        // - For DEVELOPMENT the node_modules is in blocksDir.
        // - For RELEASE, it should be the newly installed node_modules
        // TODO(richsinn): revisit this symlinking strategy because it's possible to conflict
        //   with existing node_modules packages.
        if (stats && stats.isDirectory()) {
            const isTopLevelDir = !fileOrDirectoryPath.includes(path.sep);
            if (isTopLevelDir) {
                const symLinkToNodeModulesDir =
                    this._buildTypeMode === BlockBuildTypes.DEVELOPMENT
                        ? path.join(this._blockDirPath, 'node_modules', fileOrDirectoryPath)
                        : path.join(
                              this._outputUserTranspiledDirPath,
                              'node_modules',
                              fileOrDirectoryPath,
                          );
                await fsUtils.symlinkIfNeededAsync(
                    path.join(targetDirPath, fileOrDirectoryPath),
                    symLinkToNodeModulesDir,
                );
            }
        }

        if (stats && stats.isFile()) {
            const targetFilePath = path.join(
                targetDirPath,
                this._replaceTranspiledFileExtension(path.basename(fileOrDirectoryPath)),
            );
            if (FILES_TO_TRANSPILE_REGEX.test(fileOrDirectoryPath)) {
                let transpiledResult;
                try {
                    transpiledResult = await this._transpileFileAsync(fileOrDirectoryPath);
                } catch (err) {
                    err.filePath = fileOrDirectoryPath;
                    console.log(err.message);
                    return {err};
                }
                await fsUtils.writeFileAsync(targetFilePath, transpiledResult.code);
            } else {
                await fsUtils.copyFileAsync(fileOrDirectoryPath, targetFilePath);
            }
        }

        return {value: fileOrDirectoryPath};
    }
    _getErrorFromNpmInstallStderr(stderr: string): Error | null {
        const errorMessageLines = stderr.split('\n').filter(message => {
            return (
                message.trim().length > 0 &&
                !message.startsWith('warning ') &&
                !message.startsWith('npm WARN')
            );
        });
        if (errorMessageLines.length > 0) {
            return new Error(errorMessageLines.join('\n'));
        }
        return null;
    }
    async _npmInstallAsync(dirPath: DirectoryPath): Promise<Result<void, Error>> {
        try {
            const {stderr} = await npmAsync(dirPath, ['install', '--production', '--quiet']);

            const npmInstallError = this._getErrorFromNpmInstallStderr(stderr.toString());
            if (npmInstallError) {
                return {err: npmInstallError};
            }
        } catch (err) {
            return {err};
        }
        return RESULT_OK;
    }
    _minify(bundle: Buffer): Result<Buffer, Error> {
        const options = {
            mangle: false,
            keep_fnames: true,
            compress: {
                drop_debugger: false,
            },
        };
        const bundleString = bundle.toString();
        const result = Terser.minify(bundleString, options);
        if (result.error) {
            return {err: result.error};
        }
        return {
            value: Buffer.from(result.code),
        };
    }
    _replaceTranspiledFileExtension(srcFilePath: FilePath) {
        if (FILES_TO_TRANSPILE_REGEX.test(srcFilePath)) {
            return path.join(
                path.dirname(srcFilePath),
                path.basename(srcFilePath, path.extname(srcFilePath)) + '.js',
            );
        } else {
            return srcFilePath;
        }
    }
    async _generateFrontendBundleAsync(): Promise<Result<void, ErrorWithCode>> {
        await fsUtils.mkdirPathAsync(this._outputBuildArtifactsDirPath);

        let bundle: Buffer | null = null;
        try {
            bundle = await this._browserify.bundleAsync();
        } catch (err) {
            console.log(err.message);
            err.code = ErrorCodes.BUNDLE_ERROR;
            return {err};
        }

        await fsUtils.writeFileAsync(
            path.join(this._outputBuildArtifactsDirPath, blockCliConfigSettings.BUNDLE_FILE_NAME),
            bundle,
        );

        if (this._buildTypeMode === BlockBuildTypes.DEVELOPMENT) {
            console.log('Bundle updated');
        }

        return RESULT_OK;
    }
    async _writeFrontendClientWrapperFileAsync(): Promise<void> {
        await fsUtils.mkdirPathAsync(this._outputUserTranspiledDirPath);
        const frontendEntryModulePath = path.join(
            this._outputUserTranspiledDirPath,
            this._replaceTranspiledFileExtension(this._blockJson.frontendEntry),
        );
        const clientWrapperFilePath = path.join(
            this._outputUserTranspiledDirPath,
            blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );

        const isDevelopment = this._buildTypeMode === BlockBuildTypes.DEVELOPMENT;
        const clientWrapperCode = generateBlockClientWrapperCode(
            frontendEntryModulePath,
            isDevelopment,
        );
        await fsUtils.writeFileAsync(clientWrapperFilePath, clientWrapperCode);
    }
    /** Copy transpiled blocks_backend_wrapper (bundled with this tool) to transpiled directory. */
    async _writeBlocksBackendWrapperAsync(): Promise<Result<void, Error>> {
        const projectRootPath = getBlocksCliProjectRootPath();
        const outputDirPath = path.join(
            this._outputTranspiledDirPath,
            blockCliConfigSettings.BACKEND_WRAPPER_DIR,
        );
        try {
            const transpiledBlocksBackendWrapperDirPath = path.join(
                projectRootPath,
                'transpiled',
                'blocks_backend_wrapper',
            );
            if (!(await fsUtils.existsAsync(transpiledBlocksBackendWrapperDirPath))) {
                throw new Error(
                    `missing blocks backend wrapper directory ${transpiledBlocksBackendWrapperDirPath}`,
                );
            }
            await fsUtils.copyAsync(transpiledBlocksBackendWrapperDirPath, outputDirPath);
            const blocksBackendWrapperPackageJsonPath = path.join(
                projectRootPath,
                'blocks_backend_wrapper',
                'package.json',
            );
            if (!(await fsUtils.existsAsync(blocksBackendWrapperPackageJsonPath))) {
                throw new Error(
                    `missing blocks backend wrapper package.json at ${blocksBackendWrapperPackageJsonPath}`,
                );
            }
            await fsUtils.copyFileAsync(
                blocksBackendWrapperPackageJsonPath,
                path.join(outputDirPath, 'package.json'),
            );
        } catch (err) {
            return {err};
        }
        return await this._npmInstallAsync(outputDirPath);
    }
    async _writeBackendSdkAsync(): Promise<Result<void, Error>> {
        try {
            const response = await downloadBackendSdkAsync(this._backendSdkBaseUrl);
            await fsUtils.writeFileAsync(
                path.join(
                    this._outputTranspiledDirPath,
                    `${blockCliConfigSettings.BACKEND_SDK_MODULE}.js`,
                ),
                response.body,
            );
        } catch (err) {
            return {err};
        }
        return RESULT_OK;
    }
    async _zipBackendDeploymentPackageAsync(
        srcDirPath: string,
        outputPath: string,
    ): Promise<Result<void, Error>> {
        const zip = archiver('zip');
        try {
            await new Promise((resolve, reject) => {
                const output = fs.createWriteStream(outputPath);
                output.on('close', resolve);
                zip.on('error', reject);
                zip.pipe(output);
                // Add srcDirPath as root directory.
                zip.directory(srcDirPath, false);
                zip.finalize();
            });
            return RESULT_OK;
        } catch (err) {
            return {err};
        }
    }
    async _generateBackendDeploymentPackageAsync(): Promise<Result<FilePath, Error>> {
        // Set up blocks_backend_wrapper.
        const writeBlocksBackendWrapperResult = await this._writeBlocksBackendWrapperAsync();
        if (writeBlocksBackendWrapperResult.err) {
            return writeBlocksBackendWrapperResult;
        }

        // Set up backend SDK.
        const backendSdkResult = await this._writeBackendSdkAsync();
        if (backendSdkResult.err) {
            return backendSdkResult;
        }

        // Zip everything up.
        const outputPath = path.join(
            this._outputBuildArtifactsDirPath,
            blockCliConfigSettings.BACKEND_BUNDLE_FILE_NAME,
        );
        const zipResult = await this._zipBackendDeploymentPackageAsync(
            this._outputTranspiledDirPath,
            outputPath,
        );
        if (zipResult.err) {
            return zipResult;
        }

        return {value: outputPath};
    }
    async _wipeOutputDirectoriesAsync(): Promise<void> {
        await Promise.all([
            fsUtils.emptyDirAsync(this._outputUserTranspiledDirPath),
            fsUtils.emptyDirAsync(this._outputBuildArtifactsDirPath),
        ]);
    }
    /**
     * For @airtable/blocks-cli up to version 0.0.34, the 'build' directory saved the bundle.js
     * and block_client_wrapper.js file at root of the 'build' directory.
     *
     * However, we now support a more complex 'build' directory structure, and the top-level files
     * should be cleaned out.
     *
     * TODO(richsinn): Remove this method after a "sufficient" amount of time, or after we
     *   implement some sort of minimum version enforcement, and are confident all users have
     *   updated their CLI tool.
     */
    async _cleanupLegacyBuildDirectoryAsync(): Promise<void> {
        const outputBuildDirPath = path.join(this._blockDirPath, blockCliConfigSettings.BUILD_DIR);

        const oldBundleFilePath = path.join(
            outputBuildDirPath,
            blockCliConfigSettings.BUNDLE_FILE_NAME,
        );
        const doesOldBundleExist = await fsUtils.existsAsync(oldBundleFilePath);

        const oldClientWrapperPath = path.join(
            outputBuildDirPath,
            blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );
        const doesOldClientWrapperExist = await fsUtils.existsAsync(oldClientWrapperPath);

        if (doesOldBundleExist || doesOldClientWrapperExist) {
            await fsUtils.emptyDirAsync(outputBuildDirPath);
        }
    }
    async _cleanAndPrepareBuildAsync(): Promise<void> {
        await this._cleanupLegacyBuildDirectoryAsync();
        await this._wipeOutputDirectoriesAsync();
        await this._writeFrontendClientWrapperFileAsync();
    }
    async _waitForInitialBuildAsync(): Promise<void> {
        // This promise will be resolved outside of this function when the initial bundle triggered
        // by the BlockBuilderJobQueue completes.
        return new Promise((resolve, reject) => {
            // flow-disable-next-line flow says this is incompatible with null
            this._initialBuildResolveIfExists = resolve;
        });
    }
    async buildAndWatchAsync(): Promise<void> {
        if (this._buildTypeMode !== BlockBuildTypes.DEVELOPMENT) {
            throw new Error('Watch mode is only available for DEVELOPMENT mode');
        }
        await this._cleanAndPrepareBuildAsync();

        this._startChokidarWatchAndStartBuildJobQueueConsumer({persistent: true});
        await this._waitForInitialBuildAsync();
    }
    async buildForReleaseAsync(): Promise<Result<BuildPackagePaths, ErrorWithCode>> {
        if (this._buildTypeMode !== BlockBuildTypes.RELEASE) {
            throw new Error('Build for release is only available for RELEASE mode');
        }
        await this._cleanAndPrepareBuildAsync();

        // 1. Manually copy the package.json file even though BlockBuilderJobQueue will also copy it
        //    over during the initial scanning and bundling of the directory. This is because we
        //    need to install the node_modules folder before transpiling, and the BlockBuilderJobQueue
        //    does not handle installing node_modules.
        console.log('copying package.json files');
        const packageJsonPath = path.join(this._blockDirPath, 'package.json');
        const doesPackageJsonExist = await fsUtils.existsAsync(packageJsonPath);
        if (!doesPackageJsonExist) {
            return {err: new Error('package.json does not exist!')};
        }
        await fsUtils.copyFileAsync(
            packageJsonPath,
            path.join(this._outputUserTranspiledDirPath, 'package.json'),
        );

        // 2. Install node modules in the output transpiled directory
        console.log('installing node modules');
        const npmInstallResult = await this._npmInstallAsync(this._outputUserTranspiledDirPath);
        if (npmInstallResult.err) {
            return npmInstallResult;
        }

        // 3. Starting chokidar will recursively scan the entire user's block directory and queue
        //    the files for transpilation and bundling.
        console.log('transpiling and building frontend bundle');
        this._startChokidarWatchAndStartBuildJobQueueConsumer({persistent: false});
        await this._waitForInitialBuildAsync();
        this._blockBuilderJobQueue.stopQueueConsumerLoop();

        if (
            this._blockBuilderJobQueue.blockBuilderStateData.status === BlockBuilderStatuses.ERROR
        ) {
            return {
                err: BlockBuilder.getBlockBuilderError(
                    this._blockBuilderJobQueue.blockBuilderStateData,
                ),
            };
        }

        const frontendBundlePath = path.join(
            this._outputBuildArtifactsDirPath,
            blockCliConfigSettings.BUNDLE_FILE_NAME,
        );
        const frontendBundleFileBuffer = await fsUtils.readFileIfExistsAsync(frontendBundlePath);
        if (frontendBundleFileBuffer === null) {
            return {err: new Error('bundle file does not exist!')};
        }

        // 5. Minify the frontend bundle.js file and overwrite the original bundle.js with the
        //    minified version.
        invariant(
            typeof frontendBundleFileBuffer !== 'string',
            'expect frontendBundleFileBuffer as Buffer',
        );
        const minifiedFrontendBundleFileResult = this._minify(frontendBundleFileBuffer);
        if (minifiedFrontendBundleFileResult.err) {
            return minifiedFrontendBundleFileResult;
        }
        await fsUtils.writeFileAsync(frontendBundlePath, minifiedFrontendBundleFileResult.value);

        // 6.Generate backend bundle.
        let backendDeploymentPackagePath = null;
        if (hasBackendRoutes(this._blockJson)) {
            console.log('generating backend bundle');
            const backendDeploymentPackageResult = await this._generateBackendDeploymentPackageAsync();
            if (backendDeploymentPackageResult.err) {
                return backendDeploymentPackageResult;
            }
            backendDeploymentPackagePath = backendDeploymentPackageResult.value;
        }

        return {
            value: {
                frontendBundlePath,
                backendDeploymentPackagePath,
            },
        };
    }
}

module.exports = BlockBuilder;
