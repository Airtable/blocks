import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';
import clipboardy from 'clipboardy';

import AirtableCommand from '../helpers/airtable_command';
import {APP_ROOT_TEMPORARY_DIR} from '../settings';
import {createRunTaskAsync, RunTaskProducer} from '../manager/run';
import {BuildState, BuildStateBuilt, BuildStateError, BuildStatus} from '../tasks/run';

import {findPortAsync} from '../helpers/find_port_async';
import {
    createServerAsync,
    DevelopmentProxyServerInterface,
} from '../helpers/development_proxy_server';
import {
    findAppConfigAsync,
    findAppDirectoryAsync,
    findRemoteConfigPathByNameAsync,
    readAppConfigAsync,
    readRemoteConfigAsync,
    validateRemoteName,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {dirExistsAsync, mkdirpAsync, rmdirAsync, watchFileAsync} from '../helpers/system_extra';
import {Deferred} from '../helpers/deferred';
import {spawnUnexpectedError, spawnUserError} from '../helpers/error_utils';
import {RunTaskConsumerAdapter} from '../manager/run_adapter';
import {BuildErrorInfo, BuildErrorName} from '../helpers/build_messages';
import {unwrapResultFunctor} from '../helpers/result';
import {RemoteCommandMessageName} from '../helpers/remote_messages';
import {createUserAgentAsync} from '../helpers/user_agent';
import {
    DevelopmentRunFrameMessageName,
    RunFrameRouteOptions,
} from '../helpers/development_run_frame_routes';
import {MessageInfo} from '../helpers/verbose_message';

const debug = _debug('block-cli:command:run');

class RunProducer implements RunTaskProducer {
    readyDefer = new Deferred<void>();

    buildState: BuildState = {status: BuildStatus.START};
    buildStateDefer = new Deferred<BuildState>();

    async readyAsync() {
        this.readyDefer.resolve();
    }

    emitBuildState(buildState: BuildState) {
        this.buildState = buildState;
        const lastDefer = this.buildStateDefer;
        this.buildStateDefer = new Deferred<BuildState>();
        lastDefer.resolve(buildState);
    }
}

export default class Run extends AirtableCommand {
    private _task?: RunTaskConsumerAdapter;
    private _devServer?: DevelopmentProxyServerInterface;
    /**
     * A file system path describing the location where a temporary directory
     * should be created to store the generated file(s).
     */
    private _appTemporaryPath?: string;

    static description = 'Run the app locally';

    static examples = [
        `$ block run
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),

        port: commandFlags.integer({
            description:
                'HTTPS port the server listens on. The server will listen for HTTP on PORT + 1.',
            default: 9000,
        }),

        remote: commandFlags.string({
            description: '[Beta] Configure which remote to use',
            parse: unwrapResultFunctor(validateRemoteName),
        }),
    };

    async runAsync() {
        const {flags} = this.parse(Run);

        const {system: sys, messages} = this;

        const appRootPath = await findAppDirectoryAsync(this.system, this.system.process.cwd());
        const nodeModulesPath = this.system.path.join(appRootPath, 'node_modules');
        if (!(await dirExistsAsync(this.system, nodeModulesPath))) {
            throw spawnUserError<BuildErrorInfo>({
                type: BuildErrorName.BUILD_NODE_MODULES_ABSENT,
                appRootPath: this.system.path.relative(this.system.process.cwd(), appRootPath),
            });
        }

        const appConfigLocation = await findAppConfigAsync(this.system);
        const appConfigResult = await readAppConfigAsync(this.system, appConfigLocation);
        if (appConfigResult.err) {
            this.error(appConfigResult.err);
        }
        const appConfig = appConfigResult.value;
        debug(
            'loaded app config at %s',
            this.system.path.relative(this.system.process.cwd(), appConfigLocation),
        );

        const appConfigModifiedPromise = (async () => {
            const {whenModified} = await watchFileAsync(this.system, appConfigLocation);
            await whenModified;

            throw spawnUserError<BuildErrorInfo>({
                type: BuildErrorName.BUILD_APP_CONFIG_MODIFIED,
            });
        })();

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
        debug('loaded remote config at %s', sys.path.relative(sys.process.cwd(), remoteConfigPath));

        const userAgent = await createUserAgentAsync(sys);
        debug('connecting to Airtable with user agent: %s', userAgent);

        const producer = new RunProducer();

        const secureServerPort = await Promise.race([
            findPortAsync(flags.port, {
                adjacentPorts: 1,
            }),
            appConfigModifiedPromise,
        ]);
        const serverPort = secureServerPort + 1;

        let blockInstallationId: string | undefined;
        const logMessage = <Info extends MessageInfo>(message: Info) => this.logMessage(message);
        const frameRouteOptions: RunFrameRouteOptions = {
            remoteConfig,
            userAgent,
            messages,

            getBuildState: () => producer.buildState,
            async getBuildStateResultAsync(): Promise<BuildStateBuilt | BuildStateError> {
                if (
                    producer.buildState.status === BuildStatus.READY ||
                    producer.buildState.status === BuildStatus.ERROR
                ) {
                    return producer.buildState;
                } else {
                    await producer.buildStateDefer.promise;
                    return await frameRouteOptions.getBuildStateResultAsync();
                }
            },

            setBlockInstallationId(id: string) {
                if (blockInstallationId !== id) {
                    logMessage({
                        type:
                            DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_NEW_BLOCK_INSTALLATION,
                    });
                    blockInstallationId = id;
                }
            },
        };

        const logBuildState = () => {
            const buildState = producer.buildState;
            switch (buildState.status) {
                case BuildStatus.BUILDING:
                    this.log('Updating bundle...');
                    break;
                case BuildStatus.ERROR:
                    this.log(buildState.error.message);
                    break;
                case BuildStatus.READY:
                    this.log('Bundle updated');
                    break;
                case BuildStatus.START:
                    break;
                default:
                    throw spawnUnexpectedError(
                        'Tried logging unknown buildState: %s',
                        (buildState as BuildState).status,
                    );
            }
            producer.buildStateDefer.promise.then(logBuildState);
        };
        producer.buildStateDefer.promise.then(logBuildState);

        const devServer = await Promise.race([
            createServerAsync(this.system, {
                frameRouteOptions,
                serverPort,
                secureServerPort,
            }),
            appConfigModifiedPromise,
        ]);
        this._devServer = devServer;
        debug('server bound to (http) %s and (https) %s', serverPort, secureServerPort);

        this._appTemporaryPath = this.system.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await Promise.race([
            mkdirpAsync(this.system, this._appTemporaryPath),
            appConfigModifiedPromise,
        ]);
        debug('created temporary directory');

        const entryPointPath = this.system.path.join(this._appTemporaryPath, 'index.js');
        const userEntryPoint = this.system.path.join(appRootPath, appConfig.frontendEntry);
        const entryPoint = await Promise.race([
            renderEntryPointAsync(this.system, {
                mode: 'development',
                destination: entryPointPath,
                userEntryPoint,
                blockBaseUrl: `https://localhost:${secureServerPort}`,
            }),
            appConfigModifiedPromise,
        ]);
        await Promise.race([
            this.system.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint)),
            appConfigModifiedPromise,
        ]);
        debug(
            'wrote generated entry file at %s',
            this.system.path.relative(this.system.process.cwd(), entryPointPath),
        );

        const task = await Promise.race([
            createRunTaskAsync(
                this.system,
                {module: appConfig.bundler?.module, workingdir: appRootPath},
                producer,
            ),
            appConfigModifiedPromise,
        ]);
        this._task = task;

        await Promise.race([producer.readyDefer, appConfigModifiedPromise]);
        debug('created task');

        const bundlerPort = await Promise.race([findPortAsync(0), appConfigModifiedPromise]);
        await Promise.race([
            task.startDevServerAsync({
                port: bundlerPort,
                liveReload: {
                    https: true,
                    port: secureServerPort,
                },

                mode: 'development',
                context: appRootPath,
                entry: entryPointPath,
            }),
            appConfigModifiedPromise,
        ]);
        debug('started bundler dev server');

        const devProxyServer = await Promise.race([
            devServer.proxyFrontendAsync(`localhost:${bundlerPort}`),
            appConfigModifiedPromise,
        ]);
        this._devServer = devProxyServer;
        debug('proxying to frontend bundler (http) %s', bundlerPort);

        this.log(`Server listening at https://localhost:${secureServerPort}`);

        const sigintPromise = new Promise<void>(resolve => {
            process.once('SIGINT', () => {
                resolve();
            });
        });

        try {
            await Promise.race([
                clipboardy.write(`https://localhost:${secureServerPort}`),
                appConfigModifiedPromise,
            ]);
            this.log(`https://localhost:${secureServerPort} has been copied to your clipboard`);
        } catch (error) {
            debug(`failed to write to clipboard: ${error}`);
        }

        await Promise.race([sigintPromise, appConfigModifiedPromise]);
    }

    async finallyAsync() {
        await Promise.all([
            this._appTemporaryPath ? rmdirAsync(this.system, this._appTemporaryPath) : null,
            this._task ? this._task.teardownAsync() : null,
            this._devServer ? this._devServer.closeAsync() : null,
        ]);
    }
}
