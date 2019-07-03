"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var cliHelpers = require('./helpers/cli_helpers');
var commandConfigs = require('./commands/command_configs');
var setUpRollbarAsync = require('./helpers/set_up_rollbar_async');

function registerCommandForConfig(yargs, commandConfig) {
  yargs.command(
  commandConfig.command,
  commandConfig.description,
  function (yargsInner) {
    if (commandConfig.positionalMap) {var _arr =
      Object.keys(commandConfig.positionalMap);for (var _i = 0; _i < _arr.length; _i++) {var positionalName = _arr[_i];
        var positionalConfig = commandConfig.positionalMap[positionalName];
        yargsInner.positional(positionalName, positionalConfig);
      }
    }
    if (commandConfig.optionMap) {var _arr2 =
      Object.keys(commandConfig.optionMap);for (var _i2 = 0; _i2 < _arr2.length; _i2++) {var optionName = _arr2[_i2];
        var optionConfig = commandConfig.optionMap[optionName];
        yargs.option(
        optionName, _objectSpread({

          group: commandConfig.name },
        optionConfig));


      }
    }
  });


  var isCommandShown = commandConfig.description !== false;
  if (isCommandShown) {
    yargs.example(commandConfig.example);
  }
}

function registerCommands(yargs) {var _arr3 =
  Object.keys(commandConfigs);for (var _i3 = 0; _i3 < _arr3.length; _i3++) {var commandName = _arr3[_i3];
    var commandConfig = commandConfigs[commandName];
    registerCommandForConfig(yargs, commandConfig);
  }
}

function setUpYargs() {
  var yargs = require('yargs');
  yargs.usage('Usage: block <command> [options]');
  registerCommands(yargs);
  yargs.help('help');
  return yargs;
}

function parseCommandNameFromConfig(config) {
  return config._[0] || '';
}

function getCommandConfig(config) {
  var command = parseCommandNameFromConfig(config);
  return commandConfigs[command];
}

function ensureCleanExit() {
  process.addListener('SIGINT', function () {return process.exit(0);});
  process.addListener('SIGTERM', function () {return process.exit(1);});
}function

runBlockCliAsync() {return _runBlockCliAsync.apply(this, arguments);}function _runBlockCliAsync() {_runBlockCliAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var yargs, config, commandConfig;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            ensureCleanExit();_context.next = 3;return (
              setUpRollbarAsync());case 3:

            yargs = setUpYargs();
            config = yargs.argv;
            commandConfig = getCommandConfig(config);
            if (commandConfig) {
              commandConfig.runCommandAsync(config).
              catch(function (err) {
                cliHelpers.exitWithError(err.message);
              });
            } else {
              yargs.showHelp();
              cliHelpers.exitWithError('Please use a valid command');
            }case 7:case "end":return _context.stop();}}}, _callee);}));return _runBlockCliAsync.apply(this, arguments);}


module.exports = runBlockCliAsync;