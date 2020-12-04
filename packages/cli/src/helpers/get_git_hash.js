// @flow
import {dangerouslyCrossSpawnAsync} from './child_process_helpers';

export async function getGitHashAsync(cwd: string) {
    try {
        return (
            await dangerouslyCrossSpawnAsync('git', ['rev-parse', 'HEAD'], {
                cwd,
                displayOutput: false,
            })
        ).stdout.trim();
    } catch (e) {
        return null;
    }
}
