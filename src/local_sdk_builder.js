// @flow
/* eslint-disable no-console */
const path = require('path');
const npmPackageArg = require('npm-package-arg');
const chalk = require('chalk');
const cpx = require('cpx');
const fsUtils = require('./fs_utils');
const getBlockDirPath = require('./get_block_dir_path');
const {exitWithError} = require('./helpers/cli_helpers');
const {spawn, execFileAsync} = require('./helpers/child_process_helpers');

const SDK_PACKAGE_NAME = '@airtable/blocks';

function warnNonLiveDirectorySdk(installedPath) {
    const message = [
        `${SDK_PACKAGE_NAME} is currently installed from the local directory ${installedPath}.`,
        "Since you didn't specify --sdk-repo, changes made in this directory won't automatically update your block.",
        `Consider either switching back to the distributed version of this package with 'yarn add ${SDK_PACKAGE_NAME}',`,
        `or enable local SDK development mode by passing --sdk-repo=${installedPath} to this command.`,
        '',
    ].join('\n');

    console.warn(chalk.yellow(message));
}

/**
 * LocalSdkBuilder enables the same automatic reload development experience we have for blocks for
 * the SDK. It works by:
 *   - Installing a local copy of the SDK (this makes sure that all the other npm dependencies are)
 *     in the right place
 *   - Starting the SDK's own development builder
 *   - Keeping node_modules/@airtable/blocks/dist in sync with the local SDK's dist folder so
 *     that changes there trigger normal bundle rebuilds
 *
 * Often, symlinking the package (e.g. yarn link) is enough to get this sort of workflow. We can't
 * use that here though, as node's (and subsequently browserify's) module resolution means that the
 * SDK won't be able to resolve the right version of packages that would usually be hoisted or peer
 * dependencies, like React.
 */
class LocalSdkBuilder {
    static async startIfNeededAsync(sdkPath: string | null): Promise<LocalSdkBuilder | null> {
        const sdkPackageVersionSpecifier = await LocalSdkBuilder._getInstalledSdkPackageVersionSpecifierAsync();

        if (sdkPackageVersionSpecifier) {
            if (sdkPath === null) {
                if (sdkPackageVersionSpecifier.type === 'directory') {
                    warnNonLiveDirectorySdk(sdkPackageVersionSpecifier.fetchSpec);
                }
            } else {
                const localSdkBuilder = new LocalSdkBuilder(sdkPath);
                await localSdkBuilder.startAsync();
                return localSdkBuilder;
            }
        } else if (sdkPath !== null) {
            exitWithError(
                `Cannot use local SDK (--sdk-repo) without ${SDK_PACKAGE_NAME} installed. Install it with 'yarn add ${SDK_PACKAGE_NAME}'`,
            );
        }

        return null;
    }

    static async _getInstalledSdkPackageVersionSpecifierAsync() {
        const blockDirPath = getBlockDirPath();
        const blockPackageJsonPath = path.join(blockDirPath, 'package.json');
        const blockPackageJson = JSON.parse(
            await fsUtils.readFileAsync(blockPackageJsonPath, 'utf-8'),
        );

        const sdkPackageVersionString = blockPackageJson.dependencies[SDK_PACKAGE_NAME];
        if (!sdkPackageVersionString) {
            return null;
        }

        return npmPackageArg.resolve(SDK_PACKAGE_NAME, sdkPackageVersionString, blockDirPath);
    }

    sdkPath: string;
    constructor(sdkPath: string) {
        this.sdkPath = path.resolve(sdkPath);
    }

    async startAsync(): Promise<void> {
        console.log(`Installing local SDK from ${this.sdkPath}...`);
        const tempPackagePath = await this._createTemporarySdkPackageAsync();
        await this._installLocalSdkAsync(tempPackagePath);
        await fsUtils.unlinkAsync(tempPackagePath);

        console.log(`Building local SDK in ${this.sdkPath}...`);
        await this._buildAndWatchSourceAsync();

        const copySourcePath = path.join(this.sdkPath, 'dist');
        const copyDestPath = path.join(getBlockDirPath(), 'node_modules', SDK_PACKAGE_NAME, 'dist');
        console.log(`Copying local SDK build from ${copySourcePath} to ${copyDestPath}`);
        await this._copyAndWatchBuildAsync(copySourcePath, copyDestPath);
    }

    async _createTemporarySdkPackageAsync(): Promise<string> {
        // temporarily rewrite package.json to get a unique version. without this, we might corrupt
        // yarn's cache by having two distinct tarballs at the same version
        const sdkPackageJsonPath = path.join(this.sdkPath, 'package.json');
        const initialPackageJsonString = await fsUtils.readFileAsync(sdkPackageJsonPath, 'utf-8');
        const initialPackageJson = JSON.parse(initialPackageJsonString);

        const tempPackageJson = {
            ...initialPackageJson,
            version: `${initialPackageJson.version}-local.${Date.now()}`,
        };
        await fsUtils.writeFileAsync(sdkPackageJsonPath, JSON.stringify(tempPackageJson), 'utf-8');

        const {stdout} = await execFileAsync('npm', ['pack', '--quiet'], {
            cwd: this.sdkPath,
            prefix: 'npm pack',
        });

        // now that we've packed everything, rewrite package.json back to the original
        await fsUtils.writeFileAsync(sdkPackageJsonPath, initialPackageJsonString, 'utf-8');
        
        // npm pack prints the location of the package to stdout before exiting
        const lines = stdout.trim().split('\n');
        const packedPackagePath = lines[lines.length - 1];

        return path.join(this.sdkPath, packedPackagePath);
    }

    async _installLocalSdkAsync(packagePath: string): Promise<void> {
        const blockDir = getBlockDirPath();
        const shouldUseYarn = await fsUtils.existsAsync(path.join(blockDir, 'yarn.lock'));

        await execFileAsync(
            shouldUseYarn ? 'yarn' : 'npm',
            shouldUseYarn
                ? ['add', `${SDK_PACKAGE_NAME}@${packagePath}`, '--non-interactive']
                : ['install', `${SDK_PACKAGE_NAME}@${packagePath}`],
            {
                prefix: shouldUseYarn ? 'yarn add' : 'npm install',
                cwd: getBlockDirPath(),
            },
        );
    }

    _buildAndWatchSourceAsync(): Promise<void> {
        return new Promise(resolve => {
            const sdkBuildProcess = spawn('npm', ['run', 'watch'], {
                prefix: SDK_PACKAGE_NAME,
                cwd: this.sdkPath,
            });

            sdkBuildProcess.on('error', err => exitWithError("Couldn't start SDK builder", err));
            sdkBuildProcess.on('exit', () =>
                exitWithError(`'npm run:watch' for ${SDK_PACKAGE_NAME} exited unexpectedly`),
            );

            sdkBuildProcess.stdout.on('data', chunk => {
                // TODO: find a more reliable way of detecting compile completion.
                if (chunk.toString('utf-8').includes('Successfully compiled')) {
                    resolve();
                }
            });
        });
    }

    _copyAndWatchBuildAsync(sourcePath: string, destPath: string): Promise<void> {
        return new Promise(resolve => {
            const copier = cpx.watch(path.join(sourcePath, '**', '*'), destPath);
            copier.on('watch-ready', () => resolve());
            copier.on('watch-error', err =>
                exitWithError(`Error copying ${SDK_PACKAGE_NAME} build`, err),
            );
        });
    }
}

module.exports = LocalSdkBuilder;
