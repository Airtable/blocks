// @flow
/* eslint-disable no-console */
const BlockBuilder = require('../builder/block_builder');
const getBlockDirPath = require('../get_block_dir_path');
const getApiKeySync = require('../get_api_key_sync');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('../api_client');
const fsUtils = require('../fs_utils');
const fs = require('fs');
const path = require('path');
const os = require('os');
const request = require('request');
const {promisify} = require('util');
request.putAsync = promisify(request.put);

import type {Argv} from 'yargs';

type BuildId = string;

function _getApiClient(): APIClient {
    const blockDirPath = getBlockDirPath();
    const blockFileDataJson = fs.readFileSync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
        'utf8'
    );
    const blockFileData = JSON.parse(blockFileDataJson);
    const apiKey = getApiKeySync(blockDirPath);
    const apiClient = new APIClient({
        environment: blockFileData.environment,
        applicationId: blockFileData.applicationId,
        blockId: blockFileData.blockId,
        apiKey,
    });
    return apiClient;
}

function _getOutputDirPath(): string {
    const timestampString = new Date().getTime().toString();
    return path.join(os.tmpdir(), 'build', timestampString);
}

async function _generateBuildArtifactsAsync(): Promise<{|frontendBundlePath: string, backendDeploymentPackagePath: string | null|}> {
    const blockBuilder = new BlockBuilder();
    const outputDirPath = _getOutputDirPath();
    const buildResult = await blockBuilder.buildAsync(outputDirPath);
    if (!buildResult.success) {
        throw buildResult.error;
    }
    return buildResult.value;
}

async function _uploadFrontendBundleAsync(frontendBundlePath: string, frontendBundleUploadUrl: string): Promise<void> {
    const bundle = await fsUtils.readFileAsync(frontendBundlePath);
    const response = await request.putAsync({
        url: frontendBundleUploadUrl,
        body: bundle,
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=31536000,immutable',
            'x-amz-server-side-encryption': 'AES256',
        },
    });
    if (response.statusCode !== 200 && response.statusCode !== 204) {
        throw new Error('Failed to upload frontend bundle');
    }
}

async function _buildAsync(apiClient: APIClient): Promise<BuildId> {
    const {frontendBundlePath, backendDeploymentPackagePath} = await _generateBuildArtifactsAsync();

    const hasBackend = !!backendDeploymentPackagePath;
    const {buildId, frontendBundleUploadUrl} = await apiClient.startBuildAsync(hasBackend);

    try {
        console.log('uploading build artifacts');
        await _uploadFrontendBundleAsync(frontendBundlePath, frontendBundleUploadUrl);
    } catch (err) {
        console.log('failed to upload build artifacts', err);
        await apiClient.failBuildAsync(buildId);
        throw err;
    }
    await apiClient.succeedBuildAsync(buildId);

    return buildId;
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const apiClient = _getApiClient();

    console.log('building');
    const buildId = await _buildAsync(apiClient);

    console.log('releasing');
    await apiClient.createReleaseAsync(buildId);

    console.log('successfully released block!');
}

module.exports = {runCommandAsync};
