import {dangerouslyCrossSpawnAndReturnTrimmedOutputAsync} from './child_process_async';
import {System} from './system';

export async function getGitHashAsync(sys: System, cwd: string): Promise<string | null> {
    try {
        const gitHash = await dangerouslyCrossSpawnAndReturnTrimmedOutputAsync(
            sys,
            'git',
            ['rev-parse', 'HEAD'],
            {cwd},
        );
        return gitHash;
    } catch (e) {
        return null;
    }
}
