import {Server} from 'net';
import {promisify} from 'util';

import {cli} from 'cli-ux';

import {invariant, spawnError} from './error_utils';

export async function promptForPortAsync(usedPort: number) {
    return await cli.prompt(
        `Port ${usedPort} is used. What port should the server listen on? [${usedPort + 2}]`,
        {
            default: String(usedPort + 2),
        },
    );
}

interface FindPortOptions {
    adjacentPorts?: number;
}

async function bindPortAsync(port: number): Promise<number> {
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
    const {adjacentPorts = 0} = options;

    try {
        const resolvedPort = await bindPortAsync(port);
        if (adjacentPorts > 0) {
            await Promise.all(
                Array.from({length: adjacentPorts}, (value, index) =>
                    bindPortAsync(resolvedPort + index),
                ),
            );
        }

        return port;
    } catch (err) {
        // If there was an error due to the port being taken, prompt for an
        // alternative port and try again.
        if (err.code === 'EADDRINUSE') {
            const result = await promptForPortAsync(port);
            if (Number.isNaN(result.value) || typeof result.value !== 'number') {
                throw spawnError('Invalid port number');
            }
            // Set our port and re-enter the loop.
            port = Number(result.value);
            return await findPortAsync(port, options);
        } else {
            // Rethrow the error.
            throw err;
        }
    }
}
