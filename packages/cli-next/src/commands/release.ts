import path from 'path';
import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';

import SentryCli from '@sentry/cli';
import AirtableCommand from '../helpers/airtable_command';
import {
    AIRTABLE_API_URL,
    APP_RELEASE_DIR,
    APP_ROOT_TEMPORARY_DIR,
    BUNDLE_FILE_NAME,
    V2_BLOCKS_BASE_ID,
} from '../settings';
import {createReleaseTaskAsync, ReleaseTaskProducer} from '../manager/release';

import {
    findAppConfigAsync,
    findAppDirectoryAsync,
    findRemoteConfigPathByNameAsync,
    readAppConfigAsync,
    readRemoteConfigAsync,
    validateRemoteName,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {mkdirpAsync, rmdirAsync} from '../helpers/system_extra';
import {AirtableLegacyBlockApi} from '../helpers/airtable_legacy_block_api';
import {AirtableBlockV2Api} from '../helpers/airtable_block_v2_api';
import {S3Api} from '../helpers/s3_api';
import {readApiKeyAsync} from '../helpers/system_api_key';
import {createUserAgentAsync} from '../helpers/user_agent';
import {ReleaseTaskConsumer} from '../tasks/release';
import {Deferred} from '../helpers/deferred';
import {unwrapResultFunctor} from '../helpers/result';
import {invariant, spawnUserError} from '../helpers/error_utils';
import {ReleaseCommandErrorName, ReleaseCommandMessageName} from '../helpers/release_messages';
import {RemoteCommandMessageName} from '../helpers/remote_messages';
import cli from '../helpers/cli_ux';
import {AirtableApi} from '../helpers/airtable_api';
import {getGitHashAsync} from '../helpers/get_git_hash';

const debug = _debug('block-cli:command:release');

class ReleaseProducer implements ReleaseTaskProducer {
    readyDefer = new Deferred<void>();

    async readyAsync() {
        this.readyDefer.resolve();
    }
}

export default class Release extends AirtableCommand {
    private _task?: ReleaseTaskConsumer;
    private _teardownAction?: (() => void) | null;
    /**
     * A file system path describing the location where a temporary directory
     * should be created to store the generated file(s).
     */
    private _appTemporaryPath?: string;

    static description = 'Release a build to an Airtable base';

    static examples = [`$ block release`];

    static flags = {
        help: commandFlags.help({char: 'h'}),
        remote: commandFlags.string({
            description: '[Beta] Configure which remote to use',
            parse: unwrapResultFunctor(validateRemoteName),
        }),
        comment: commandFlags.string({
            description:
                'A string describing the changes in this release. Can be at most 1000 characters',
            hidden: true,
        }),
        'upload-source-maps-to-sentry': commandFlags.boolean({
            description:
                "Uploads the source map for the block's frontend bundle to the specified sentry project. Need to also set BLOCKS_CLI_SENTRY_{AUTH_TOKEN|ORG|PROJECT} environment variables.",
            default: false,
            hidden: true,
        }),
    };

    async _uploadSourceMapToSentryAsync(
        frontendBundlePath: string,
        frontendBundleSourceMapPath: string,
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

    async runAsync() {
        const {flags} = this.parse(Release);

        const sys = this.system;
        const uploadSourceMapsToSentry = flags['upload-source-maps-to-sentry'];

        const appRootPath = await findAppDirectoryAsync(sys, sys.process.cwd());

        const appConfigLocation = await findAppConfigAsync(sys);
        const appConfigResult = await readAppConfigAsync(sys, appConfigLocation);
        if (appConfigResult.err) {
            this.error(appConfigResult.err);
        }
        const appConfig = appConfigResult.value;
        debug(
            'loaded extension config at %s',
            sys.path.relative(sys.process.cwd(), appConfigLocation),
        );

        if (flags.remote) {
            this.logMessage({type: RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING});
        }

        const remoteConfigPath = await findRemoteConfigPathByNameAsync(
            sys,
            sys.process.cwd(),
            flags.remote,
        );
        const remoteConfigResult = await readRemoteConfigAsync(sys, remoteConfigPath);
        if (remoteConfigResult.err) {
            this.error(remoteConfigResult.err);
        }
        const remoteConfig = remoteConfigResult.value;
        const {baseId, blockId, server: apiBaseUrl = AIRTABLE_API_URL} = remoteConfig;
        debug('loaded remote config at %s', sys.path.relative(sys.process.cwd(), remoteConfigPath));

        const apiKeyResult = await readApiKeyAsync(sys, remoteConfig.apiKeyName);
        if (apiKeyResult.err) {
            this.error(apiKeyResult.err);
        }
        const apiKey = apiKeyResult.value;
        debug('loaded apiKey %s', remoteConfig.apiKeyName ?? 'default');

        const userAgent = await createUserAgentAsync(sys);
        debug('connecting to Airtable with user agent: %s', userAgent);

        let airtableApi: AirtableApi;
        let developerComment: string | undefined;
        const s3 = new S3Api();
        if (baseId === V2_BLOCKS_BASE_ID) {
            developerComment = flags.comment;
            if (!developerComment) {
                developerComment = await cli.prompt(
                    this.messages.renderMessage({
                        type: ReleaseCommandMessageName.RELEASE_COMMAND_DEVELOPER_COMMENT_PROMPT,
                    }),
                );
                invariant(developerComment, 'prompt must return a value');
            }

            airtableApi = new AirtableBlockV2Api({
                blockId,
                apiKey,
                userAgent,
                apiBaseUrl,
            });
        } else {
            if (flags.comment) {
                throw spawnUserError({
                    type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED,
                });
            }

            airtableApi = new AirtableLegacyBlockApi({
                baseId,
                blockId,
                apiKey,
                userAgent,
                apiBaseUrl,
            });
        }

        const producer = new ReleaseProducer();
        const task = await createReleaseTaskAsync(
            sys,
            {module: appConfig.bundler?.module, workingdir: appRootPath},
            producer,
        );
        this._task = task;
        debug('initialized task');

        this._appTemporaryPath = sys.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(sys, this._appTemporaryPath);
        debug('created temporary directory');

        const appBuildPath = sys.path.join(this._appTemporaryPath, APP_RELEASE_DIR);
        await mkdirpAsync(sys, appBuildPath);
        debug('created build directory');

        cli.action.start('Bundling');
        this._teardownAction = () => {
            this._teardownAction = null;
            cli.action.stop('Incomplete');
        };

        const entryPointPath = sys.path.join(this._appTemporaryPath, 'index.js');
        const frontendBundlePath = sys.path.join(appBuildPath, BUNDLE_FILE_NAME);
        const userEntryPoint = sys.path.join(appRootPath, appConfig.frontendEntry);
        const gitHash = await getGitHashAsync(sys, appRootPath);
        const entryPoint = await renderEntryPointAsync(sys, {
            mode: 'production',
            destination: entryPointPath,
            userEntryPoint,
            gitHash: gitHash ?? undefined,
        });
        await sys.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint));
        debug(
            'wrote generated entry file at %s',
            sys.path.relative(sys.process.cwd(), entryPointPath),
        );

        await producer.readyDefer.promise;

        debug('starting bundler');
        await task.bundleAsync({
            mode: 'production',
            context: appRootPath,
            entry: entryPointPath,
            outputPath: appBuildPath,
            shouldGenerateSeparateSourceMaps: uploadSourceMapsToSentry,
        });

        cli.action.stop();
        cli.action.start('Uploading');

        const frontendBundle = await sys.fs.readFileAsync(frontendBundlePath);

        const build = await airtableApi.createBuildAsync({
            s3,
            frontendBundle,
            backendBundle: null,
        });

        cli.action.stop();
        if (uploadSourceMapsToSentry) {
            cli.action.start('Uploading source maps');
            const bundleCdn = remoteConfig.bundleCdn;
            const s3BundleKey = build.frontendBundleS3UploadInfo.key;
            const frontendBundleSourceMapPath = frontendBundlePath + '.map';
            invariant(typeof s3BundleKey === 'string', 'expected s3BundleKey to be string');
            invariant(
                typeof gitHash === 'string',
                'failed to get gitHash, the block must be in a git repo to support uploading sourcemaps',
            );
            invariant(
                typeof bundleCdn === 'string',
                'bundleCdn must be set on the .block/*.json config',
            );
            await this._uploadSourceMapToSentryAsync(
                frontendBundlePath,
                frontendBundleSourceMapPath,
                s3BundleKey,
                gitHash,
                bundleCdn,
            );
            cli.action.stop();
        }
        cli.action.start('Releasing');

        await airtableApi.createReleaseAsync({buildId: build.buildId, developerComment});

        cli.action.stop();
        this.log('✅ Successfully released block!');
        this._teardownAction = null;
    }

    async finallyAsync() {
        await Promise.all([
            this._appTemporaryPath ? rmdirAsync(this.system, this._appTemporaryPath) : null,
            this._task ? this._task.teardownAsync() : null,
            this._teardownAction ? this._teardownAction() : null,
        ]);
    }
}
