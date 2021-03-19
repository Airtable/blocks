import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';

import cli from 'cli-ux';

import {
    AIRTABLE_API_URL,
    APP_RELEASE_DIR,
    APP_ROOT_TEMPORARY_DIR,
    BUNDLE_FILE_NAME,
} from '../settings';
import {createReleaseTaskAsync} from '../manager/release';

import AirtableCommand from '../helpers/airtable_command';
import {
    findAppConfigPathAsync,
    findAppDirectoryAsync,
    findRemoteConfigPathAsync,
    readAppConfigAsync,
    readRemoteConfigAsync,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {mkdirpAsync, rmdirAsync} from '../helpers/system_extra';
import {AirtableApi} from '../helpers/airtable_api';
import {S3Api} from '../helpers/s3_api';
import {UploadRelease} from '../helpers/upload_release';
import {readApiKeyAsync} from '../helpers/system_api_key';
import {createUserAgentAsync} from '../helpers/user_agent';
import {
    ReleaseBundleOptions,
    ReleaseTaskConsumer,
    ReleaseTaskConsumerChannel,
    ReleaseTaskProducer,
} from '../tasks/release';
import {Deferred} from '../helpers/deferred';

const debug = _debug('block-cli:command:release');

class ReleaseProducer implements ReleaseTaskProducer {
    readyDefer = new Deferred<void>();

    async readyAsync() {
        this.readyDefer.resolve();
    }
}

class ReleaseConsumer implements ReleaseTaskConsumer {
    consumerChannel: ReleaseTaskConsumerChannel;

    constructor(consumerChannel: ReleaseTaskConsumerChannel) {
        this.consumerChannel = consumerChannel;
    }

    async bundleAsync(options: ReleaseBundleOptions) {
        await this.consumerChannel.requestAsync('bundleAsync', options);
    }

    async teardownAsync() {
        await this.consumerChannel.requestAsync('teardownAsync');
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

    static description = 'release a build to an Airtable base';

    static examples = [
        `$ block release
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
    };

    async runAsync() {
        this.parse(Release);

        const sys = this.system;

        // load app config
        const appRootPath = await findAppDirectoryAsync(sys, sys.process.cwd());
        const appConfigResult = await readAppConfigAsync(sys);
        if (appConfigResult.err) {
            this.error(appConfigResult.err);
        }
        const appConfig = appConfigResult.value;
        debug(
            'loaded app config at %s',
            sys.path.relative(
                sys.process.cwd(),
                await findAppConfigPathAsync(sys, sys.process.cwd()),
            ),
        );

        const remoteConfigResult = await readRemoteConfigAsync(sys);
        if (remoteConfigResult.err) {
            this.error(remoteConfigResult.err);
        }
        const remoteConfig = remoteConfigResult.value;
        const {baseId, blockId} = remoteConfig;
        debug(
            'loaded remote config at %s',
            sys.path.relative(
                sys.process.cwd(),
                await findRemoteConfigPathAsync(sys, sys.process.cwd()),
            ),
        );

        const apiKeyResult = await readApiKeyAsync(sys, remoteConfig.apiKeyName);
        if (apiKeyResult.err) {
            this.error(apiKeyResult.err);
        }
        const apiKey = apiKeyResult.value;
        debug('loaded apiKey %s', remoteConfig.apiKeyName ?? 'default');

        const userAgent = await createUserAgentAsync(sys);
        debug('connecting to Airtable with user agent: %s', userAgent);

        const api = {
            airtable: new AirtableApi(),
            s3: new S3Api(),
        };
        const upload = new UploadRelease({
            ...api,

            baseId,
            blockId,
            apiKey,
            userAgent,
            apiBaseUrl: remoteConfig.server ?? AIRTABLE_API_URL,
        });

        // fork bundler process
        const producer = new ReleaseProducer();
        const task = new ReleaseConsumer(await createReleaseTaskAsync(sys, producer));
        this._task = task;
        debug('initialized task');

        // pick a temporary directory to write the entry point to
        this._appTemporaryPath = sys.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(sys, this._appTemporaryPath);
        debug('created temporary directory');

        // pick a output build directory to write the bundle to
        const appBuildPath = sys.path.join(this._appTemporaryPath, APP_RELEASE_DIR);
        await mkdirpAsync(sys, appBuildPath);
        debug('created build directory');

        cli.action.start('Bundling');
        this._teardownAction = () => {
            this._teardownAction = null;
            cli.action.stop('Incomplete');
        };

        // write entry point to disk
        const entryPointPath = sys.path.join(this._appTemporaryPath, 'index.js');
        const userEntryPoint = sys.path.join(appRootPath, appConfig.frontendEntry);
        const entryPoint = await renderEntryPointAsync(sys, {
            mode: 'production',
            destination: entryPointPath,
            userEntryPoint,
        });
        await sys.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint));
        debug(
            'wrote generated entry file at %s',
            sys.path.relative(sys.process.cwd(), entryPointPath),
        );

        await producer.readyDefer.promise;

        // start bundling
        debug('starting bundler');
        await task.bundleAsync({
            mode: 'production',
            context: appRootPath,
            entry: entryPointPath,
            outputPath: appBuildPath,
        });

        cli.action.stop();
        cli.action.start('Uploading');

        const frontendBundle = await sys.fs.readFileAsync(
            sys.path.join(appBuildPath, BUNDLE_FILE_NAME),
        );

        // upload bundle
        const build = await upload.buildUploadAsync({
            frontendBundle,
            backendBundle: null,
        });

        cli.action.stop();
        cli.action.start('Releasing');

        // create release with uploaded build
        await upload.createReleaseAsync(build);

        cli.action.stop();
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
