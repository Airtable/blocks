import {createLineStream, dangerouslyCrossSpawn, resolveChildExit} from './child_process_async';
import {System} from './system';

export async function getGitHashAsync(sys: System, cwd: string): Promise<string | null> {
    try {
        const child = dangerouslyCrossSpawn(sys, 'git', ['rev-parse', 'HEAD'], {
            cwd,
        });
        const lineStream = createLineStream();
        child.stdout.pipe(lineStream);
        await resolveChildExit(child);
        return lineStream
            .read()
            .toString()
            .trim();
    } catch (e) {
        return null;
    }
}
