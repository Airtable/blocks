// @flow
const childProcess = require('child_process');
const crossSpawn = require('cross-spawn');
const invariant = require('invariant');
const chalk = require('chalk');

type ChildProcessEnv = {[string]: ?string};
type ChildProcessOptions = {|
    env?: ChildProcessEnv,
    cwd?: string,
    prefix?: string,
|};

const _formatAndConsoleLogWithPrefix = (chunk: mixed, prefix: string): void => {
    let chunkAsString;
    if (Buffer.isBuffer(chunk)) {
        invariant(chunk instanceof Buffer, 'expected chunk to be Buffer');
        chunkAsString = chunk.toString('utf8');
    } else if (typeof chunk === 'string') {
        chunkAsString = chunk;
    } else if (chunk === null || chunk === undefined) {
        chunkAsString = '';
    } else {
        chunkAsString = JSON.stringify(chunk);
    }

    if (chunkAsString === '') {
        return undefined;
    }

    invariant(typeof chunkAsString === 'string', 'expect chunkAsString to be string');
    return (
        chunkAsString
            .replace(/\n$/, '')
            .split('\n')
            // eslint-disable-next-line no-console
            .forEach(line => console.log(`${prefix} ${line}`))
    );
};
const pipeStdio = (pipe: stream$Readable, prefix: string): void => {
    pipe.on('data', (chunk: mixed) => _formatAndConsoleLogWithPrefix(chunk, prefix));
};

const pipeChildProcessWithPrefix = (child: childProcess.ChildProcess, prefix: string): void => {
    pipeStdio(child.stdout, chalk.blue(`[${prefix}]`));
    pipeStdio(child.stderr, chalk.yellow(`[${prefix}]`));
};

function ensureCleanExit(child: childProcess.ChildProcess, name: string): void {
    const killChild = () => {
        // eslint-disable-next-line no-console
        console.log(`Stopping ${name}`);
        child.kill();
    };

    process.addListener('exit', killChild);
    child.once('exit', () => {
        process.removeListener('exit', killChild);
    });
}

function fork(
    modulePath: string,
    {
        env = process.env,
        cwd = process.cwd(),
        prefix = modulePath,
        execArgv = [],
    }: {|...ChildProcessOptions, execArgv?: Array<string>|} = {},
): childProcess.ChildProcess {
    const child = childProcess.fork(modulePath, {
        stdio: 'pipe',
        cwd,
        env,
        execArgv,
    });

    ensureCleanExit(child, prefix);
    pipeChildProcessWithPrefix(child, prefix);
    return child;
}

/**
 * For cross-OS compatibility, this method wraps the 3rd-party 'cross-spawn.sync()' method instead
 * of node's native child_process.spawnSync(). Essentially, all the workable options for using the
 * node's 'child_process' lib with Windows requires us to sanitize the inputs, which is tricky
 * because there are many edge cases. The cross-spawn' lib handles some args escaping and
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
function dangerouslyCrossSpawnAsync(
    filePath: string,
    args: Array<string>,
    {env = process.env, cwd = process.cwd(), prefix = filePath}: ChildProcessOptions = {},
): Promise<{stdout: string, stderr: string}> {
    return new Promise((resolve, reject) => {
        const spawnResult = crossSpawn.sync(filePath, args, {stdio: 'pipe', env, cwd});
        const {err, stdout, stderr} = spawnResult;

        if (err) {
            reject(err);
        } else {
            _formatAndConsoleLogWithPrefix(stdout, chalk.blue(`[${prefix}]`));
            _formatAndConsoleLogWithPrefix(stderr, chalk.yellow(`[${prefix}]`));
            resolve({
                stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
                stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8'),
            });
        }
    });
}

/**
 * CAUTION: Take care using this method because there are issues with cross-OS compatibility.
 * Additional work is required to securely use this method with Windows OS.
 * Instead, consider using dangerouslyCrossSpawnAsync() method if cross-OS support is needed.
 *
 * see: https://nodejs.org/dist/latest-v12.x/docs/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
 */
function _spawn(
    filePath: string,
    args: Array<string>,
    {env = process.env, cwd = process.cwd(), prefix = filePath}: ChildProcessOptions = {},
): childProcess.ChildProcess {
    const child = childProcess.spawn(filePath, args, {stdio: 'pipe', env, cwd});
    ensureCleanExit(child, prefix);
    pipeChildProcessWithPrefix(child, prefix);
    return child;
}

/**
 * CAUTION: Take care using this method because there are issues with cross-OS compatibility.
 * Additional work is required to securely use this method with Windows OS.
 * Instead, consider using dangerouslyCrossSpawnAsync() method if cross-OS support is needed.
 *
 * see: https://nodejs.org/dist/latest-v12.x/docs/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
 */
function _execFileAsync(
    filePath: string,
    args: Array<string>,
    {env = process.env, cwd = process.cwd(), prefix = filePath}: ChildProcessOptions = {},
): Promise<{stdout: string, stderr: string}> {
    return new Promise((resolve, reject) => {
        const child = childProcess.execFile(
            filePath,
            args,
            {stdio: 'pipe', env, cwd},
            (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
                        stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8'),
                    });
                }
            },
        );

        ensureCleanExit(child, prefix);
        pipeChildProcessWithPrefix(child, prefix);
    });
}

const childProcessHelpers = {
    fork,
    dangerouslyCrossSpawnAsync,
    _internal: {
        _spawn,
        _execFileAsync,
    },
};

module.exports = childProcessHelpers;
