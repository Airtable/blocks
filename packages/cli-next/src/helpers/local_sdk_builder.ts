import path from 'path';
import os from 'os';
import cpx from 'cpx2';

import {BLOCK_FILE_NAME, SDK_PACKAGE_NAME} from '../settings';
import {
    dangerouslyCrossSpawn,
    dangerouslyCrossSpawnAndReturnTrimmedOutputAsync,
} from './child_process_async';
import {spawnUserError} from './error_utils';

import asyncFs from './fs_async';
import nonAsyncFs from './fs_non_async';
import {BuildErrorInfo, BuildErrorName} from './build_messages';
import {System} from './system';

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
export class LocalSdkBuilder {
    system: System;
    sdkPath: string;
    constructor(system: System, sdkPath: string) {
        this.system = system;
        this.sdkPath = sdkPath;
    }

    async startAsync() {
        const tempPackagePath = await this._createTemporarySdkPackageAsync();
        await this._installLocalSdkAsync(tempPackagePath);
        await asyncFs.unlinkAsync(tempPackagePath);

        await this._buildAndWatchSourceAsync();

        const copySourcePath = path.join(this.sdkPath, 'dist');
        const copyDestPath = path.join(
            await this._getBlockDirPathAsync(),
            'node_modules',
            SDK_PACKAGE_NAME,
            'dist',
        );
        await this._copyAndWatchBuildAsync(copySourcePath, copyDestPath);
    }

    async _getBlockDirPathAsync(): Promise<string> {
        const fileSystemRoot = path.parse(process.cwd()).root;
        let currentDirPath = process.cwd();
        while (currentDirPath !== fileSystemRoot) {
            const currentDirFiles = await asyncFs.readdirAsync(currentDirPath);
            if (currentDirFiles.includes(BLOCK_FILE_NAME)) {
                return currentDirPath;
            }
            currentDirPath = path.dirname(currentDirPath);
        }
        throw spawnUserError<BuildErrorInfo>({
            type: BuildErrorName.BUILD_BLOCK_DIRECTORY_NOT_FOUND,
        });
    }

    async _createTemporarySdkPackageAsync(): Promise<string> {
        const sdkPackageJsonPath = path.join(this.sdkPath, 'package.json');
        const backupSdkPackageJsonPath = `${sdkPackageJsonPath}.backup`;
        const initialPackageJsonString = await asyncFs.readFileAsync(sdkPackageJsonPath, 'utf-8');

        await asyncFs.writeFileAsync(backupSdkPackageJsonPath, initialPackageJsonString, 'utf-8');

        let packedPackagePath;
        try {
            const initialPackageJson = JSON.parse(initialPackageJsonString);

            const tempPackageJson = {
                ...initialPackageJson,
                version: `${initialPackageJson.version}-local.${Date.now()}`,
            };
            await asyncFs.writeFileAsync(
                sdkPackageJsonPath,
                JSON.stringify(tempPackageJson),
                'utf-8',
            );

            const linesTrimmed = await dangerouslyCrossSpawnAndReturnTrimmedOutputAsync(
                this.system,
                'npm',
                ['pack', '--quiet'],
                {
                    cwd: this.sdkPath,
                },
            );
            const lines = linesTrimmed.split('\n');
            const originalPackedPackagePath = path.join(this.sdkPath, lines[lines.length - 1]);

            packedPackagePath = path.join(
                os.tmpdir(),
                `${Date.now()}-${path.basename(originalPackedPackagePath)}`,
            );
            await asyncFs.renameAsync(originalPackedPackagePath, packedPackagePath);
        } finally {
            await asyncFs.writeFileAsync(sdkPackageJsonPath, initialPackageJsonString, 'utf-8');
            await asyncFs.unlinkAsync(backupSdkPackageJsonPath);
        }

        return packedPackagePath;
    }

    async _installLocalSdkAsync(packagePath: string): Promise<void> {
        const blockDir = await this._getBlockDirPathAsync();
        const packageJsonPath = path.join(blockDir, 'package.json');
        const backupPackageJsonPath = `${packageJsonPath}.backup`;
        const shouldUseYarn = nonAsyncFs.existsSync(path.join(blockDir, 'yarn.lock'));

        await asyncFs.copyFileAsync(packageJsonPath, backupPackageJsonPath);

        try {
            await dangerouslyCrossSpawnAndReturnTrimmedOutputAsync(
                this.system,
                shouldUseYarn ? 'yarn' : 'npm',
                shouldUseYarn
                    ? ['add', `${SDK_PACKAGE_NAME}@${packagePath}`, '--non-interactive']
                    : ['install', `${SDK_PACKAGE_NAME}@${packagePath}`],
                {
                    cwd: await this._getBlockDirPathAsync(),
                },
            );
        } finally {
            await asyncFs.unlinkAsync(packageJsonPath);
            await asyncFs.renameAsync(backupPackageJsonPath, packageJsonPath);
        }
    }

    async _buildAndWatchSourceAsync(): Promise<void> {
        const child = dangerouslyCrossSpawn(this.system, 'npm', ['run', 'watch'], {
            cwd: this.sdkPath,
        });

        return new Promise((resolve, reject) => {
            child.on('error', reject);
            child.on('exit', reject);
            child.stdout.on('data', chunk => {
                if (chunk.toString('utf-8').includes('Successfully compiled')) {
                    resolve();
                }
            });
        });
    }

    async _copyAndWatchBuildAsync(sourcePath: string, destPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const copier = cpx.watch(path.join(sourcePath, '**', '*'), destPath);
            copier.on('watch-ready', () => resolve());
            copier.on('watch-error', reject);
        });
    }
}
