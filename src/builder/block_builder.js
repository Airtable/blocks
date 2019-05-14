// @flow
/* eslint-disable no-console */
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const invariant = require('invariant');
const {execFileAsync} = require('../helpers/child_process_helpers');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('../generate_block_client_wrapper');
const generateBlockBabelConfig = require('../generate_block_babel_config');
const getBackendSdkUrl = require('../get_backend_sdk_url');
const BlockModuleTypes = require('../types/block_module_types');
const Environments = require('../types/environments');
const babel = require('@babel/core');
const browserify = require('browserify');
const promisify = require('es6-promisify');
const request = require('request');
const Terser = require('terser');

import type {BlockFile} from '../types/block_file_type';
import type {
    BlockBackendRouteModuleMetadata,
    BlockModuleType,
    BlockModuleWithoutCode,
} from '../types/block_module_types';

type BlockJson = BlockFile;
type BackendDeploymentPackagePath = string;
type BlockModuleId = string;
type BackendRoutesManifest = {
    [string]: {|
        id: BlockModuleId,
        metadata: BlockBackendRouteModuleMetadata,
    |},
};

type BuildSuccess = {success: true};
type BuildFailure = {success: false, error: Error};
type BuildResult = BuildSuccess | BuildFailure;
// TODO(richsinn): consider using the Result algebraic type from hyperbase
type BuildStepResult<+R> = (
    {|success: true, +value: R|} |
    BuildFailure
);

const BUILD_STEP_RESULT_OK = Object.freeze({success: true, value: undefined});
const BLOCK_BACKEND_WRAPPER_CONTENTS = new Set([
    'backend.js',
    'handle_event_async.js',
    '.babelrc',
    'package.json',
    'yarn.lock',
    'node_modules',
]);

const BlockModuleDirectoryNamesByType = Object.freeze({
    [BlockModuleTypes.FRONTEND]: ('frontend': 'frontend'),
    [BlockModuleTypes.SHARED]: ('shared': 'shared'),
    [BlockModuleTypes.BACKEND_ROUTE]: ('routes': 'routes'),
});

