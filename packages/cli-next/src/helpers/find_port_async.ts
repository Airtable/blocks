import {Server} from 'net';
import {promisify} from 'util';

import {cli} from './cli_ux';

import {invariant, spawnUserError} from './error_utils';

export enum FindPortErrorName {
    FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER = 'findPortAsyncPortIsNotNumber',
}

export interface FindPortErrorPortIsNotNumber {
    type: FindPortErrorName.FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER;
    port: string;
}

export type FindPortErrorInfo = FindPortErrorPortIsNotNumber;

interface FindPortOptions {
    adjacentPorts?: number;
    promptForPortAsync?(usedPort: number): Promise<string | number>;
    bindPortAsync?(port: number): Promise<number>;
}

export async function defaultPromptForPortAsync(usedPort: number): Promise<string> {
    return await cli.prompt(
        `Port ${usedPort} is used. What port should the server listen on? [${usedPort + 2}]`,
        {
            default: String(usedPort + 2),
        },
    );
}

export async function defaultBindPortAsync(port: number): Promise<number> {
    const server = new Server();
    await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, resolve);
    });
    try {
        const address = server.address();
        invariant(
            typeof address === 'object' && address !== null,
            'server must be listening to an ip address',
        );
        return address.port;
    } finally {
        await promisify(server.close.bind(server))();
    }
}

export async function findPortAsync(port: number, options: FindPortOptions = {}): Promise<number> {
    const {
        adjacentPorts = 0,
        promptForPortAsync = defaultPromptForPortAsync,
        bindPortAsync = defaultBindPortAsync,
    } = options;

    try {
        const resolvedPort = await bindPortAsync(port);
        if (adjacentPorts > 0) {
            await Promise.all(
                Array.from({length: adjacentPorts}, (value, index) =>
                    bindPortAsync(resolvedPort + index + 1),
                ),
            );
        }

        return resolvedPort;
    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            const result = await promptForPortAsync(port);
            port = Number(result);
            if (Number.isNaN(port)) {
                throw spawnUserError<FindPortErrorInfo>({
                    type: FindPortErrorName.FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER,
                    port: result as string,
                });
            }
            return await findPortAsync(port, options);
        } else {
            throw err;
        }
    }
}
