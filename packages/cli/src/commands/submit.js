// @flow
import ApiClient from '../api_client';
import parseAndValidateRemoteJsonAsync from '../helpers/parse_and_validate_remote_json_async';
import parseBlockPackageJsonAsync from '../helpers/parse_block_package_json_async';
import type {Argv} from 'yargs';
import request from 'postman-request';
import util from 'util';
import invariant from 'invariant';
import archiver from 'archiver';
import fs from 'fs';
import fsUtils from '../helpers/fs_utils';
import path from 'path';
import {getBlockDirPath} from '../helpers/get_block_dir_path';
import {BUILD_DIR} from '../config/block_cli_config_settings';
import {exitWithError} from '../helpers/cli_helpers';

const requestAsync = util.promisify(request);
const readFileAsync = util.promisify(fs.readFile);

export async function runCommandAsync(argv: Argv): Promise<void> {
    const remoteName = argv.remote || null;
    invariant(
        remoteName === null || typeof remoteName === 'string',
        'expects remoteName to be null or a string',
    );
    const parseRemoteResult = await parseAndValidateRemoteJsonAsync(remoteName);
    if (parseRemoteResult.err) {
        throw parseRemoteResult.err;
    }
    const remoteJson = parseRemoteResult.value;

    const parseBlockPackageJsonResult = await parseBlockPackageJsonAsync();
    if (parseBlockPackageJsonResult.err) {
        throw parseBlockPackageJsonResult.err;
    }
    const blockPackageJson = parseBlockPackageJsonResult.value;

    const apiClient = await ApiClient.constructApiClientForRemoteAsync(
        remoteJson,
        blockPackageJson,
    );

    const blockDirPath = getBlockDirPath();
    const outputDir = path.join(blockDirPath, BUILD_DIR);
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(outputDir);
    const outputPath = path.join(outputDir, 'block_source.zip');

    const zip = archiver('zip');

    // eslint-disable-next-line no-console
    console.log('Packaging your block...');

    // zip the block (excluding build, .git, and node_modules) and put it into the build artifacts folder
    try {
        await new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            output.on('close', resolve);
            zip.on('error', err => {
                throw err;
            });
            zip.pipe(output);
            zip.glob('**', {
                cwd: blockDirPath,
                ignore: ['**/node_modules/**', 'build/**', '**/.git/**'],
            });
            zip.finalize();
        });
    } catch (err) {
        exitWithError('Error packaging source code.', err);
    }

    const {presignedUploadUrl, codeUploadId} = await apiClient.createCodeUploadAsync();
    // eslint-disable-next-line no-console
    console.log('Uploading your block...');

    const zipFile = await readFileAsync(outputPath);
    const response = await requestAsync({
        method: 'PUT',
        url: presignedUploadUrl,
        body: zipFile,
    });

    const didUpload = response.statusCode === 200;
    const status = didUpload ? 'uploaded' : 'failed';
    const {message} = await apiClient.finalizeCodeUploadAsync({codeUploadId, status});
    if (!didUpload) {
        exitWithError(message);
    }
    // eslint-disable-next-line no-console
    console.log(message);
}
