import {spawnError} from './error_utils';

export interface DevelopmentProxyServerInterface {
    listenAsync(port: number, securePort: number): Promise<[number, number]>;
    proxyFrontendAsync(remoteAddress: string): Promise<void>;
    closeAsync(): Promise<void>;
}

class DevelopmentProxyServer implements DevelopmentProxyServerInterface {
    async listenAsync(port: number, securePort: number): Promise<[number, number]> {
        throw spawnError('not implemented');
    }

    async proxyFrontendAsync(remoteAddress: string) {
        throw spawnError('not implemented');
    }

    async closeAsync() {
        throw spawnError('not implemented');
    }
}

export function createServer(): DevelopmentProxyServerInterface {
    return new DevelopmentProxyServer();
}
