const childProcess = require('child_process');

function ensureCleanExit(child, name) {
    const killChild = () => {
        console.log(`Stopping ${name}`);
        child.kill();
    };

    process.addListener('exit', killChild);
    child.once('exit', () => {
        process.removeListener('exit', killChild);
    });
}

module.exports = function runCommandAsync(
    filePath,
    args,
    {env = process.env, cwd = process.cwd()} = {},
) {
    return new Promise((resolve, reject) => {
        const child = childProcess.execFile(
            filePath,
            args,
            {stdio: 'pipe', env, cwd},
            (err, stdout, stderr) => {
                if (err) {
                    console.log({stdout, stderr});
                    reject(err);
                } else {
                    resolve({
                        stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
                        stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8'),
                    });
                }
            },
        );

        ensureCleanExit(child, filePath);
    });
};
