// @flow
/* eslint-disable no-console */
import {getGitHashAsync} from '../helpers/get_git_hash';

const _ = require('lodash');
const BlockBuilder = require('../builder/block_builder');
const ApiClient = require('../api_client');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const parseBlockPackageJsonAsync = require('../helpers/parse_block_package_json_async');
const parseAndValidateRemoteJsonAsync = require('../helpers/parse_and_validate_remote_json_async');
const fsUtils = require('../helpers/fs_utils');
const invariant = require('invariant');
const request = require('postman-request');
const SentryCli = require('@sentry/cli');
const FormData = require('form-data');
const {promisify} = require('util');
request.postAsync = promisify(request.post);
const outputRemotesBetaWarning = require('../helpers/output_remotes_beta_warning');

import type {Argv} from 'yargs';
import type {S3UploadInfo} from '../types/s3_upload_info';
import {getBlockDirPath} from '../helpers/get_block_dir_path';
import type {RemoteJson} from '../types/remote_json_type';
import {V2_BLOCKS_BASE_ID} from '../config/block_cli_config_settings';
import inquirer from 'inquirer';
import path from 'path';

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

async function _uploadSourceMapToSentryAsync(
    // Path to .js
    frontendBundlePath: string,
    // Path to .js.map
    frontendBundleSourceMapPath: string,
    // This is path in S3, not API key. (Currently this function strip filename and use only directory portion.)
    s3BundleKey: string,
    gitHash: string,
    bundleCdn: string,
): Promise<void> {
    const authToken = process.env.BLOCKS_CLI_SENTRY_AUTH_TOKEN;
    const org = process.env.BLOCKS_CLI_SENTRY_ORG;
    const project = process.env.BLOCKS_CLI_SENTRY_PROJECT;
    invariant(
        typeof authToken === 'string',
        'expected BLOCKS_CLI_SENTRY_AUTH_TOKEN env variable to be string. See go/blocks-cli-sentry for more details.',
    );
    invariant(
        typeof org === 'string',
        'expected BLOCKS_CLI_SENTRY_ORG env variable to be string. See go/blocks-cli-sentry for more details.',
    );
    invariant(
        typeof project === 'string',
        'expected BLOCKS_CLI_SENTRY_PROJECT env variable to be string. See go/blocks-cli-sentry for more details.',
    );
    const sentryClient = new SentryCli(null, {authToken, org, project, dist: gitHash});
    await sentryClient.releases.uploadSourceMaps(gitHash, {
        include: [frontendBundlePath, frontendBundleSourceMapPath],
        urlPrefix: `${bundleCdn}/${path.dirname(s3BundleKey)}`,
        validate: true,
    });
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
    originalRemoteJson: RemoteJson | null,
    isV2Block: boolean,
): Promise<{|
    buildId: BuildId,
    deployId: DeployId | null,
    frontendBundlePath: string,
    frontendBundleSourceMapPath: string | null,
    s3BundleKey: string | null,
|}> {
    const buildResult = await blockBuilder.buildForReleaseAsync();
    if (buildResult.err) {
        throw new Error(`${buildResult.err.message}
Failed to build the block code!`);
    }
    const {
        frontendBundlePath,
        frontendBundleSourceMapPath,
        backendDeploymentPackagePath,
    } = buildResult.value;

    const hasBackend = !!backendDeploymentPackagePath;
    let buildId, frontendBundleS3UploadInfo, backendDeploymentPackageS3UploadInfo;
    if (isV2Block) {
        if (hasBackend) {
            throw new Error('V2 blocks cannot have backends');
        }
        ({buildId, frontendBundleS3UploadInfo} = await apiClient.startV2BuildAsync());
    } else {
        ({
            buildId,
            frontendBundleS3UploadInfo,
            backendDeploymentPackageS3UploadInfo,
        } = await apiClient.startBuildAsync(hasBackend, originalRemoteJson));
    }

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
        // We don't update status for v2 blocks, we just make sure to not create a release if the upload failed.
        if (!isV2Block) {
            await apiClient.failBuildAsync(buildId);
        }
        throw err;
    }
    if (!isV2Block) {
        await apiClient.succeedBuildAsync(buildId);
    }

    let deployId;
    if (hasBackend) {
        deployId = await _createDeployAndWaitUntilCompletionAsync(apiClient, buildId);
    } else {
        deployId = null;
    }

    return {
        buildId,
        deployId,
        frontendBundlePath,
        frontendBundleSourceMapPath,
        s3BundleKey: frontendBundleS3UploadInfo.key,
    };
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

    if (remoteName !== null) {
        outputRemotesBetaWarning();
    }
    const uploadSourceMapsToSentry = argv.uploadSourceMapsToSentry || false;
    invariant(
        typeof uploadSourceMapsToSentry === 'boolean',
        'expects uploadSourceMapsToSentry to be a boolean',
    );

    const parseRemoteResult = await parseAndValidateRemoteJsonAsync(remoteName);
    if (parseRemoteResult.err) {
        throw parseRemoteResult.err;
    }
    const remoteJson = parseRemoteResult.value;
    const isV2Block = remoteJson.baseId === V2_BLOCKS_BASE_ID;
    let developerComment = argv.comment;
    if (isV2Block) {
        if (typeof developerComment !== 'string' || developerComment.length === 0) {
            ({developerComment} = await inquirer.prompt({
                name: 'developerComment',
                message: 'Enter a comment describing the changes in this release:',
            }));
            invariant(developerComment.length > 0, 'comment is required to be non-empty');
        }
    }

    const parseBlockPackageJsonResult = await parseBlockPackageJsonAsync();
    if (parseBlockPackageJsonResult.err) {
        throw parseBlockPackageJsonResult.err;
    }
    const blockPackageJson = parseBlockPackageJsonResult.value;

    const apiClient = await ApiClient.constructApiClientForRemoteAsync(
        remoteJson,
        blockPackageJson,
    );

    const backendSdkBaseUrl = argv.backendSdkBaseUrl || null;
    invariant(
        backendSdkBaseUrl === null || typeof backendSdkBaseUrl === 'string',
        'expects backendSdkBaseUrl to be null or a string',
    );

    const blockBuilder = await BlockBuilder.createReleaseBlockBuilderAsync({
        blockJson,
        remoteJson,
        enableDeprecatedAbsolutePathImport,
        enableIsolatedBuild,
        backendSdkBaseUrl,
        uploadSourceMapsToSentry,
    });

    // Also parse the original remote json in order to log metrics
    let originalRemoteJson = null;
    if (remoteName !== null) {
        const parseOriginalRemoteResult = await parseAndValidateRemoteJsonAsync(null);
        // keeping the original remote file isn't required, so we treat this case as the current block being the original
        if (parseOriginalRemoteResult.err) {
            originalRemoteJson = remoteJson;
        } else {
            originalRemoteJson = parseOriginalRemoteResult.value;
        }
    }

    try {
        console.log('building');
        const {
            buildId,
            deployId,
            frontendBundlePath,
            frontendBundleSourceMapPath,
            s3BundleKey,
        } = await _buildAndDeployAsync(apiClient, blockBuilder, originalRemoteJson, isV2Block);

        if (uploadSourceMapsToSentry) {
            const gitHash = await getGitHashAsync(getBlockDirPath());
            const bundleCdn = remoteJson.bundleCdn;
            // These are all required when uploading source maps
            invariant(
                typeof frontendBundleSourceMapPath === 'string',
                'expected frontendBundleSourceMapPath to be string',
            );
            invariant(typeof s3BundleKey === 'string', 'expected s3BundleKey to be string');
            invariant(typeof gitHash === 'string', 'expected gitHash to be string');
            invariant(typeof bundleCdn === 'string', 'expected bundleCdn to be string');
            if (uploadSourceMapsToSentry) {
                console.log(`uploading source maps to sentry for ${s3BundleKey}`);
                await _uploadSourceMapToSentryAsync(
                    frontendBundlePath,
                    frontendBundleSourceMapPath,
                    s3BundleKey,
                    gitHash,
                    bundleCdn,
                );
            }
        }
        console.log('releasing');
        if (isV2Block) {
            invariant(typeof developerComment === 'string', 'expects comment to be a string');
            await apiClient.createV2ReleaseAsync(buildId, developerComment);
        } else {
            await apiClient.createReleaseAsync(buildId, deployId);
        }
    } catch (err) {
        throw err;
    } finally {
        await blockBuilder.wipeBaseOutputBuildDirAsync();
    }

    console.log('✅ successfully released block!');
    if (isV2Block) {
        console.log('Note: updating all block installations may take up to 30 minutes');
    }
}

module.exports = {runCommandAsync};
