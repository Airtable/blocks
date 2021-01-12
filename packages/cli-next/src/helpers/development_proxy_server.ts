import {AddressInfo} from 'net';
import {createServer as createHTTPServer, Server as InsecureServer} from 'http';
import {createServer as createHTTPSServer, Server as SecureServer} from 'https';
import {promisify} from 'util';

import {createCertificate} from 'pem';
import createApp, {Express} from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

import {invariant, spawnError} from './error_utils';

function ipPort(value: AddressInfo | string | null) {
    if (typeof value === 'object' && value !== null) {
        return value.port;
    }
    throw spawnError('Server must be bound to an Internet Protocol address');
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

    async proxyFrontendAsync(remoteAddress: string): Promise<DevelopmentProxyServerInterface> {
        const {app, server, secureServer} = this;
        this.app = null;
        invariant(app, 'dev server must have an express app to proxy');
        invariant(server && secureServer, 'dev server must have ready servers');

        // Configure a HTTP and WebSocket proxy to a remote address.
        const proxy = createProxyMiddleware(`http://${remoteAddress}`, {
            ws: true,
            logLevel: 'error',
        });
        invariant(proxy.upgrade, 'http proxy must have an upgrade handler');
        app.use(proxy);
        server.on('upgrade', proxy.upgrade);
        secureServer.on('upgrade', proxy.upgrade);

        return this;
    }

    async closeAsync() {
        const {server, secureServer} = this;
        this.server = null;
        this.secureServer = null;
        await closeAsync(server);
        await closeAsync(secureServer);
    }
}

export async function createServerAsync({
    serverPort,
    secureServerPort,
}: DevelopmentProxyServerOptions): Promise<DevelopmentServerInterface> {
    let server = null;
    let secureServer = null;
    try {
        const app = createApp();

        // Start a HTTP server.
        server = await listenAsync(createHTTPServer(app), serverPort);

        // Create self signed cryptography keys.
        const keys = await (promisify(createCertificate) as any)({days: 1, selfSigned: true});

        // Start a HTTP over TLS Server
        secureServer = await listenAsync(
            createHTTPSServer({key: keys.clientKey, cert: keys.certificate}, app),
            secureServerPort,
        );

        return new DevelopmentProxyServer(app, server, secureServer);
    } catch (err) {
        await closeAsync(server);
        await closeAsync(secureServer);
        throw err;
    }
}
