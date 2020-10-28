// @flow
/* eslint-disable no-console */
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const {debounce} = require('lodash');
const fsUtils = require('../helpers/fs_utils');
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
const generateLegacyAirtableBlockModuleCode = require('./generate_legacy_airtable_block_module');
const BlockBuildTypes = require('../types/block_build_types');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const BlockBuilderJobQueue = require('./block_builder_job_queue');
const ErrorCodes = require('../types/error_codes');
const {RESULT_OK} = require('../types/result');
const {getBlockDirPath} = require('../helpers/get_block_dir_path');
const hasBackendRoutes = require('../helpers/has_backend_routes');

import type {BlockBuildType} from '../types/block_build_types';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {BlockJson} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';
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

const DEBOUNCE_DELAY_FOR_SDK_BUNDLE_ENQUEUE_MS = 1000;

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
    _remoteJson: RemoteJson;
    _enableDeprecatedAbsolutePathImport: boolean;
    _enableIsolatedBuild: boolean;
    _enableLiveSdkReload: boolean;
    _shouldTranspileForAllBrowsers: boolean;
    _blockDirPath: DirectoryPath;
    _baseOutputBuildDirPath: string;
    _outputTranspiledDirPath: string;
    _outputUserTranspiledDirPath: string;
    _outputBuildArtifactsDirPath: string;
    _browserify: browserify;
    _initialBuildResolveIfExists: PromiseResolveFunction<void> | null;
    _blockBuilderJobQueue: BlockBuilderJobQueue;
    _backendSdkBaseUrl: string | null;
    _browserifyCache: {[FilePath]: mixed};
    _debouncedEnqueueBundleJob: any; // eslint-disable-line flowtype/no-weak-types
    _ignoredGlobPatternsFromBlockJson: Array<string>;

    constructor(args: {
        buildTypeMode: BlockBuildType,
        blockJson: BlockJson,
        remoteJson: RemoteJson,
        enableDeprecatedAbsolutePathImport: boolean,
        enableIsolatedBuild: boolean,
        enableLiveSdkReload: boolean,
        transpileForAllBrowsers?: boolean,
        backendSdkBaseUrl?: string | null,
    }) {
        this._buildTypeMode = args.buildTypeMode;
        this._blockJson = args.blockJson;
        this._remoteJson = args.remoteJson;
        this._enableDeprecatedAbsolutePathImport = args.enableDeprecatedAbsolutePathImport;
        this._enableIsolatedBuild = args.enableIsolatedBuild;
        this._enableLiveSdkReload = args.enableLiveSdkReload;
        this._shouldTranspileForAllBrowsers = args.transpileForAllBrowsers || true;
        this._backendSdkBaseUrl = args.backendSdkBaseUrl || null;
        this._blockDirPath = getBlockDirPath();

        this._initialBuildResolveIfExists = null;
        this._browserifyCache = {};
        this._ignoredGlobPatternsFromBlockJson = this._blockJson.ignored || [];

        if (this._enableIsolatedBuild && this._buildTypeMode !== BlockBuildTypes.RELEASE) {
            throw new Error('isolated builds are only supported in release');
        }
        if (this._enableLiveSdkReload && this._buildTypeMode !== BlockBuildTypes.DEVELOPMENT) {
            throw new Error('live SDK reloading is only supported in development');
        }

        this._setupBuildOutputDirPaths();
        this._setupBlockBuilderJobQueue();
        this._setupBrowserify();

        this._debouncedEnqueueBundleJob = debounce(
            this._enqueueBundleJob.bind(this),
            DEBOUNCE_DELAY_FOR_SDK_BUNDLE_ENQUEUE_MS,
        );
    }

    static async createDevelopmentBlockBuilderAsync(args: {
        blockJson: BlockJson,
        remoteJson: RemoteJson,
        enableDeprecatedAbsolutePathImport: boolean,
        sdkPathIfExists: string | null,
        transpileForAllBrowsers?: boolean,
    }): Promise<BlockBuilder> {
        return new BlockBuilder({
            buildTypeMode: BlockBuildTypes.DEVELOPMENT,
            enableDeprecatedAbsolutePathImport: args.enableDeprecatedAbsolutePathImport,
            // development builds are never isolated:
            enableIsolatedBuild: false,
            enableLiveSdkReload: !!args.sdkPathIfExists,
            blockJson: args.blockJson,
            remoteJson: args.remoteJson,
            transpileForAllBrowsers: args.transpileForAllBrowsers,
        });
    }
    static async createReleaseBlockBuilderAsync(args: {
        blockJson: BlockJson,
        remoteJson: RemoteJson,
        enableDeprecatedAbsolutePathImport: boolean,
        enableIsolatedBuild: boolean,
        backendSdkBaseUrl: string | null,
    }): Promise<BlockBuilder> {
        return new BlockBuilder({
            buildTypeMode: BlockBuildTypes.RELEASE,
            blockJson: args.blockJson,
            remoteJson: args.remoteJson,
            enableDeprecatedAbsolutePathImport: args.enableDeprecatedAbsolutePathImport,
            enableIsolatedBuild: args.enableIsolatedBuild,
            transpileForAllBrowsers: true,
            // RELEASE builds never use live SDK reloading
            enableLiveSdkReload: false,
            backendSdkBaseUrl: args.backendSdkBaseUrl,
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
    get remoteJson(): RemoteJson {
        return this._remoteJson;
    }
    get blockDirPath(): DirectoryPath {
        return this._blockDirPath;
    }
    get outputUserTranspiledDirPath(): DirectoryPath {
        return this._outputUserTranspiledDirPath;
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
    get outputNodeModulesDirPath(): DirectoryPath {
        return path.join(
            this._enableIsolatedBuild ? this._outputUserTranspiledDirPath : this._blockDirPath,
            'node_modules',
        );
    }
    _setupBuildOutputDirPaths(): void {
        this._baseOutputBuildDirPath = this._enableIsolatedBuild
            ? path.join(
                  blockCliConfigSettings.TEMP_DIR_PATH,
                  blockCliConfigSettings.BUILD_DIR,
                  new Date().getTime().toString(),
              )
            : path.join(
                  this._blockDirPath,
                  blockCliConfigSettings.BUILD_DIR,
                  this._buildTypeMode.toLowerCase(),
              );

        this._outputTranspiledDirPath = path.join(this._baseOutputBuildDirPath, 'transpiled');
        this._outputUserTranspiledDirPath = path.join(this._outputTranspiledDirPath, 'user');
        this._outputBuildArtifactsDirPath = path.join(
            this._baseOutputBuildDirPath,
            'build_artifacts',
        );
    }
    _setupBlockBuilderJobQueue(): void {
        this._blockBuilderJobQueue = new BlockBuilderJobQueue(this._buildTypeMode);
        this._blockBuilderJobQueue.on('buildComplete', () => {
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
    _enqueueBundleJob(): void {
        this._blockBuilderJobQueue.enqueue({
            action: BlockBuilderJobQueue.JOB_ACTIONS.BUNDLE,
        });
    }
    /**
     * Use chokidar to do the initial walk of the user's block directory.
     *
     * In DEVELOPMENT mode:
     *   - chokidar continuously watches for changes in the user's block directory.
     *
     * In RELEASE mode:
     *   - chokidar is only needed for the initial walk of the user's block directory. We don't
     *     need to watch for code changes after that.
     *
     * As chokidar detects files/changes, it will enqueue 'transpile' or 'unlink' jobs to the
     * BlockBuilderJobQueue. Chokidar is also responsible for starting the BlockBuilderJobQueue's
     * queue consumer after it finishes the initial walk through of the block directory.
     */
    _startChokidarWatchAndStartBuildJobQueueConsumer(
        opts: {
            shouldContinueWatchingAfterReady: boolean,
        } = {},
    ): void {
        const {shouldContinueWatchingAfterReady = true} = opts;

        // To support live SDK reloading, we don't want to ignore any dependencies
        // under 'node_modules/@airtable'.
        const ignoredNodeModules = this._enableLiveSdkReload
            ? '**/node_modules/!(@airtable)/**'
            : '**/node_modules/**';

        const ignored = [
            // HACK: We only want to ignore the 'build' directory at the root of this._blockDirPath
            p =>
                this._doesPathStartWith(
                    p,
                    path.join(this._blockDirPath, blockCliConfigSettings.BUILD_DIR),
                ),
            path.join(this._blockDirPath, blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME),
            path.join(this._blockDirPath, blockCliConfigSettings.CONFIG_FILE_NAME),
            '.git',
            '**/.git/**',

            // This is here for legacy purposes. API Keys are now in blockCliConfigSettings.CONFIG_FILE_NAME)
            '**/.airtableAPIKey',

            ignoredNodeModules,
            ...this._ignoredGlobPatternsFromBlockJson,
        ];

        const chokidarInstance = chokidar.watch(this._blockDirPath, {
            ignored,
            // HACK: We always use `persistent: true` here, and will invoke chokidarInstance.close()
            // after the initial walk if shouldContinueWatchingAfterReady is false. This is to work
            // around a weird bug that only seems to occur in Node 10.x and 12.x, and we've filed an
            // issue with Chokidar:
            //    https://github.com/paulmillr/chokidar/issues/957
            // For some reason, if we set `persistent: false` here, the `ready` event would never
            // fire, and since the build queue consumer loop would not have been started either, the
            // Node process exits due to an empty event queue. The result is that `block release`
            // would exit right after printing the message "transpiling and building frontend
            // bundle".
            persistent: true,
            cwd: this._blockDirPath,
            alwaysStat: true,
            awaitWriteFinish: true,
        });

        const chokidarEvents = ['add', 'addDir', 'change'];
        for (const chokidarEvent of chokidarEvents) {
            chokidarInstance.on(chokidarEvent, (fileOrDirPath: string, stats?: fs.Stats) => {
                if (
                    this._enableLiveSdkReload &&
                    this._doesPathStartWith(fileOrDirPath, 'node_modules/@airtable')
                ) {
                    this._debouncedEnqueueBundleJob();
                    return;
                }

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
            .on('ready', () => {
                this._blockBuilderJobQueue.startQueueConsumerLoop({
                    outputUserTranspiledDirPath: this._outputUserTranspiledDirPath,
                    transpileOrCopyAsyncFn: this._transpileOrCopyAsync.bind(this),
                    unlinkAsyncFn: this._unlinkAsync.bind(this),
                    generateFrontendBundleAsyncFn: this._generateFrontendBundleAsync.bind(this),
                });
                if (!shouldContinueWatchingAfterReady) {
                    chokidarInstance.close();
                }
            })
            .on('error', err => {
                console.error(err);
                process.exit(1);
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
                const browserifyOptions = {
                    cache: this._browserifyCache,
                    packageCache: {},
                    debug: true,
                    paths: [this._blockDirPath],
                };
                this._browserify = browserify(clientWrapperFilePath, browserifyOptions);
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
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',
        ];

        // Use the blocks-cli dir as the cwd so babel can properly find presets/plugins.
        return await babel.transformFileAsync(filePath, {
            presets,
            plugins,
            cwd: __dirname,
            sourceMaps: 'inline',
        });
    }
    async _transpileOrCopyAsync(
        fileOrDirectoryPath: string,
        stats?: fs.Stats | null,
    ): Promise<Result<string, TranspileError>> {
        const dirPath = path.dirname(fileOrDirectoryPath);
        const targetDirPath = path.join(this._outputUserTranspiledDirPath, dirPath);

        await fsUtils.mkdirPathAsync(targetDirPath);

        // Create symlinks in node_modules for the user's block code's top-level directories to
        // support require/import using absolute paths:
        // - For DEVELOPMENT the node_modules is in blocksDir.
        // - For RELEASE, it should be the newly installed node_modules
        // see: https://github.com/browserify/browserify-handbook#avoiding-
        if (stats && stats.isDirectory() && this._enableDeprecatedAbsolutePathImport) {
            const isTopLevelDir = !fileOrDirectoryPath.includes(path.sep);
            if (isTopLevelDir) {
                const symLinkToNodeModulesDir = path.join(
                    this.outputNodeModulesDirPath,
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
                    console.error(err.message);
                    return {err};
                }
                await fsUtils.writeFileAsync(targetFilePath, transpiledResult.code);
            } else {
                await fsUtils.copyFileAsync(fileOrDirectoryPath, targetFilePath);
            }

            delete this._browserifyCache[targetFilePath];
        }

        return {value: fileOrDirectoryPath};
    }
    async _unlinkAsync(filePath: FilePath): Promise<void> {
        const targetFilePath = path.join(
            this._outputUserTranspiledDirPath,
            this._replaceTranspiledFileExtension(filePath),
        );
        await fsUtils.removeAsync(targetFilePath);
        delete this._browserifyCache[targetFilePath];
    }
    _getErrorFromNpmCIStderr(stderr: string): Error | null {
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
    async _npmCIAsync(dirPath: DirectoryPath): Promise<Result<void, Error>> {
        try {
            const {stderr} = await npmAsync(dirPath, ['ci', '--production', '--quiet']);

            const npmCIError = this._getErrorFromNpmCIStderr(stderr.toString());
            if (npmCIError) {
                return {err: npmCIError};
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
            console.error('Bundle Error:', err.message);
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
    /** Create legacy airtable-block module. */
    async _writeLegacyAirtableBlockModuleAsync(): Promise<void> {
        const moduleDirPath = path.join(this.outputNodeModulesDirPath, 'airtable-block');
        await fsUtils.mkdirPathAsync(moduleDirPath);
        const moduleFilePath = path.join(moduleDirPath, 'index.js');
        await fsUtils.writeFileAsync(moduleFilePath, generateLegacyAirtableBlockModuleCode());
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
            const blocksBackendWrapperPackageLockJsonPath = path.join(
                projectRootPath,
                'blocks_backend_wrapper',
                'package-lock.json',
            );
            if (!(await fsUtils.existsAsync(blocksBackendWrapperPackageLockJsonPath))) {
                throw new Error(
                    `missing blocks backend wrapper package-lock.json at ${blocksBackendWrapperPackageLockJsonPath}`,
                );
            }
            await fsUtils.copyFileAsync(
                blocksBackendWrapperPackageLockJsonPath,
                path.join(outputDirPath, 'package-lock.json'),
            );
        } catch (err) {
            return {err};
        }
        return await this._npmCIAsync(outputDirPath);
    }
    async _writeBackendSdkForReleaseAsync(): Promise<Result<void, Error>> {
        if (this._buildTypeMode !== BlockBuildTypes.RELEASE) {
            throw new Error('Downloading backend SDK for build is only available for RELEASE mode');
        }

        try {
            const backendSdkJs = await downloadBackendSdkAsync({
                backendSdkBaseUrlIfExists: this._backendSdkBaseUrl,
                remoteJson: this._remoteJson,
                canUseCachedBackendSdk: false,
            });
            await fsUtils.writeFileAsync(
                path.join(
                    this._outputTranspiledDirPath,
                    `${blockCliConfigSettings.BACKEND_SDK_MODULE}.js`,
                ),
                backendSdkJs,
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
        const backendSdkResult = await this._writeBackendSdkForReleaseAsync();
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
    async _cleanAndPrepareOutputDirectoriesAsync(): Promise<void> {
        await Promise.all([
            fsUtils.emptyDirAsync(this._outputUserTranspiledDirPath),
            fsUtils.emptyDirAsync(this._outputBuildArtifactsDirPath),
        ]);

        // It's possible for some blocks (e.g. scripting) to live in hyperbase, which by convention
        // uses absolute instead of relative imports. This absoluteImportRoot option specifies the
        // prefix for files in this block dir to use for absolute imports.
        const absoluteImportRoot =
            this._blockJson.__hyperbase && this._blockJson.__hyperbase.absoluteImportRoot;
        if (absoluteImportRoot) {
            if (this._enableDeprecatedAbsolutePathImport) {
                throw new Error(
                    'cannot use hyperbase absolute imports and legacy absolute imports at the same time',
                );
            }

            await fsUtils.mkdirAsync(path.join(this._outputUserTranspiledDirPath, 'node_modules'));
            await fsUtils.symlinkAsync(
                this._outputUserTranspiledDirPath,
                path.join(this._outputUserTranspiledDirPath, 'node_modules', absoluteImportRoot),
            );
        }
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
        await this._cleanAndPrepareOutputDirectoriesAsync();
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
    async _copyFileAsync(filename: string): Promise<boolean> {
        console.log(`copying ${filename} file`);
        const filePath = path.join(this._blockDirPath, filename);
        const doesFileExist = await fsUtils.existsAsync(filePath);
        if (!doesFileExist) {
            return false;
        }
        await fsUtils.copyFileAsync(
            filePath,
            path.join(this._outputUserTranspiledDirPath, filename),
        );
        return true;
    }
    async buildAndWatchAsync(): Promise<void> {
        if (this._buildTypeMode !== BlockBuildTypes.DEVELOPMENT) {
            throw new Error('Watch mode is only available for DEVELOPMENT mode');
        }
        await this._cleanAndPrepareBuildAsync();
        await this._writeLegacyAirtableBlockModuleAsync();

        this._startChokidarWatchAndStartBuildJobQueueConsumer({
            shouldContinueWatchingAfterReady: true,
        });
        await this._waitForInitialBuildAsync();
    }
    async buildForReleaseAsync(): Promise<Result<BuildPackagePaths, ErrorWithCode>> {
        if (this._buildTypeMode !== BlockBuildTypes.RELEASE) {
            throw new Error('Build for release is only available for RELEASE mode');
        }
        await this._cleanAndPrepareBuildAsync();

        if (this._enableIsolatedBuild) {
            // 1. Manually copy the package.json file even though BlockBuilderJobQueue will also copy it
            //    over during the initial scanning and bundling of the directory. This is because we
            //    need to install the node_modules folder before transpiling, and the BlockBuilderJobQueue
            //    does not handle installing node_modules.
            if (!(await this._copyFileAsync('package.json'))) {
                return {err: new Error('package.json does not exist!')};
            }

            // 1b. Copy the package-lock.json file so that we can use npm ci and avoid upgrading
            // dependencies between block run and block release
            if (!(await this._copyFileAsync('package-lock.json'))) {
                return {err: new Error('package-lock.json does not exist!')};
            }

            // 2. Install node modules in the output transpiled directory
            console.log('installing node modules');
            const npmCIResult = await this._npmCIAsync(this._outputUserTranspiledDirPath);
            if (npmCIResult.err) {
                return npmCIResult;
            }
            // Write fake stub module for legacy imports after npm install so that it isn't deleted
            // because it isn't included in package.json
            await this._writeLegacyAirtableBlockModuleAsync();
        }

        // 3. Starting chokidar will recursively scan the entire user's block directory and queue
        //    the files for transpilation and bundling.
        console.log('transpiling and building frontend bundle');
        this._startChokidarWatchAndStartBuildJobQueueConsumer({
            shouldContinueWatchingAfterReady: false,
        });
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
    async wipeBaseOutputBuildDirAsync(): Promise<void> {
        await fsUtils.removeAsync(path.join(this._baseOutputBuildDirPath));
    }
}

module.exports = BlockBuilder;
