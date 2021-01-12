import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';

import {APP_ROOT_TEMPORARY_DIR} from '../settings';
import {createRunTaskAsync} from '../manager/run';
import {RunTaskConsumer} from '../tasks/run';

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

const debug = _debug('block-cli:command:run');

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

        // find our ports
        const secureServerPort = await findPortAsync(flags.port, {
            adjacentPorts: 1,
        });
        const serverPort = secureServerPort + 1;

        // start https server
        const devServer = await createServerAsync({
            serverPort,
            secureServerPort,
        });
        this._devServer = devServer;
        debug('server bound to (http) %s and (https) %s', serverPort, secureServerPort);

        // fork runner process
        const task = await createRunTaskAsync(this.system);
        this._task = task;
        debug('created task');
        // call entry with ipc api
        await task.initAsync({
            mode: 'development',
        });
        debug('initialized task');

        // pick a temporary directory to write the entry point to
        const appTemporaryPath = this.system.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(this.system, appTemporaryPath);
        debug('created temporary directory');

        // write entry point to disk
        const entryPointPath = this.system.path.join(appTemporaryPath, 'index.js');
        const userEntryPoint = this.system.path.join(appRootPath, appConfig.frontendEntry);
        const entryPoint = await renderEntryPointAsync(this.system, {
            destination: entryPointPath,
            userEntryPoint,
        });
        await this.system.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint));
        debug(
            'wrote generated entry file at %s',
            this.system.path.relative(this.system.process.cwd(), entryPointPath),
        );

        // start bundling
        await task.startBundlingAsync({
            entry: entryPointPath,
        });
        debug('started bundler');

        // listen for port from bundler
        const freeBundlerPort = await findPortAsync(flags.bundlerPort);
        await task.startDevServerAsync({
            port: freeBundlerPort,
        });

        // get the port bundler is actually using
        const bundlerPort = await task.getDevServerPortAsync();
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