class BlockBuilder {
    _buildFailure(message: string): BuildFailure {
        return {
            success: false,
            error: new Error(message),
        };
    }
    async _readAndParseBlockJsonAsync(blockDirPath: string): Promise<BuildStepResult<BlockJson>> {
        const blockJsonPath = path.join(blockDirPath, 'block.json');
        if (!fs.existsSync(blockJsonPath)) {
            return this._buildFailure('must have a block.json file');
        }
        const blockJsonStr = await fsUtils.readFileAsync(blockJsonPath, 'utf8');
        let blockJson;
        try {
            blockJson = JSON.parse(blockJsonStr);
        } catch (err) {
            return this._buildFailure('invalid block.json file');
        }
        return {success: true, value: blockJson};
    }
    async _transpileSourceCodeAsync(srcDirPath: string, outputDirPath: string, blockJson: BlockJson): Promise<BuildStepResult<void>> {
        const modulesByType: Map<BlockModuleType, Array<BlockModuleWithoutCode>> = new Map();
        for (const blockModule of blockJson.modules) {
            const {type} = blockModule.metadata;
            if (!modulesByType.get(type)) {
                modulesByType.set(type, []);
            }
            const modules = modulesByType.get(type);
            invariant(modules, 'modules');
            modulesByType.set(type, modules.concat(blockModule));
        }

        // Generate a dict of module type to dirpath that we can use to
        // create symlinks for requiring client code.
        const moduleTypeOutputDirPathByModuleType: Map<BlockModuleType, string> = new Map();
        for (const [moduleType, blockModules] of modulesByType) {
            const moduleTypeDirName = BlockModuleDirectoryNamesByType[moduleType];
            const moduleTypeOutputDirPath = path.join(outputDirPath, moduleTypeDirName);
            moduleTypeOutputDirPathByModuleType.set(moduleType, moduleTypeOutputDirPath);
            await fsUtils.mkdirAsync(moduleTypeOutputDirPath);

            for (const blockModule of blockModules) {
                const moduleName = blockModule.metadata.name;
                const moduleOutputFilePath = path.join(moduleTypeOutputDirPath, `${moduleName}.js`);

                // NOTE: currently, when using blocks-cli, the dir names match the module type
                // (not our canonical dir names for each module type).
                const srcModuleFilePath = path.join(srcDirPath, moduleType, `${moduleName}.js`);
                if (!fs.existsSync(srcModuleFilePath)) {
                    return this._buildFailure(`module does not exist: ${srcModuleFilePath}`);
                }
                const moduleValue = await fsUtils.readFileAsync(srcModuleFilePath);

                let compiledCode: string;
                try {
                    // TODO(richsinn): Add stage-2 preset here? In hyperbase's block_babel_config.js
                    //   it uses stage-2. If we do want to use stage-2 here, we'd have to
                    //   use Babel7 style: https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2
                    compiledCode = babel.transform(moduleValue, {
                        ...generateBlockBabelConfig(),
                        filename: moduleOutputFilePath,
                    }).code;
                } catch (error) {
                    return {success: false, error};
                }
                await fsUtils.writeFileAsync(moduleOutputFilePath, compiledCode);
            }
        }

        // Create symlinks in node_modules for our top-level directories. We do this so that you can
        // require files using absolute paths like `frontend/foo`.
        const buildNodeModulesPath = path.join(outputDirPath, 'node_modules');
        for (const [moduleType, moduleTypeDirpath] of Object.entries(moduleTypeOutputDirPathByModuleType)) {
            const symlinkPath = path.join(buildNodeModulesPath, BlockModuleDirectoryNamesByType[moduleType]);
            await fsUtils.symlinkAsync(moduleTypeDirpath, symlinkPath);
        }

        return BUILD_STEP_RESULT_OK;
    }
    _getErrorFromYarnInstallStderr(stderr: string): Error | null {
        const errorMessageLines = stderr.split('\n')
            .filter(message => message.trim().length > 0 && !message.startsWith('warning '));
        if (errorMessageLines.length > 0) {
            return new Error(errorMessageLines.join('\n'));
        }
        return null;
    }
    async _yarnInstallAsync(dirPath: string): Promise<BuildStepResult<void>> {
        const currPath = __dirname;
        const yarnPath = path.join(currPath, '..', '..', 'node_modules', '.bin', 'yarn');
        try {
            const {stderr} = await execFileAsync(yarnPath, ['--prod', '--non-interactive'], {
                cwd: dirPath,
                prefix: 'yarn',
            });
            const yarnInstallError = this._getErrorFromYarnInstallStderr(stderr.toString());
            if (yarnInstallError) {
                return {success: false, error: yarnInstallError};
            }
        } catch (error) {
            return {success: false, error};
        }
        return BUILD_STEP_RESULT_OK;
    }
    async _browserifyAsync(entryFilePath: string): Promise<BuildStepResult<Buffer | null>> {
        // Temporarily set the NODE_ENV to production, regardless of the actual NODE_ENV.
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const browserifyInstance = browserify(entryFilePath);
        browserifyInstance.bundleAsync = promisify(browserifyInstance.bundle.bind(browserifyInstance));

        let bundle: Buffer | null = null;
        let error: Error | null = null;
        try {
            bundle = await browserifyInstance.bundleAsync();
        } catch (err) {
            error = err;
        }

        // Restore NODE_ENV.
        process.env.NODE_ENV = originalNodeEnv;

        if (error !== null) {
            return {success: false, error};
        } else {
            invariant(bundle, 'expects a bundle if there is no error');
            return {success: true, value: bundle};
        }
    }
    _minify(bundle: Buffer): BuildStepResult<Buffer> {
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
            return {
                success: false,
                error: result.error,
            };
        }
        return {
            success: true,
            value: Buffer.from(result.code),
        };
    }
    async _generateFrontendBundleAsync(blockJson: BlockJson, userSrcDirPath: string, buildArtifactsDirPath: string): Promise<BuildStepResult<void>> {
        // We need to write our client wrapper file.
        // NOTE: it's a bit weird that we write the client wrapper file in the user
        // source code directory. This is necessary since we can't have multiple copies
        // of react and react-dom, which the wrapper code depends on. This way, the client
        // wrapper code and the user source code share the same versions of react and
        // react-dom.
        const clientWrapperFilePath = path.join(userSrcDirPath, 'block_client_wrapper');
        const frontendEntryModulePath = path.join(userSrcDirPath, BlockModuleDirectoryNamesByType.frontend, blockJson.frontendEntryModuleName);

        const isDevelopment = false;
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, isDevelopment);
        await fsUtils.writeFileAsync(clientWrapperFilePath, clientWrapperCode);

        const browserifyResult = await this._browserifyAsync(clientWrapperFilePath);
        if (!browserifyResult.success) {
            return browserifyResult;
        }
        invariant(browserifyResult.value, 'expects browserifyResult.value if there is no error');

        const minifyResult = this._minify(browserifyResult.value);
        if (!minifyResult.success) {
            return minifyResult;
        }
        await fsUtils.writeFileAsync(path.join(buildArtifactsDirPath, 'bundle.js'), minifyResult.value);
        return BUILD_STEP_RESULT_OK;
    }
    _hasBackendCode(blockJson: BlockJson): boolean {
        return blockJson.modules.some(blockModule => {
            return blockModule.metadata.type === BlockModuleTypes.BACKEND_ROUTE;
        });
    }
    _validateBlockBackendWrapperDirectoryContents(
        blockBackendWrapperContents: Array<string>,
    ): BuildStepResult<void> {
        const validContents = blockBackendWrapperContents.every(content => BLOCK_BACKEND_WRAPPER_CONTENTS.has(content));
        if (validContents) {
            return BUILD_STEP_RESULT_OK;
        }

        return this._buildFailure(`unexpected block_backend_wrapper contents ${JSON.stringify(blockBackendWrapperContents)}`);
    }
    async _writeBackendSdkAsync(backendWrapperSrcDirPath: string): Promise<BuildStepResult<void>> {
        // TODO(richsinn): We want to eventually get the Backend SDK from the versioned
        //   SDK source (i.e. as a package dependency).
        const backendSdkUrl = getBackendSdkUrl(Environments.PRODUCTION);

        return new Promise((resolve, reject) => {
            request.get({url: backendSdkUrl})
                .on('response', response => {
                    // Handle the case where the request fails.
                    if (response.statusCode !== 200) {
                        resolve(this._buildFailure('Failed to download backend SDK.'));
                    }
                })
                // Pipe the response straight to the file we're trying to create.
                .pipe(fs.createWriteStream(path.join(backendWrapperSrcDirPath, 'block_backend_sdk.js')))
                // Resolve when we finish successfully.
                .on('finish', () => {
                    resolve(BUILD_STEP_RESULT_OK);
                })
                // Handle write errors.
                .on('error', () => {
                    resolve(this._buildFailure('Failed to write backend SDK.'));
                });
        });
    }
    async _zipBackendDeploymentPackageAsync(srcDirPath: string, outputPath: string): Promise<BuildStepResult<void>> {
        const output = fs.createWriteStream(outputPath);
        const zip = archiver('zip');

        try {
            await new Promise((resolve, reject) => {
                output.on('close', resolve);
                zip.on('error', reject);

                zip.pipe(output);

                const patterns = [
                    'backend_wrapper/**/*',
                    // Instead of just using user/**/*, let's explicitly specify
                    // a few paths so that we can ignore frontend modules in the
                    // backend deployment package.
                    'user/node_modules/**/*',
                    'user/package.json',
                ];
                for (const moduleType of [BlockModuleTypes.SHARED, BlockModuleTypes.BACKEND_ROUTE]) {
                    patterns.push(`user/${BlockModuleDirectoryNamesByType[moduleType]}/**`);
                }

                for (const pattern of patterns) {
                    zip.glob(pattern, {
                        cwd: srcDirPath,
                    });
                }

                zip.finalize();
            });
            return BUILD_STEP_RESULT_OK;
        } catch (err) {
            return this._buildFailure(err.message);
        }
    }
    async _generateBackendDeploymentPackageAsync(
        blockJson: BlockJson,
        srcDirPath: string,
        backendWrapperSrcDirPath: string,
        buildArtifactsDirPath: string,
    ): Promise<BuildStepResult<BackendDeploymentPackagePath>> {
        const blocksCliProjectRoot = path.join(__dirname, '..', '..');
        const blockBackendWrapperDirPath = path.join(blocksCliProjectRoot, 'block_backend_wrapper');

        // Install the block_backend_wrapper directory
        const yarnInstallResultForBlockBackendWrapper =
            await this._yarnInstallAsync(blockBackendWrapperDirPath);
        if (!yarnInstallResultForBlockBackendWrapper.success) {
            return yarnInstallResultForBlockBackendWrapper;
        }

        const blockBackendWrapperContents = await fsUtils.readDirAsync(blockBackendWrapperDirPath);
        const validateBlockBackendWrapperResult =
            this._validateBlockBackendWrapperDirectoryContents(blockBackendWrapperContents);
        if (!validateBlockBackendWrapperResult.success) {
            return validateBlockBackendWrapperResult;
        }

        // Copy over the block_backend_wrapper's node_modules and other config files
        // into the backend_wrapper directory. Collect transform functions for '.js' files.
        const configFilesToCopy = [];
        const babelTransformFns = [];
        for (const fileOrDirectoryName of blockBackendWrapperContents) {
            const contentPath = path.join(blockBackendWrapperDirPath, fileOrDirectoryName);
            if (fileOrDirectoryName.endsWith('.js')) {
                babelTransformFns.push(
                    babel.transformFileAsync(contentPath, {
                        cwd: blockBackendWrapperDirPath,
                    })
                );
            } else if (fileOrDirectoryName === 'node_modules') {
                configFilesToCopy.push(
                    fsUtils.copyAsync(contentPath, path.join(backendWrapperSrcDirPath, 'node_modules'))
                );
            } else {
                configFilesToCopy.push(
                    fsUtils.copyFileAsync(contentPath, path.join(backendWrapperSrcDirPath, fileOrDirectoryName))
                );
            }
        }
        await Promise.all(configFilesToCopy);

        // Transpile the block_backend_wrapper source code and write the transpiled
        // results into the backend_wrapper directory.
        const transpiledBlockBackendWrapperFileResults = await Promise.all(babelTransformFns);
        await Promise.all(
            transpiledBlockBackendWrapperFileResults.map(async transpiledResult => {
                const fileName = transpiledResult.options.generatorOpts.sourceFileName;
                await fsUtils.writeFileAsync(
                    path.join(backendWrapperSrcDirPath, fileName),
                    transpiledResult.code,
                );
            })
        );

        // Write the backend SDK file.
        const backendSdkResult = await this._writeBackendSdkAsync(backendWrapperSrcDirPath);
        if (!backendSdkResult.success) {
            return backendSdkResult;
        }

        // Write the routes manifest file
        const backendRouteModulesById: BackendRoutesManifest = {};
        for (const blockModule of blockJson.modules) {
            if (blockModule.metadata.type === BlockModuleTypes.BACKEND_ROUTE) {
                const {id, metadata} = blockModule;
                backendRouteModulesById[blockModule.id] = {id, metadata};
            }
        }
        await fsUtils.writeFileAsync(path.join(backendWrapperSrcDirPath, 'routes.json'), JSON.stringify(backendRouteModulesById, null, 4));

        // Zip everything up.
        const outputPath = path.join(buildArtifactsDirPath, 'backend.zip');
        const zipResult = await this._zipBackendDeploymentPackageAsync(srcDirPath, outputPath);
        if (!zipResult.success) {
            return zipResult;
        }

        return {
            success: true,
            value: outputPath,
        };
    }
    async buildAsync(outputDirPath: string): Promise<BuildResult> {
        if (fs.existsSync(outputDirPath)) {
            return this._buildFailure(`directory already exists at ${outputDirPath}`);
        }

        console.log(`building in ${outputDirPath}`);
        await fsUtils.mkdirPathAsync(outputDirPath);

        // TODO(jb): be smarter about this? (see get_block_dir_path).
        const blockDirPath = process.cwd();

        console.log('reading block json');
        const blockJsonResult = await this._readAndParseBlockJsonAsync(blockDirPath);
        if (!blockJsonResult.success) {
            return blockJsonResult;
        }
        invariant(blockJsonResult.value, 'blockJson.value');
        const blockJson = blockJsonResult.value;

        const srcDirPath = path.join(outputDirPath, 'src');
        await fsUtils.mkdirAsync(srcDirPath);

        const userSrcDirPath = path.join(srcDirPath, 'user');
        await fsUtils.mkdirAsync(userSrcDirPath);

        const buildArtifactsDirPath = path.join(outputDirPath, 'build_artifacts');
        await fsUtils.mkdirAsync(buildArtifactsDirPath);

        console.log('copying package.json and block.json files');
        const packageJsonPath = path.join(blockDirPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            await fsUtils.copyFileAsync(packageJsonPath, path.join(userSrcDirPath, 'package.json'));
        }
        await fsUtils.writeFileAsync(path.join(userSrcDirPath, 'block.json'), JSON.stringify(blockJson, null, 4));

        // Install user packages.
        console.log('installing node modules');
        const yarnInstallResult = await this._yarnInstallAsync(userSrcDirPath);
        if (!yarnInstallResult.success) {
            return yarnInstallResult;
        }

        const userSrcNodeModulesPath = path.join(userSrcDirPath, 'node_modules');
        if (!fs.existsSync(userSrcNodeModulesPath)) {
            return this._buildFailure('No modules installed. react and react-dom are required.');
        }

        // Drop in the stub for the Block SDK.
        console.log('writing block sdk stub');
        const blockSdkDirPath = path.join(userSrcNodeModulesPath, blockCliConfigSettings.SDK_PACKAGE_NAME);
        await fsUtils.mkdirAsync(blockSdkDirPath);
        // We create a stub package so require('airtable-block') works on the frontend and backend.
        // On the frontend, the SDK will be made available on window via the block frame runner.
        // On the backend, the SDK will be made available on global via handleEventAsync.
        await fsUtils.writeFileAsync(
            path.join(blockSdkDirPath, 'index.js'),
            `module.exports = (typeof window !== 'undefined' ? window : global)['${blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`,
        );

        // Transpile the user's source code.
        console.log('transpiling source code');
        const transpileResult = await this._transpileSourceCodeAsync(blockDirPath, userSrcDirPath, blockJson);
        if (!transpileResult.success) {
            return transpileResult;
        }

        // Generate frontend bundle.
        console.log('generating frontend bundle');
        const bundleResult = await this._generateFrontendBundleAsync(blockJson, userSrcDirPath, buildArtifactsDirPath);
        if (!bundleResult.success) {
            return bundleResult;
        }

        // Generate backend bundle.
        if (this._hasBackendCode(blockJson)) {
            const backendWrapperSrcDirPath = path.join(srcDirPath, 'backend_wrapper');
            await fsUtils.mkdirAsync(backendWrapperSrcDirPath);

            console.log('generating backend bundle');
            const backendDeploymentPackageResult = await this._generateBackendDeploymentPackageAsync(
                blockJson,
                srcDirPath,
                backendWrapperSrcDirPath,
                buildArtifactsDirPath,
            );
            if (!backendDeploymentPackageResult.success) {
                return backendDeploymentPackageResult;
            }

            // TODO(richsinn): Upload backendDeploymentPackageResult.value to S3
        }

        return {success: true};
    }
}

module.exports = BlockBuilder;
