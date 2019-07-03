// @flow
/* eslint-disable no-console */
const BlockBuilder = require('../builder/block_builder');
const APIClient = require('../api_client');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const fsUtils = require('../fs_utils');
const path = require('path');
const os = require('os');
const invariant = require('invariant');
const request = require('request');
const {promisify} = require('util');
request.putAsync = promisify(request.put);

import type {Argv} from 'yargs';

type BuildId = string;
type DeployId = string;

function _getOutputDirPath(): string {
    const timestampString = new Date().getTime().toString();
    return path.join(os.tmpdir(), 'build', timestampString);
}

async function _generateBuildArtifactsAsync(): Promise<{|
    frontendBundlePath: string,
    backendDeploymentPackagePath: string | null,
|}> {
    const blockBuilder = new BlockBuilder();
    const outputDirPath = _getOutputDirPath();
    const buildResult = await blockBuilder.buildAsync(outputDirPath);
    if (!buildResult.success) {
        throw buildResult.error;
    }
    return buildResult.value;
}

async function _uploadFrontendBundleAsync(
    frontendBundlePath: string,
    frontendBundleUploadUrl: string,
): Promise<void> {
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

async function setTimeoutAsync(timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => setTimeout(resolve, timeoutMs));
}

async function _createDeployAndWaitUntilCompletionAsync(
    apiClient: APIClient,
    buildId: BuildId,
): Promise<DeployId> {
    console.log('deploying backend');
    const {deployId} = await apiClient.createDeployAsync(buildId);

    while (true) {
        // eslint-disable-line no-constant-condition
        const {status} = await apiClient.getDeployStatusAsync(deployId);
        if (status === 'success') {
            console.log('successfully deployed backend');
            break;
        } else if (status !== 'deploying') {
            throw new Error('Backend deploy did not finish successfully');
        }

        // Wait a bit before trying again.
        await setTimeoutAsync(500);
    }

    return deployId;
}

async function _uploadBackendDeploymentPackageAsync(
    backendDeploymentPackagePath: string,
    backendDeploymentPackageUploadUrl: string,
): Promise<void> {
    const backendDeploymentPackage = await fsUtils.readFileAsync(backendDeploymentPackagePath);
    const response = await request.putAsync({
        url: backendDeploymentPackageUploadUrl,
        body: backendDeploymentPackage,
        headers: {'x-amz-server-side-encryption': 'AES256'},
    });
    if (response.statusCode !== 200 && response.statusCode !== 204) {
        throw new Error('Failed to upload backend deployment package');
    }
}

async function _buildAndDeployAsync(
    apiClient: APIClient,
): Promise<{|buildId: BuildId, deployId: DeployId | null|}> {
    const {frontendBundlePath, backendDeploymentPackagePath} = await _generateBuildArtifactsAsync();

    const hasBackend = !!backendDeploymentPackagePath;
    const {
        buildId,
        frontendBundleUploadUrl,
        backendDeploymentPackageUploadUrl,
    } = await apiClient.startBuildAsync(hasBackend);

    try {
        console.log('uploading build artifacts');
        await _uploadFrontendBundleAsync(frontendBundlePath, frontendBundleUploadUrl);

        if (hasBackend) {
            invariant(backendDeploymentPackagePath, 'backendDeploymentPackagePath');
            invariant(backendDeploymentPackageUploadUrl, 'backendDeploymentPackageUploadUrl');
            await _uploadBackendDeploymentPackageAsync(
                backendDeploymentPackagePath,
                backendDeploymentPackageUploadUrl,
            );
        }
    } catch (err) {
        console.log('failed to upload build artifacts', err);
        await apiClient.failBuildAsync(buildId);
        throw err;
    }
    await apiClient.succeedBuildAsync(buildId);

    let deployId;
    if (hasBackend) {
        deployId = await _createDeployAndWaitUntilCompletionAsync(apiClient, buildId);
    } else {
        deployId = null;
    }

    return {buildId, deployId};
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const blockJsonValidationResult = await parseAndValidateBlockJsonAsync();
    if (blockJsonValidationResult.err) {
        throw blockJsonValidationResult.err;
    }

    const remoteName = argv.remote || null;
    invariant(
        remoteName === null || typeof remoteName === 'string',
        'expects remoteName to be null or a string',
    );
    const apiClientResult = await APIClient.constructAPIClientForRemoteAsync(remoteName);
    if (apiClientResult.err) {
        throw apiClientResult.err;
    }
    const apiClient = apiClientResult.value;

    console.log('building');
    const {buildId, deployId} = await _buildAndDeployAsync(apiClient);

    console.log('releasing');
    await apiClient.createReleaseAsync(buildId, deployId);

    console.log('successfully released block!');
}

module.exports = {runCommandAsync};
