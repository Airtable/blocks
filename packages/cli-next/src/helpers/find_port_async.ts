import {Server} from 'net';
import {promisify} from 'util';

import {cli} from 'cli-ux';

import {invariant, spawnError} from './error_utils';

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
    // Try starting a server on this port.
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
        // If there was an error due to the port being taken, prompt for an
        // alternative port and try again.
        if (err.code === 'EADDRINUSE') {
            const result = await promptForPortAsync(port);
            port = Number(result);
            if (Number.isNaN(port)) {
                throw spawnError('Invalid port number');
            }
            // Set our port and re-enter the loop.
            return await findPortAsync(port, options);
        } else {
            // Rethrow the error.
            throw err;
        }
    }
}
