// @flow
const childProcess = require('child_process');
const chalk = require('chalk');

type ChildProcessEnv = {[string]: ?string};
type ChildProcessOptions = {|
    env?: ChildProcessEnv,
    cwd?: string,
    prefix?: string,
|};

const pipeStdio = (pipe, prefix) => {
    pipe.on('data', chunk =>
        chunk
            .toString('utf-8')
            .replace(/\n$/, '')
            .split('\n')
            // eslint-disable-next-line no-console
            .forEach(line => console.log(`${prefix} ${line}`)),
    );
};

const pipeChildProcessWithPrefix = (child, prefix) => {
    pipeStdio(child.stdout, chalk.blue(`[${prefix}]`));
    pipeStdio(child.stderr, chalk.yellow(`[${prefix}]`));
};

function ensureCleanExit(child: childProcess.ChildProcess, name: string) {
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

function spawn(
    filePath: string,
    args: Array<string>,
    {env = process.env, cwd = process.cwd(), prefix = filePath}: ChildProcessOptions = {},
): childProcess.ChildProcess {
    const child = childProcess.spawn(filePath, args, {stdio: 'pipe', env, cwd});
    ensureCleanExit(child, prefix);
    pipeChildProcessWithPrefix(child, prefix);
    return child;
}

function execFileAsync(
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
    spawn,
    execFileAsync,
};

module.exports = childProcessHelpers;
