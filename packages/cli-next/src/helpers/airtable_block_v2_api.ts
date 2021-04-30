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
import {S3SignedUploadInfo} from './s3_api';
import {invariant, spawnUserError} from './error_utils';
import {ReleaseCommandErrorInfo, ReleaseCommandErrorName} from './release_messages';

export interface AirtableBlockV2ApiBaseOptions extends AirtableApiOptions {
    blockId: string;
}

export interface AirtableBlockV2ApiReleaseOptions {
    buildId: string;
    developerComment: string;
}

export interface AirtableBlockV2ApiBuildStartResponse {
    buildId: string;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
}

export interface AirtableBlockV2ApiReleaseResponse {
    releaseId: string;
}

export class AirtableBlockV2Api extends AirtableApi {
    airtableFetchInit({url, ...init}: FetchInit): FetchInit {
        return super.airtableFetchInit({
            url: `/v2/blocksV2/${this.blockId}${url}`,
            ...init,
        });
    }

    async _blockBuildStartAsync(): Promise<CreateBuildResponseJson> {
        return await this.fetchJsonAsync(this.airtableFetchInit({url: '/builds/start'}));
    }

    async blockCreateReleaseAsync({
        buildId,
        developerComment,
    }: AirtableBlockV2ApiReleaseOptions): Promise<AirtableBlockV2ApiReleaseResponse> {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({
                url: '/releases/create',
                body: {buildId, developerComment},
            }),
        );
    }

    async _blockCreateCodeUploadAsync(): Promise<CodeUploadResponse> {
        return await this.fetchJsonAsync(
            this.airtableFetchInit({
                url: '/codeUpload/create',
                body: {isV2Block: true},
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
        if (backendBundle) {
            throw spawnUserError<ReleaseCommandErrorInfo>({
                type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK2_BACKEND_UNSUPPORTED,
            });
        }

        const build = await this._blockBuildStartAsync();

        await s3.uploadBundleAsync({
            fileBuffer: frontendBundle,
            uploadInfo: build.frontendBundleS3UploadInfo,
        });

        return build;
    }

    async createReleaseAsync({
        buildId,
        deployId,
        developerComment,
    }: CreateReleaseOptions): Promise<void> {
        if (deployId) {
            throw spawnUserError<ReleaseCommandErrorInfo>({
                type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK2_BACKEND_UNSUPPORTED,
            });
        }
        invariant(developerComment, 'developerComment is required for releasing a v2 block');
        await this.blockCreateReleaseAsync({
            buildId,
            developerComment: developerComment,
        });
    }
}
