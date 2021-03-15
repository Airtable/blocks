import _debug from 'debug';

import {
    createDebugStream,
    createLineStream,
    dangerouslyCrossSpawn,
    resolveChildExit,
} from './child_process_async';
import {System} from './system';

const debug = _debug('block-cli:npm');

export async function installAsync(sys: System, cwd: string) {
    const child = dangerouslyCrossSpawn(sys, 'npm', ['install', '--loglevel=error'], {
        cwd: cwd ?? sys.process.cwd(),
    });
    if (child.stdout) {
        child.stdout.pipe(createLineStream()).pipe(createDebugStream(debug.extend('stdout')));
    }
    if (child.stderr) {
        child.stderr.pipe(createLineStream()).pipe(createDebugStream(debug.extend('stderr')));
    }
    await resolveChildExit(child);
}
