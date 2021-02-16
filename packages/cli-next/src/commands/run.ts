import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';

import {APP_ROOT_TEMPORARY_DIR} from '../settings';
import {createRunTaskAsync} from '../manager/run';
import {
    BuildState,
    BuildStateBuilt,
    BuildStateError,
    BuildStatus,
    RunTaskConsumer,
    RunTaskConsumerChannel,
    RunTaskProducer,
} from '../tasks/run';

import AirtableCommand from '../helpers/airtable_command';
import {findPortAsync} from '../helpers/find_port_async';
import {
    createServerAsync,
    DevelopmentProxyServerInterface,
} from '../helpers/development_proxy_server';
import {
    findAppConfigPathAsync,
    findAppDirectoryAsync,
    readAppConfigAsync,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {mkdirpAsync} from '../helpers/system_extra';
import {Deferred} from '../helpers/deferred';
import {spawnError} from '../helpers/error_utils';

const debug = _debug('block-cli:command:run');

class RunProducer implements RunTaskProducer {
    readyDefer = new Deferred<void>();

    buildState: BuildState = {status: BuildStatus.START};
    buildStateDefer = new Deferred<BuildState>();

    async readyAsync() {
        this.readyDefer.resolve();
    }

    async emitBuildStateAsync(buildState: BuildState) {
        this.buildState = buildState;
        const lastDefer = this.buildStateDefer;
        this.buildStateDefer = new Deferred<BuildState>();
        lastDefer.resolve(buildState);
    }
}

class RunConsumer implements RunTaskConsumer {
    consumerChannel: RunTaskConsumerChannel;

    constructor(consumerChannel: RunTaskConsumerChannel) {
        this.consumerChannel = consumerChannel;
    }

    async startDevServerAsync(...args: Parameters<RunTaskConsumer['startDevServerAsync']>) {
        await this.consumerChannel.requestAsync('startDevServerAsync', ...args);
    }

    async teardownAsync() {
        try {
            await this.consumerChannel.requestAsync('teardownAsync');
        } catch (err) {
            // It's ok if the channel closes while tearing down the task.
            if (err && !err.message.includes('channel closed while waiting for response')) {
                throw err;
            }
        }
    }
}

export default class Run extends AirtableCommand {
    private _task?: RunTaskConsumer;
    private _devServer?: DevelopmentProxyServerInterface;

    static description = 'run the app locally';

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

        bundlerPort: commandFlags.integer({
            description: "Port the bundler's server listens on.",
            default: 9090,
        }),
    };

    async runAsync() {
        const {flags} = this.parse(Run);

        // load app config
        const appRootPath = await findAppDirectoryAsync(this.system, this.system.process.cwd());
        const appConfigResult = await readAppConfigAsync(this.system);
        if (appConfigResult.err) {
            this.error(appConfigResult.err);
        }
        const appConfig = appConfigResult.value;
        debug(
            'loaded app config at %s',
            this.system.path.relative(
                this.system.process.cwd(),
                await findAppConfigPathAsync(this.system, this.system.process.cwd()),
            ),
        );

        const producer = new RunProducer();

        // find our ports
        const secureServerPort = await findPortAsync(flags.port, {
            adjacentPorts: 1,
        });
        const serverPort = secureServerPort + 1;

        const frameRouteOptions = {
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
                    throw spawnError(
                        'Tried logging unknown buildState: %s',
                        (buildState as BuildState).status,
                    );
            }
            producer.buildStateDefer.promise.then(logBuildState);
        };
        producer.buildStateDefer.promise.then(logBuildState);

        // start https server
        const devServer = await createServerAsync(this.system, {
            frameRouteOptions,
            serverPort,
            secureServerPort,
        });
        this._devServer = devServer;
        debug('server bound to (http) %s and (https) %s', serverPort, secureServerPort);

        // pick a temporary directory to write the entry point to
        const appTemporaryPath = this.system.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(this.system, appTemporaryPath);
        debug('created temporary directory');

        // write entry point to disk
        const entryPointPath = this.system.path.join(appTemporaryPath, 'index.js');
        const userEntryPoint = this.system.path.join(appRootPath, appConfig.frontendEntry);
        const entryPoint = await renderEntryPointAsync(this.system, {
            mode: 'development',
            destination: entryPointPath,
            userEntryPoint,
            blockBaseUrl: `https://localhost:${secureServerPort}`,
        });
        await this.system.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint));
        debug(
            'wrote generated entry file at %s',
            this.system.path.relative(this.system.process.cwd(), entryPointPath),
        );

        // fork runner process
        const task = new RunConsumer(await createRunTaskAsync(this.system, producer));
        this._task = task;

        await producer.readyDefer;
        debug('created task');

        // listen for port from bundler
        const bundlerPort = await findPortAsync(flags.bundlerPort);
        await task.startDevServerAsync({
            port: bundlerPort,
            liveReload: {
                https: true,
                port: secureServerPort,
            },

            mode: 'development',
            context: appRootPath,
            entry: entryPointPath,
        });
        debug('started bundler dev server');

        // configure proxy
        const devProxyServer = await devServer.proxyFrontendAsync(`localhost:${bundlerPort}`);
        this._devServer = devProxyServer;
        debug('proxying to frontend bundler (http) %s', bundlerPort);

        this.log(`Server listening at https://localhost:${secureServerPort}`);

        await new Promise<void>(resolve => {
            process.once('SIGINT', () => {
                resolve();
            });
        });
    }

    async finallyAsync() {
        await Promise.all([
            this._task ? this._task.teardownAsync() : null,
            this._devServer ? this._devServer.closeAsync() : null,
        ]);
    }
}
