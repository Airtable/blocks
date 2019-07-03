"use strict";function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var cliHelpers = require('./helpers/cli_helpers');
var commandConfigs = require('./commands/command_configs');

function registerCommandForConfig(yargs, commandConfig) {
  yargs.command(
  commandConfig.command,
  commandConfig.description,
  function (yargsInner) {
    if (commandConfig.positionalMap) {
      for (var _i = 0, _Object$keys = Object.keys(commandConfig.positionalMap); _i < _Object$keys.length; _i++) {var positionalName = _Object$keys[_i];
        var positionalConfig = commandConfig.positionalMap[positionalName];
        yargsInner.positional(positionalName, positionalConfig);
      }
    }
    if (commandConfig.optionMap) {
      for (var _i2 = 0, _Object$keys2 = Object.keys(commandConfig.optionMap); _i2 < _Object$keys2.length; _i2++) {var optionName = _Object$keys2[_i2];
        var optionConfig = commandConfig.optionMap[optionName];
        yargs.option(
        optionName, _objectSpread({

          group: commandConfig.name },
        optionConfig));


      }
    }
  });

  yargs.example(commandConfig.example);
}

function registerCommands(yargs) {
  for (var _i3 = 0, _Object$keys3 = Object.keys(commandConfigs); _i3 < _Object$keys3.length; _i3++) {var commandName = _Object$keys3[_i3];
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

function runBlockCli() {
  var yargs = setUpYargs();
  var config = yargs.argv;
  var commandConfig = getCommandConfig(config);
  if (commandConfig) {
    commandConfig.runCommandAsync(config)["catch"](
    function (err) {
      cliHelpers.exitWithError(err.message);
    });
  } else {
    yargs.showHelp();
    cliHelpers.exitWithError('Please use a valid command');
  }
}

module.exports = runBlockCli;