"use strict";
var childProcess = require('child_process');
var chalk = require('chalk');








var pipeStdio = function pipeStdio(pipe, prefix) {
  pipe.on('data', function (chunk) {return (
      chunk.
      toString('utf-8').
      replace(/\n$/, '').
      split('\n')
      // eslint-disable-next-line no-console
      .forEach(function (line) {return console.log("".concat(prefix, " ").concat(line));}));});

};

var pipeChildProcessWithPrefix = function pipeChildProcessWithPrefix(child, prefix) {
  pipeStdio(child.stdout, chalk.blue("[".concat(prefix, "]")));
  pipeStdio(child.stderr, chalk.yellow("[".concat(prefix, "]")));
};

function fork(
modulePath)






{var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},_ref$env = _ref.env,env = _ref$env === void 0 ? process.env : _ref$env,_ref$cwd = _ref.cwd,cwd = _ref$cwd === void 0 ? process.cwd() : _ref$cwd,_ref$prefix = _ref.prefix,prefix = _ref$prefix === void 0 ? modulePath : _ref$prefix,_ref$execArgv = _ref.execArgv,execArgv = _ref$execArgv === void 0 ? [] : _ref$execArgv;
  var child = childProcess.fork(modulePath, {
    stdio: 'pipe',
    cwd: cwd,
    env: env,
    execArgv: execArgv });


  pipeChildProcessWithPrefix(child, prefix);
  return child;
}

function spawn(
filePath,
args)

{var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},_ref2$env = _ref2.env,env = _ref2$env === void 0 ? process.env : _ref2$env,_ref2$cwd = _ref2.cwd,cwd = _ref2$cwd === void 0 ? process.cwd() : _ref2$cwd,_ref2$prefix = _ref2.prefix,prefix = _ref2$prefix === void 0 ? filePath : _ref2$prefix;
  var child = childProcess.spawn(filePath, args, { stdio: 'pipe', env: env, cwd: cwd });
  pipeChildProcessWithPrefix(child, prefix);
  return child;
}

function execFileAsync(
filePath,
args)

{var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},_ref3$env = _ref3.env,env = _ref3$env === void 0 ? process.env : _ref3$env,_ref3$cwd = _ref3.cwd,cwd = _ref3$cwd === void 0 ? process.cwd() : _ref3$cwd,_ref3$prefix = _ref3.prefix,prefix = _ref3$prefix === void 0 ? filePath : _ref3$prefix;
  return new Promise(function (resolve, reject) {
    var child = childProcess.execFile(
    filePath,
    args,
    { stdio: 'pipe', env: env, cwd: cwd },
    function (err, stdout, stderr) {
      if (err) {
        reject(err);
      } else {
        resolve({
          stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
          stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8') });

      }
    });


    pipeChildProcessWithPrefix(child, prefix);
  });
}

var childProcessHelpers = {
  fork: fork,
  spawn: spawn,
  execFileAsync: execFileAsync };


module.exports = childProcessHelpers;