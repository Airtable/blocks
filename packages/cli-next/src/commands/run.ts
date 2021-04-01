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
    findAppConfigPathAsync,
    findAppDirectoryAsync,
    readAppConfigAsync,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {dirExistsAsync, mkdirpAsync, rmdirAsync} from '../helpers/system_extra';
import {Deferred} from '../helpers/deferred';
import {spawnUnexpectedError, spawnUserError} from '../helpers/error_utils';
import {RunTaskConsumerAdapter} from '../manager/run_adapter';
import {BuildErrorInfo, BuildErrorName} from '../helpers/build_messages';

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
    };

    async runAsync() {
        const {flags} = this.parse(Run);

        // load app config
        const appRootPath = await findAppDirectoryAsync(this.system, this.system.process.cwd());
        const nodeModulesPath = this.system.path.join(appRootPath, 'node_modules');
        if (!(await dirExistsAsync(this.system, nodeModulesPath))) {
            throw spawnUserError<BuildErrorInfo>({
                type: BuildErrorName.BUILD_NODE_MODULES_ABSENT,
                appRootPath: this.system.path.relative(this.system.process.cwd(), appRootPath),
            });
        }

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
                    throw spawnUnexpectedError(
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
        this._appTemporaryPath = this.system.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(this.system, this._appTemporaryPath);
        debug('created temporary directory');

        // write entry point to disk
        const entryPointPath = this.system.path.join(this._appTemporaryPath, 'index.js');
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
        const task = await createRunTaskAsync(
            this.system,
            {module: appConfig.bundler?.module, workingdir: appRootPath},
            producer,
        );
        this._task = task;

        await producer.readyDefer;
        debug('created task');

        // listen for port from bundler
        // `findPortAsync` selects a random port when invoked with `0`
        const bundlerPort = await findPortAsync(0);
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

        // Bind to the signal prior to writing to the system clipboard. This
        // ensures that the system receives signals that are sent while it is
        // writing to the clipboard (a case which is unlikely in real-world
        // settings but highly likely during automated testing).
        const sigintPromise = new Promise<void>(resolve => {
            process.once('SIGINT', () => {
                resolve();
            });
        });

        try {
            await clipboardy.write(`https://localhost:${secureServerPort}`);
            this.log(`https://localhost:${secureServerPort} has been copied to your clipboard`);
        } catch (error) {
            debug(`failed to write to clipboard: ${error}`);
        }

        await sigintPromise;
    }

    async finallyAsync() {
        await Promise.all([
            this._appTemporaryPath ? rmdirAsync(this.system, this._appTemporaryPath) : null,
            this._task ? this._task.teardownAsync() : null,
            this._devServer ? this._devServer.closeAsync() : null,
        ]);
    }
}
