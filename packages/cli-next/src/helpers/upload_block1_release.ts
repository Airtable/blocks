import {AirtableBlock1Api, AirtableBlock1ApiBaseOptions} from './airtable_block1_api';
import {S3Api, S3SignedUploadInfo} from './s3_api';
import {invariant} from './error_utils';

export interface AppBlock1BuildResponseJson {
    buildId: string;
    frontendBundleUploadUrl: string;
    backendDeploymentPackageUploadUrl: string | null;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
    backendDeploymentPackageS3UploadInfo: S3SignedUploadInfo | null;
}

export interface UploadBlock1ReleaseConstructorOptions {
    api: {
        airtable: AirtableBlock1Api;
        s3: S3Api;
    };
    blockUrlOptions: AirtableBlock1ApiBaseOptions;
}

export interface UploadBlock1ReleaseUploadOptions {
    frontendBundle: Buffer;
    backendBundle: Buffer | null;
}

export interface UploadBlock1ReleaseCreateReleaseOptions {
    buildId: string;
    deployId?: string;
}

export class UploadBlock1Release {
    private airtable: AirtableBlock1Api;
    private s3: S3Api;
    private blockUrlOptions: AirtableBlock1ApiBaseOptions;

    constructor({api: {airtable, s3}, blockUrlOptions}: UploadBlock1ReleaseConstructorOptions) {
        this.airtable = airtable;
        this.s3 = s3;

        this.blockUrlOptions = blockUrlOptions;
    }

    async buildUploadAsync({
        frontendBundle,
        backendBundle,
    }: UploadBlock1ReleaseUploadOptions): Promise<AppBlock1BuildResponseJson> {
        const build = await this.airtable.blockBuildStartAsync({
            ...this.blockUrlOptions,
            hasBackend: backendBundle !== null,
        });

        try {
            await this.s3.uploadBundleAsync({
                fileBuffer: frontendBundle,
                uploadInfo: build.frontendBundleS3UploadInfo,
            });
            if (backendBundle !== null) {
                invariant(
                    build.backendDeploymentPackageS3UploadInfo !== null,
                    'Missing backend s3 upload info when uploading backend bundle',
                );
                await this.s3.uploadBundleAsync({
                    fileBuffer: backendBundle,
                    uploadInfo: build.backendDeploymentPackageS3UploadInfo,
                });
            }
        } catch (err) {
            await this.airtable.blockBuildFailedAsync({
                ...this.blockUrlOptions,
                buildId: build.buildId,
            });
            throw err;
        }

        await this.airtable.blockBuildSucceededAsync({
            ...this.blockUrlOptions,
            buildId: build.buildId,
        });

        return build;
    }

    async createReleaseAsync({
        buildId,
        deployId,
    }: UploadBlock1ReleaseCreateReleaseOptions): Promise<void> {
        await this.airtable.blockCreateReleaseAsync({
            ...this.blockUrlOptions,
            buildId,
            deployId: deployId ?? null,
        });
    }
}
