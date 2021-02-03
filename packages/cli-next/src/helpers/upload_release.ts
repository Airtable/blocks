import {AirtableApi, AirtableApiBlockOptions} from './airtable_api';
import {S3Api, S3SignedUploadInfo} from './s3_api';
import {invariant} from './error_utils';

interface AppBuildResponseJson {
    buildId: string;
    frontendBundleUploadUrl: string;
    backendDeploymentPackageUploadUrl: string | null;
    frontendBundleS3UploadInfo: S3SignedUploadInfo;
    backendDeploymentPackageS3UploadInfo: S3SignedUploadInfo | null;
}

interface AppDeployResponseJson {
    deployId: string;
}

export class UploadRelease {
    private airtable: AirtableApi;
    private s3: S3Api;
    private blockUrlOptions: AirtableApiBlockOptions;

    constructor({
        airtable,
        s3,
        ...blockUrlOptions
    }: {airtable: AirtableApi; s3: S3Api} & AirtableApiBlockOptions) {
        this.airtable = airtable;
        this.s3 = s3;

        this.blockUrlOptions = blockUrlOptions;
    }

    async buildUploadAsync({
        frontendBundle,
        backendBundle,
    }: {
        frontendBundle: Buffer;
        backendBundle: Buffer | null;
    }): Promise<AppBuildResponseJson> {
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
    }: AppBuildResponseJson & Partial<AppDeployResponseJson>): Promise<void> {
        await this.airtable.blockCreateReleaseAsync({
            ...this.blockUrlOptions,
            buildId,
            deployId: deployId ?? null,
        });
    }
}
