import {S3Api, S3SignedUploadInfo} from './s3_api';
import {spawnUserError} from './error_utils';
import {AirtableBlock2Api, AirtableBlock2ApiBaseOptions} from './airtable_block2_api';
import {ReleaseCommandErrorInfo, ReleaseCommandErrorName} from './release_messages';

export interface UploadBlock2ReleaseConstructorOptions {
    api: {
        airtable: AirtableBlock2Api;
        s3: S3Api;
    };
    developerComment: string;
    blockUrlOptions: AirtableBlock2ApiBaseOptions;
}

export interface UploadBlock2BuildResponseJson {
    buildId: string;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
}

export interface UploadBlock2ReleaseBuildUploadOptions {
    frontendBundle: Buffer;
    backendBundle: Buffer | null;
}

export interface UploadBlock2ReleaseCreateReleaseOptions {
    buildId: string;
}

export class UploadBlock2Release {
    private airtable: AirtableBlock2Api;
    private s3: S3Api;
    private blockUrlOptions: AirtableBlock2ApiBaseOptions;
    private developerComment: string;

    constructor({
        api: {airtable, s3},
        developerComment,
        blockUrlOptions,
    }: UploadBlock2ReleaseConstructorOptions) {
        this.airtable = airtable;
        this.s3 = s3;

        this.blockUrlOptions = blockUrlOptions;
        this.developerComment = developerComment;
    }

    async buildUploadAsync({
        frontendBundle,
        backendBundle,
    }: UploadBlock2ReleaseBuildUploadOptions): Promise<UploadBlock2BuildResponseJson> {
        if (backendBundle) {
            throw spawnUserError<ReleaseCommandErrorInfo>({
                type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK2_BACKEND_UNSUPPORTED,
            });
        }

        const build = await this.airtable.blockBuildStartAsync({
            ...this.blockUrlOptions,
        });

        await this.s3.uploadBundleAsync({
            fileBuffer: frontendBundle,
            uploadInfo: build.frontendBundleS3UploadInfo,
        });

        return build;
    }

    async createReleaseAsync({buildId}: UploadBlock2ReleaseCreateReleaseOptions): Promise<void> {
        await this.airtable.blockCreateReleaseAsync({
            ...this.blockUrlOptions,
            buildId,
            developerComment: this.developerComment,
        });
    }
}
