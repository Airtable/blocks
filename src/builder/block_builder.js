// @flow
const path = require('path');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const invariant = require('invariant');
const {exec} = require('child_process');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('../generate_block_client_wrapper');
const generateBlockBabelConfig = require('../generate_block_babel_config');
const BlockModuleTypes = require('../types/block_module_types');
const babel = require('@babel/core');
const browserify = require('browserify');
const promisify = require('es6-promisify');
const Terser = require('terser');

import type {BlockFile} from '../types/block_file_type';
import type {BlockModuleType, BlockModuleWithoutCode} from '../types/block_module_types';

const execAsync = (cmd: string) => new Promise((resolve, reject) => {
    const eventEmitter = exec(cmd, (err, stdout, stderr) => {
        if (err) {
            reject(err);
        } else {
            resolve({stdout, stderr});
        }
    });
    // Pipe the child process's stdout and stderr to this process's stdout and stderr.
    eventEmitter.stdout.pipe(process.stdout);
    eventEmitter.stderr.pipe(process.stderr);
});

const BlockModuleDirectoryNamesByType = Object.freeze({
    [BlockModuleTypes.FRONTEND]: ('frontend': 'frontend'),
    [BlockModuleTypes.SHARED]: ('shared': 'shared'),
    [BlockModuleTypes.BACKEND_ROUTE]: ('routes': 'routes'),
});

type BuildSuccess = {success: true};
type BuildFailure = {success: false, error: Error};

type BuildResult = BuildSuccess | BuildFailure;

// TODO(richsinn): consider using the Result algebraic type from hyperbase
type BuildStepResult<+R> = (
    {|success: true, +value: R|} |
    BuildFailure
);
const BUILD_STEP_RESULT_OK = Object.freeze({success: true, value: undefined});

type BlockJson = BlockFile;

class BlockBuilder {
    _buildFailure(message: string): BuildFailure {
        return {
            success: false,
            error: new Error(message),
        };
    }
    async _readAndParseBlockJson(blockDirPath: string): Promise<BuildStepResult<BlockJson>> {
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
            modulesByType.set(type, modules.concat());
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
            const {stderr} = await execAsync(`cd ${dirPath}; ${yarnPath} --prod --non-interactive; cd ${currPath}`);
            const yarnInstallError = this._getErrorFromYarnInstallStderr(stderr);
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
    async buildAsync(outputDirPath: string): Promise<BuildResult> {
        if (fs.existsSync(outputDirPath)) {
            return this._buildFailure(`directory already exists at ${outputDirPath}`);
        }

        console.log(`building in ${outputDirPath}`);
        await fsUtils.mkdirPathAsync(outputDirPath);

        // TODO(jb): be smarter about this? (see get_block_dir_path).
        const blockDirPath = process.cwd();

        console.log('reading block json');
        const blockJsonResult = await this._readAndParseBlockJson(blockDirPath);
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
            fsUtils.copyFileAsync(packageJsonPath, path.join(userSrcDirPath, 'package.json'));
        }
        fsUtils.writeFileAsync(path.join(userSrcDirPath, 'block.json'), JSON.stringify(blockJson, null, 4));

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

        return {success: true};
    }
}

module.exports = BlockBuilder;
