// @flow
const invariant = require('invariant');
const request = require('request');
const {promisify} = require('util');
const {URL} = require('url');
const {USER_AGENT, AIRTABLE_API_URL} = require('./config/block_cli_config_settings');
const parseAndValidateRemoteJsonAsync = require('./helpers/parse_and_validate_remote_json_async');
const {getBlockDirPath} = require('./get_block_dir_path');
const getApiKeySync = require('./get_api_key_sync');
request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);
request.postAsync = promisify(request.post);

import type {Result} from './types/result';

type ApplicationId = string;
type BlockInstallationId = string;
type BlockId = string;
type BuildId = string;
type DeployId = string;
type ReleaseId = string;

// TODO(jb): realistically, all of these endpoints should be using `bases` and not `meta`.
// If/when we update the endpoints, we should get rid of support for `meta` here.
const ApiTypes = Object.freeze({
    BASES: ('bases': 'bases'),
    META: ('meta': 'meta'),
});
type ApiType = $Values<typeof ApiTypes>;

class APIClient {
    _apiBaseUrl: string;
    _applicationId: ApplicationId;
    _blockInstallationId: BlockInstallationId | null;
    _blockId: BlockId | null;
    _apiKey: string;

    static async constructAPIClientForRemoteAsync(remoteName: string | null): Promise<Result<APIClient>> {
        const parseResult = await parseAndValidateRemoteJsonAsync(remoteName);
        if (parseResult.err) {
            return parseResult;
        }
        const remoteJson = parseResult.value;
        const apiKey = getApiKeySync(getBlockDirPath());
        const apiClient = new APIClient({
            applicationId: remoteJson.baseId,
            blockId: remoteJson.blockId,
            apiBaseUrl: remoteJson.server,
            apiKey,
        });
        return {value: apiClient};
    }

    constructor(opts: {|
        apiBaseUrl: ?string,
        applicationId: ApplicationId,
        blockInstallationId?: BlockInstallationId,
        blockId?: BlockId,
        apiKey: string,
    |}) {
        this._apiBaseUrl = opts.apiBaseUrl || AIRTABLE_API_URL;
        this._applicationId = opts.applicationId;
        this._blockInstallationId = opts.blockInstallationId || null;
        this._blockId = opts.blockId || null;
        this._apiKey = opts.apiKey;
    }

    _getBlockBaseUrl(apiType: ApiType): string {
        invariant(this._blockId, 'this._blockId');
        return this._getUrl(`/v2/${apiType}/${this._applicationId}/blocks/${this._blockId}`);
    }

    _getAccessPolicyUrl(): string {
        invariant(this._blockInstallationId, '_blockInstallationId');
        return this._getUrl(`/v2/${ApiTypes.META}/${this._applicationId}/blockInstallations/${this._blockInstallationId}/accessPolicy`);
    }

    _getUrl(path: string): string {
        return new URL(path, this._apiBaseUrl).href;
    }

    async startBuildAsync(hasBackend: boolean): Promise<{buildId: BuildId, frontendBundleUploadUrl: string, backendDeploymentPackageUploadUrl: string | null}> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/start`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: {hasBackend},
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async succeedBuildAsync(buildId: BuildId): Promise<void> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/${buildId}/succeed`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    async failBuildAsync(buildId: BuildId): Promise<void> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/builds/${buildId}/fail`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
    }

    async createDeployAsync(buildId: BuildId): Promise<{deployId: DeployId}> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/deploys/create`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: {buildId},
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async getDeployStatusAsync(deployId: DeployId): Promise<{status: string}> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/deploys/${deployId}/status`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            json: true,
        };
        const response = await request.getAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async createReleaseAsync(buildId: BuildId, deployId: DeployId | null): Promise<{releaseId: ReleaseId}> {
        const options = {
            url: `${this._getBlockBaseUrl(ApiTypes.BASES)}/releases/create`,
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
            },
            body: {
                buildId,
                deployId,
            },
            json: true,
        };
        const response = await request.postAsync(options);
        const {body, statusCode} = response;
        if (statusCode !== 200) {
            const errorMessage = body.errors.map(o => o.message).join('\n');
            throw new Error(errorMessage);
        }
        return body;
    }

    async fetchAccessPolicyAsync(): Promise<string> {
        const options = {
            url: this._getAccessPolicyUrl(),
            headers: {
                Authorization: `Bearer ${this._apiKey}`,
                'User-Agent': USER_AGENT,
            },
        };
        const response = await request.getAsync(options);
        const body = response.body;
        const statusCode = response.statusCode;
        // If we got a 404, return incorrect app or block id error.
        if (statusCode === 404) {
            throw new Error('Incorrect application or block installation id');
        }
        const bodyParsed = JSON.parse(body);
        // If we got anything else other than 200 and 404, return whatever error we got.
        if (statusCode !== 200) {
            throw new Error(bodyParsed.error.message);
        }
        return bodyParsed.accessPolicy;
    }

    get applicationId(): ApplicationId {
        return this._applicationId;
    }

    get blockInstallationId(): BlockInstallationId | null {
        return this._blockInstallationId;
    }

    get apiBaseUrl(): string {
        return this._apiBaseUrl;
    }
}

module.exports = APIClient;
