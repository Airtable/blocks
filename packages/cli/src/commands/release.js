// @flow
/* eslint-disable no-console */
const _ = require('lodash');
const BlockBuilder = require('../builder/block_builder');
const ApiClient = require('../api_client');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const fsUtils = require('../helpers/fs_utils');
const invariant = require('invariant');
const request = require('postman-request');
const FormData = require('form-data');
const {promisify} = require('util');
request.postAsync = promisify(request.post);
request.putAsync = promisify(request.put);

import type {Argv} from 'yargs';
import type {S3UploadInfo} from '../types/s3_upload_info';

type BuildId = string;
type DeployId = string;

async function _uploadViaSignedPostAsync(
    filePath: string,
    uploadInfo: S3UploadInfo,
): Promise<void> {
    // We always expect `key` to be in the info object; the server should never
    // send upload info without a specific key.
    invariant(uploadInfo.key, 'uploadInfo.key');

    const data = await fsUtils.readFileAsync(filePath);

    // S3 demands that the 'file' field be last in the form data, since it will
    // ignore any options following it. To make sure this always happens, we
    // generate the form data manually here instead of letting request do it.
    const formData = new FormData();
    formData.append('key', uploadInfo.key);
    for (const [key, value] of _.entries(uploadInfo.params)) {
        formData.append(key, value);
    }
    formData.append('file', data);

    const formLength = formData.getLengthSync();
    const headers = {
        'Cache-Control': 'max-age=31536000,immutable',
        'Content-Length': formLength,
        'x-amz-server-side-encryption': 'AES256',
        ...formData.getHeaders(),
    };
    const body = formData.getBuffer();

    const response = await request.postAsync({url: uploadInfo.endpointUrl, headers, body});

    // It's reasonable for AWS to respond with 200 (OK), 201 (Created) or 202
    // (Accepted), so treat all of those as successes even though we usually
    // explicitly request 201 through the success_action_status field.
    if (response.statusCode !== 200 && response.statusCode !== 201 && response.statusCode !== 202) {
        // The 'EntityTooLarge' error code indicates the proposed upload will
        // exceed the maximum allowed object size.
        // See https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html#ErrorCodeList
        let errorMessage;
        if (response.statusCode === 400 && response.body.includes('EntityTooLarge')) {
            errorMessage = 'Bundle size is too big:';
        } else {
            errorMessage = 'Failed to upload';
        }

        throw new Error(`${errorMessage} ${filePath}`);
    }
}

async function setTimeoutAsync(timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => setTimeout(resolve, timeoutMs));
}

async function _createDeployAndWaitUntilCompletionAsync(
    apiClient: ApiClient,
    buildId: BuildId,
): Promise<DeployId> {
    console.log('deploying backend');
    const {deployId} = await apiClient.createDeployAsync(buildId);

    // eslint-disable-next-line no-constant-condition
    while (true) {
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

async function _buildAndDeployAsync(
    apiClient: ApiClient,
    blockBuilder: BlockBuilder,
): Promise<{|buildId: BuildId, deployId: DeployId | null|}> {
    const buildResult = await blockBuilder.buildForReleaseAsync();
    if (buildResult.err) {
        throw new Error('Failed to build the block code!');
    }
    const {frontendBundlePath, backendDeploymentPackagePath} = buildResult.value;

    const hasBackend = !!backendDeploymentPackagePath;
    const {
        buildId,
        frontendBundleS3UploadInfo,
        backendDeploymentPackageS3UploadInfo,
    } = await apiClient.startBuildAsync(hasBackend);

    try {
        console.log('uploading build artifacts');
        await _uploadViaSignedPostAsync(frontendBundlePath, frontendBundleS3UploadInfo);

        if (hasBackend) {
            invariant(backendDeploymentPackagePath, 'backendDeploymentPackagePath');
            invariant(backendDeploymentPackageS3UploadInfo, 'backendDeploymentPackageS3UploadInfo');
            await _uploadViaSignedPostAsync(
                backendDeploymentPackagePath,
                backendDeploymentPackageS3UploadInfo,
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
    const blockJson = blockJsonValidationResult.value;

    const remoteName = argv.remote || null;
    invariant(
        remoteName === null || typeof remoteName === 'string',
        'expects remoteName to be null or a string',
    );
    const enableDeprecatedAbsolutePathImport = argv.enableDeprecatedAbsolutePathImport || false;
    invariant(
        typeof enableDeprecatedAbsolutePathImport === 'boolean',
        'expects enableDeprecatedAbsolutePathImport to be a boolean',
    );
    const enableIsolatedBuild = !(argv.disableIsolatedBuild || false);
    const apiClientResult = await ApiClient.constructApiClientForRemoteAsync(remoteName);
    if (apiClientResult.err) {
        throw apiClientResult.err;
    }
    const apiClient = apiClientResult.value;

    const backendSdkBaseUrl = argv.backendSdkBaseUrl || null;
    invariant(
        backendSdkBaseUrl === null || typeof backendSdkBaseUrl === 'string',
        'expects backendSdkBaseUrl to be null or a string',
    );

    const blockBuilder = await BlockBuilder.createReleaseBlockBuilderAsync({
        blockJson,
        enableDeprecatedAbsolutePathImport,
        enableIsolatedBuild,
        backendSdkBaseUrl,
    });

    try {
        console.log('building');
        const {buildId, deployId} = await _buildAndDeployAsync(apiClient, blockBuilder);

        console.log('releasing');
        await apiClient.createReleaseAsync(buildId, deployId);
    } catch (err) {
        throw err;
    } finally {
        await blockBuilder.wipeBaseOutputBuildDirAsync();
    }

    console.log('✅ successfully released block!');
}

module.exports = {runCommandAsync};
