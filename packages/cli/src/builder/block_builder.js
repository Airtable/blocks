// @flow
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const invariant = require('invariant');
const {babelAsync, yarnInstallAsync} = require('../helpers/node_modules_command_helpers');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('../block_client_artifacts/generate_block_client_wrapper');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
const {getBlockDirPath} = require('../get_block_dir_path');
const browserify = require('browserify');
const {promisify} = require('util');
const Terser = require('terser');

import type {BlockJson} from '../types/block_json_type';

type BuildStepSuccess<+R> = {|success: true, +value: R|};
type BuildStepFailure = {|success: false, error: Error|};

// TODO(richsinn): consider using the Result algebraic type from hyperbase
type BuildStepResult<+R> = BuildStepSuccess<R> | BuildStepFailure;

type FilePath = string;
type DirectoryPath = string;
type BuildResult = BuildStepResult<{|
    frontendBundlePath: FilePath,
    backendDeploymentPackagePath: FilePath | null,
|}>;

function buildStepSuccess<R>(value: R): BuildStepSuccess<R> {
    return {
        success: true,
        value,
    };
}
function buildStepFailure(message: string): BuildStepFailure {
    return {
        success: false,
        error: new Error(message),
    };
}

class BlockBuilder {
    async _transpileSourceCodeAsync(
        srcDirPath: DirectoryPath,
        outputDirPath: DirectoryPath,
    ): Promise<BuildStepResult<void>> {
        const transpiledTopLevelOutputDirectoryNamesSet = new Set();
        for (const topLevelDirName of Object.values(SupportedTopLevelDirectoryNames)) {
            invariant(typeof topLevelDirName === 'string', 'topLevelDirName should be string');
            const topLevelSrcDirPath = path.join(srcDirPath, topLevelDirName);
            const stats = await fsUtils.statIfExistsAsync(topLevelSrcDirPath);
            if (stats === null || !stats.isDirectory()) {
                // Skip, since this path doesn't exist or isn't a directory.
                continue;
            }
            const topLevelOutputDirPath = path.join(outputDirPath, topLevelDirName);
            const transpileResult = await this._transpileDirectoryAsync(
                topLevelSrcDirPath,
                topLevelOutputDirPath,
            );
            if (!transpileResult.success) {
                return transpileResult;
            }
            transpiledTopLevelOutputDirectoryNamesSet.add(topLevelDirName);
        }

        // Create symlinks in node_modules for our top-level directories. We do this so that you can
        // require files using absolute paths like `frontend/foo`.
        const buildNodeModulesPath = path.join(outputDirPath, 'node_modules');
        for (const topLevelOutputDirName of transpiledTopLevelOutputDirectoryNamesSet) {
            const symlinkPath = path.join(buildNodeModulesPath, topLevelOutputDirName);
            await fsUtils.symlinkAsync(
                path.join(outputDirPath, topLevelOutputDirName),
                symlinkPath,
            );
        }

        return buildStepSuccess();
    }
    async _transpileDirectoryAsync(
        srcDirPath: DirectoryPath,
        outputDirPath: DirectoryPath,
    ): Promise<BuildStepResult<void>> {
        try {
            const presets = ['@babel/preset-env', '@babel/preset-flow', '@babel/preset-react'];
            const plugins = ['@babel/proposal-class-properties'];

            // Use the blocks-cli dir as the cwd so babel can properly find
            // presets/plugins.
            await babelAsync(__dirname, [
                srcDirPath,
                `--out-dir=${outputDirPath}`,
                '--copy-files',
                '--no-babelrc',
                `--presets=${presets.join(',')}`,
                `--plugins=${plugins.join(',')}`,
                '--retain-lines',
                '--minified',
            ]);
        } catch (error) {
            return {success: false, error};
        }
        return buildStepSuccess();
    }
    _getErrorFromYarnInstallStderr(stderr: string): Error | null {
        const errorMessageLines = stderr
            .split('\n')
            .filter(message => message.trim().length > 0 && !message.startsWith('warning '));
        if (errorMessageLines.length > 0) {
            return new Error(errorMessageLines.join('\n'));
        }
        return null;
    }
    async _yarnInstallAsync(dirPath: DirectoryPath): Promise<BuildStepResult<void>> {
        try {
            const {stderr} = await yarnInstallAsync(dirPath, ['--prod', '--non-interactive']);
            const yarnInstallError = this._getErrorFromYarnInstallStderr(stderr.toString());
            if (yarnInstallError) {
                return {success: false, error: yarnInstallError};
            }
        } catch (error) {
            return {success: false, error};
        }
        return buildStepSuccess();
    }
    async _browserifyAsync(entryFilePath: FilePath): Promise<BuildStepResult<Buffer | null>> {
        // Temporarily set the NODE_ENV to production, regardless of the actual NODE_ENV.
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const browserifyInstance = browserify(entryFilePath);
        browserifyInstance.bundleAsync = promisify(
            browserifyInstance.bundle.bind(browserifyInstance),
        );

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
    async _generateFrontendBundleAsync(
        blockJson: BlockJson,
        userSrcDirPath: DirectoryPath,
        buildArtifactsDirPath: DirectoryPath,
    ): Promise<BuildStepResult<FilePath>> {
        // We need to write our client wrapper file.
        // NOTE: it's a bit weird that we write the client wrapper file in the user
        // source code directory. This is necessary since we can't have multiple copies
        // of react and react-dom, which the wrapper code depends on. This way, the client
        // wrapper code and the user source code share the same versions of react and
        // react-dom.
        const clientWrapperFilePath = path.join(userSrcDirPath, 'block_client_wrapper');
        const frontendEntryModulePath = path.join(userSrcDirPath, blockJson.frontendEntry);

        const isDevelopment = false;
        const clientWrapperCode = generateBlockClientWrapperCode(
            frontendEntryModulePath,
            isDevelopment,
        );
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
        const frontendBundlePath = path.join(buildArtifactsDirPath, 'bundle.js');
        await fsUtils.writeFileAsync(frontendBundlePath, minifyResult.value);
        return buildStepSuccess(frontendBundlePath);
    }
    async buildAsync(outputDirPath: DirectoryPath): Promise<BuildResult> {
        if (fs.existsSync(outputDirPath)) {
            return buildStepFailure(`directory already exists at ${outputDirPath}`);
        }

        console.log('reading block json');
        const blockDirPath = getBlockDirPath();
        const blockJsonResult = await parseAndValidateBlockJsonAsync();
        if (blockJsonResult.err) {
            return {success: false, error: blockJsonResult.err};
        }
        invariant(blockJsonResult.value, 'blockJson.value');
        const blockJson = blockJsonResult.value;

        await fsUtils.mkdirPathAsync(outputDirPath);
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
        await fsUtils.writeFileAsync(
            path.join(userSrcDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
            JSON.stringify(blockJson, null, 4),
        );

        // Install user packages.
        console.log('installing node modules');
        const yarnInstallResult = await this._yarnInstallAsync(userSrcDirPath);
        if (!yarnInstallResult.success) {
            return yarnInstallResult;
        }

        const userSrcNodeModulesPath = path.join(userSrcDirPath, 'node_modules');
        if (!fs.existsSync(userSrcNodeModulesPath)) {
            return buildStepFailure('No modules installed. react and react-dom are required.');
        }

        // Transpile the user's source code.
        console.log('transpiling source code');
        const transpileResult = await this._transpileSourceCodeAsync(blockDirPath, userSrcDirPath);
        if (!transpileResult.success) {
            return transpileResult;
        }

        // Generate frontend bundle.
        console.log('generating frontend bundle');
        const bundleResult = await this._generateFrontendBundleAsync(
            blockJson,
            userSrcDirPath,
            buildArtifactsDirPath,
        );
        if (!bundleResult.success) {
            return bundleResult;
        }

        return buildStepSuccess({
            frontendBundlePath: bundleResult.value,
            // Backend blocks not currently supported.
            backendDeploymentPackagePath: null,
        });
    }
}

module.exports = BlockBuilder;
