import {
    AirtableApi,
    AirtableApiOptions,
    CodeUploadOptions,
    CodeUploadResponse,
    CreateBuildOptions,
    CreateBuildResponseJson,
    CreateReleaseOptions,
    FinalizeCodeUploadResponse,
} from './airtable_api';
import {FetchInit} from './fetch_api';
import {invariant, spawnUserError} from './error_utils';
import {ReleaseCommandErrorInfo, ReleaseCommandErrorName} from './release_messages';

export interface AirtableLegacyBlockApiBaseOptions extends AirtableApiOptions {
    baseId: string;
}

export interface AirtableLegacyBlockApiBuildStartOptions {
    hasBackend: boolean;
}

export interface AirtableLegacyBlockApiInstallationOptions {
    blockInstallationId: string;
}

export interface AirtableLegacyBlockApiBuildOptions {
    buildId: string;
}

interface AirtableLegacyBlockApiDeployOptions {
    deployId: string | null;
}

export interface AirtableLegacyBlockApiReleaseOptions
    extends AirtableLegacyBlockApiBuildOptions,
        AirtableLegacyBlockApiDeployOptions {}

export class AirtableLegacyBlockApi extends AirtableApi {
    private baseId: string;

    constructor({
        baseId,
        blockId,
        apiKey,
        userAgent,
        apiBaseUrl,
    }: AirtableLegacyBlockApiBaseOptions) {
        super({blockId, apiKey, userAgent, apiBaseUrl});
        this.baseId = baseId;
    }

    airtableFetchInit({url, ...init}: FetchInit): FetchInit {
        return super.airtableFetchInit({
            url: `/v2/bases/${this.baseId}/blocks/${this.blockId}${url}`,
            ...init,
        });
    }

    async blockAccessPolicyAsync({blockInstallationId}: AirtableLegacyBlockApiInstallationOptions) {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({
                url: `/v2/meta/${this.baseId}/blockInstallations/${blockInstallationId}/accessPolicy`,
            }),
        );
    }

    async _blockBuildStartAsync({
        hasBackend,
    }: AirtableLegacyBlockApiBuildStartOptions): Promise<CreateBuildResponseJson> {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({url: '/builds/start', body: {hasBackend}}),
        );
    }

    async _blockBuildSucceededAsync({buildId}: AirtableLegacyBlockApiBuildOptions) {
        return await this.fetchVoidAsync(
            this.airtableFetchInit({url: `/builds/${buildId}/succeed`}),
        );
    }

    async blockBuildFailedAsync({buildId}: AirtableLegacyBlockApiBuildOptions) {
        return await this.fetchVoidAsync(this.airtableFetchInit({url: `/builds/${buildId}/fail`}));
    }

    async blockCreateDeployAsync({buildId}: AirtableLegacyBlockApiBuildOptions) {
        return await this.fetchVoidAsync(
            this.airtableFetchInit({
                url: '/deploys/create',
                body: {
                    buildId,
                },
            }),
        );
    }

    async blockDeployStatusAsync({deployId}: AirtableLegacyBlockApiDeployOptions) {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({url: `/deploys/${deployId}/status`}),
        );
    }

    async blockCreateReleaseAsync({buildId, deployId}: AirtableLegacyBlockApiReleaseOptions) {
        return await this.fetchVoidAsync(
            this.airtableFetchInit({
                url: '/releases/create',
                body: {
                    buildId,
                    deployId,
                },
            }),
        );
    }

    async _blockCreateCodeUploadAsync(): Promise<CodeUploadResponse> {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({
                url: '/codeUpload/create',
                body: {isV2Block: false},
            }),
        );
    }

    async _blockFinalizeCodeUploadAsync({
        codeUploadId,
        status,
    }: CodeUploadOptions): Promise<FinalizeCodeUploadResponse> {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({
                url: '/codeUpload/finalize',
                body: {
                    codeUploadId,
                    status,
                },
            }),
        );
    }

    async createBuildAsync({
        s3,
        frontendBundle,
        backendBundle,
    }: CreateBuildOptions): Promise<CreateBuildResponseJson> {
        const build = await this._blockBuildStartAsync({
            hasBackend: backendBundle !== null,
        });

        try {
            await s3.uploadBundleAsync({
                fileBuffer: frontendBundle,
                uploadInfo: build.frontendBundleS3UploadInfo,
            });
            if (backendBundle !== null) {
                invariant(
                    build.backendDeploymentPackageS3UploadInfo !== null,
                    'Missing backend s3 upload info when uploading backend bundle',
                );
                await s3.uploadBundleAsync({
                    fileBuffer: backendBundle,
                    uploadInfo: build.backendDeploymentPackageS3UploadInfo,
                });
            }
        } catch (err) {
            await this.blockBuildFailedAsync({
                buildId: build.buildId,
            });
            throw err;
        }

        await this._blockBuildSucceededAsync({
            buildId: build.buildId,
        });

        return build;
    }

    async createReleaseAsync({
        buildId,
        deployId,
        developerComment,
    }: CreateReleaseOptions): Promise<void> {
        if (developerComment) {
            throw spawnUserError<ReleaseCommandErrorInfo>({
                type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED,
            });
        }
        await this.blockCreateReleaseAsync({
            buildId,
            deployId: deployId ?? null,
        });
    }
}
