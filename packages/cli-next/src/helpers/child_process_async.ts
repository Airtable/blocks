import childProcess from 'child_process';
import {Transform, Writable} from 'stream';

import _debug from 'debug';
import crossSpawn from 'cross-spawn';

import {invariant, spawnUnexpectedError} from './error_utils';
import {System} from './system';

interface ChildProcessEnv {
    [key: string]: any;
}
interface ChildProcessOptions {
    env?: ChildProcessEnv;
    cwd?: string;
}

export function* lines(chunk: unknown) {
    if (chunk === null || chunk === undefined || (Array.isArray(chunk) && chunk.length === 0)) {
        return;
    }

    let chunkAsString;
    if (Buffer.isBuffer(chunk)) {
        invariant(chunk instanceof Buffer, 'expected chunk to be Buffer');
        chunkAsString = chunk.toString('utf8');
    } else if (typeof chunk === 'string') {
        chunkAsString = chunk;
    } else {
        chunkAsString = JSON.stringify(chunk);
    }

    invariant(typeof chunkAsString === 'string', 'expect chunkAsString to be string');
    yield* chunkAsString.split(/(\n)/);
}

export function createLineStream() {
    return new Transform({
        transform(chunk, encoding, callback) {
            for (const line of lines(chunk)) {
                this.push(line);
            }
            callback();
        },
    });
}

export function createDebugStream(debug: ReturnType<typeof _debug>) {
    return new Writable({
        write(chunk, encoding, callback) {
            debug(chunk);
            callback();
        },
    });
}

function ensureCleanExit(child: childProcess.ChildProcess): void {
    const killChild = () => {
        child.kill();
    };

    process.addListener('exit', killChild);
    child.once('exit', () => {
        process.removeListener('exit', killChild);
    });
}

export function resolveChildExit(child: childProcess.ChildProcess) {
    return new Promise<void>((resolve, reject) => {
        const childExit = (exitCode: number | null) => {
            child.removeListener('exit', childExit);
            if (exitCode === 0) {
                resolve();
            } else {
                reject(spawnUnexpectedError('Process exit with error %s', exitCode));
            }
        };

        child.addListener('exit', childExit);
    });
}

export function fork(
    sys: System,
    modulePath: string,
    args: string[] = [],
    {
        env = sys.process.env,
        cwd = sys.process.cwd(),
        execArgv = [],
    }: ChildProcessOptions & {execArgv?: string[]} = {},
): childProcess.ChildProcess {
    const child = childProcess.fork(modulePath, args, {
        stdio: 'pipe',
        cwd,
        env,
        execArgv,
    });

    ensureCleanExit(child);

    return child;
}

/**
 * For cross-OS compatibility, this method wraps the 3rd-party 'cross-spawn.sync()' method instead
 * of node's native child_process.spawnSync(). Essentially, all the workable options for using the
 * node's 'child_process' lib with Windows requires us to sanitize the inputs, which is tricky
 * because there are many edge cases. The 'cross-spawn' lib handles some args escaping and
 * processing for us.
 *
 * NOTE: This wraps the 'cross-spawn.sync()' method instead of the asynchronous
 * 'cross-spawn.spawn()' to simplify implementation - callers of this method should only care about
 * the results of the spawn execution after the child process has fully closed.
 *
 * CAUTION: This is potentially vulnerable to command injection attacks, especially on Windows OS
 * if it deals with user inputs in the 'args' parameter. Therefore, extra protection is required
 * if handling user inputs in the 'args' parameter (i.e. implement an allow-list, etc.).
 * Currently, we indirectly deal with user inputs in only one case - when handling the user's
 * block code directory name for transpilation in `block_builder.js` (i.e. the user could
 * potentially inject content into their directory path name, but this is difficult to do due to
 * reserved character restrictions in directory names for Windows).
 *
 * FAQ:
 * - Why doesn't using child_process.execFile() suffice, if it mitigates against bad args?
 *   Windows OS does NOT support executing child_process.execFile() on a single '.cmd' or '.bat'
 *   file. There are undocumented ways to use child_process.execFile() on Windows, but each option
 *   makes usage vulnerable to command injection:
 *   (1) Use child_process.execFile() for a single '.cmd|bat' file with the '{shell: true}' option.
 *       From the node docs: "If the shell option is enabled, do not pass unsanitized user input
 *       to this function."
 *       src: https://nodejs.org/dist/latest-v12.x/docs/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows).
 *   (2) Use child_process.execFile() with the cmd.exe process itself, then pass in the '.cmd|bat'
 *       file as the args for execution. This spawns the actual Command Prompt process (which is
 *       essentially like passing in the '{shell: true}' option).
 * - Why not always use child_process.spawn()?
 *   Similar to the options above, for Windows compatibility we have to pass in the '{shell: true}'
 *   option when using child_process.spawn(), which puts us at risk against command injection.
 *
 * Also see:
 * - https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d
 *   "Prefer using child_process.execFile which by definition will only execute a single command
 *   with a set of attributes and will not allow shell parameter expansion." The exception is
 *   Windows, as explained above.
 * - https://www.oreilly.com/library/view/securing-node-applications/9781491982426/ch01.html
 *   "Although execFile or spawn are safer alternatives to exec, these methods cannot completely
 *   prevent command injection... When writing the validation logic, use a whitelist approach..."
 */
export function dangerouslyCrossSpawn(
    sys: System,
    filePath: string,
    args: Array<string>,
    {env = sys.process.env, cwd = sys.process.cwd()}: ChildProcessOptions = {},
) {
    const child = crossSpawn.spawn(filePath, args, {stdio: 'pipe', env, cwd});

    ensureCleanExit(child);

    return child;
}
