import {AddressInfo} from 'net';
import {createServer as createHTTPServer, Server as InsecureServer} from 'http';
import {createServer as createHTTPSServer, Server as SecureServer} from 'https';
import {promisify} from 'util';

import createApp, {Express} from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

import _debug from 'debug';

import {invariant, spawnUnexpectedError} from './error_utils';
import {System} from './system';
import {Result} from './result';
import {createRunFrameRoutes, RunFrameRouteOptions} from './development_run_frame_routes';

const debug = _debug('blocks-cli:dev_server');

function ipPort(value: AddressInfo | string | null) {
    if (typeof value === 'object' && value !== null) {
        return value.port;
    }
    throw spawnUnexpectedError('Server must be bound to an Internet Protocol address');
}

async function closeAsync(server: InsecureServer | SecureServer | null): Promise<void> {
    if (server) {
        await promisify(server.close.bind(server))();
    }
}

async function listenAsync<T extends InsecureServer | SecureServer>(
    server: T,
    port: number,
): Promise<T> {
    try {
        await new Promise<void>((resolve, reject) => {
            server.once('error', reject);
            server.listen(port, resolve);
        });
        invariant(ipPort(server.address()) === port, 'server must be listening on port %d', port);
        return server;
    } catch (err) {
        await closeAsync(server);
        throw err;
    }
}

export interface DevelopmentProxyServerOptions {
    frameRouteOptions: RunFrameRouteOptions;
    serverPort: number;
    secureServerPort: number;
}

export interface DevelopmentServerInterface {
    proxyFrontendAsync(remoteAddress: string): Promise<DevelopmentProxyServerInterface>;
    closeAsync(): Promise<void>;
}

export interface DevelopmentProxyServerInterface {
    closeAsync(): Promise<void>;
}

class DevelopmentProxyServer implements DevelopmentServerInterface {
    app: Express | null;
    server: InsecureServer | null;
    secureServer: SecureServer | null;

    constructor(app: Express, server: InsecureServer, secureServer: SecureServer) {
        this.app = app;
        this.server = server;
        this.secureServer = secureServer;
    }

    /**
     * Determine whether logging messages should be discarded.
     */
    get isSilenced() {
        return this.server === null;
    }

    async proxyFrontendAsync(remoteAddress: string): Promise<DevelopmentProxyServerInterface> {
        const {app, server, secureServer} = this;
        this.app = null;
        invariant(app, 'dev server must have an express app to proxy');
        invariant(server && secureServer, 'dev server must have ready servers');

        const proxy = createProxyMiddleware(`http://${remoteAddress}`, {
            ws: true,
            logLevel: 'error',

            logProvider: provider => {
                return {
                    log: this.wrapLogFn(provider.log),
                    debug: this.wrapLogFn(provider.debug),
                    info: this.wrapLogFn(provider.info),
                    warn: this.wrapLogFn(provider.warn),
                    error: this.wrapLogFn(provider.error),
                };
            },
        });
        invariant(proxy.upgrade, 'http proxy must have an upgrade handler');
        app.use(proxy);
        server.on('upgrade', proxy.upgrade);
        secureServer.on('upgrade', proxy.upgrade);

        return this;
    }

    /**
     * Given a logging function, create a second function which only calls the
     * first if this instance has not been "silenced."
     */
    private wrapLogFn(logFn?: (...args: Array<any>) => void) {
        const that = this;

        if (!logFn) {
            return () => {};
        }

        return function(this: any, ...args: Array<any>) {
            if (that.isSilenced) {
                return;
            }

            logFn.apply(this, args);
        };
    }

    async closeAsync() {
        const {server, secureServer} = this;
        this.server = null;
        this.secureServer = null;
        await closeAsync(server);
        await closeAsync(secureServer);
    }
}

interface Keys {
    key: any;
    cert: any;
}

async function readPackageKeysAsync(sys: System): Promise<Result<Keys>> {
    try {
        const keysDir = sys.path.join(sys.path.dirname(sys.path.dirname(__dirname)), 'keys');
        return {
            value: {
                key: (
                    await sys.fs.readFileAsync(sys.path.join(keysDir, 'server.key'), 'utf8')
                ).toString(),
                cert: (
                    await sys.fs.readFileAsync(sys.path.join(keysDir, 'server.crt'), 'utf8')
                ).toString(),
            },
        };
    } catch (err) {
        return {err};
    }
}

async function findKeysAsync(sys: System) {
    const packageKeys = await readPackageKeysAsync(sys);
    if (packageKeys.value) {
        return {
            ...packageKeys.value,
            source: 'package',
        };
    }

    throw packageKeys.err;
}

export async function createServerAsync(
    sys: System,
    {frameRouteOptions, serverPort, secureServerPort}: DevelopmentProxyServerOptions,
): Promise<DevelopmentServerInterface> {
    let server = null;
    let secureServer = null;
    try {
        const app = createApp();

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        app.use('/__runFrame', createRunFrameRoutes(frameRouteOptions));

        server = await listenAsync(createHTTPServer(app), serverPort);

        const {source, ...keys} = await findKeysAsync(sys);
        debug('using %s keys (%d, %d)', source, keys.key.length, keys.cert.length);

        secureServer = await listenAsync(createHTTPSServer(keys, app), secureServerPort);

        return new DevelopmentProxyServer(app, server, secureServer);
    } catch (err) {
        await closeAsync(server);
        await closeAsync(secureServer);
        throw err;
    }
}
