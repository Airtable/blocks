import {cli} from 'cli-ux';
import {spawnError} from './error_utils';

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

export async function findPortAsync(
    port: number,
    {adjacentPorts = 0}: FindPortOptions = {},
): Promise<number> {
    throw spawnError('not implemented');
}
