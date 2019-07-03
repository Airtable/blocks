"use strict";var _commandConfigs;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var CommandNames = require('./command_names');
var Environments = require('../types/environments');
var path = require('path');
var _ = require('lodash');

















function commandRunner(name) {
  return (/*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {var command;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                // flow-disable-next-line since flow wants us to pass a string literal.
                command = require(path.join(__dirname, name));_context.next = 3;return (
                  command.runCommandAsync(argv));case 3:case "end":return _context.stop();}}}, _callee);}));return function (_x) {return _ref.apply(this, arguments);};}());

}function

runUnsupportedCommandAsync(_x2) {return _runUnsupportedCommandAsync.apply(this, arguments);}function _runUnsupportedCommandAsync() {_runUnsupportedCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:throw (
              new Error("The ".concat(argv._[0], " command is no longer supported. If you are working on a block that is not yet migrated to the new block.json format, you may need to use an old version of blocks-cli")));case 1:case "end":return _context2.stop();}}}, _callee2);}));return _runUnsupportedCommandAsync.apply(this, arguments);}


var commandConfigs = (_commandConfigs = {}, _defineProperty(_commandConfigs,
CommandNames.INIT, {
  name: CommandNames.INIT,
  command: "".concat(CommandNames.INIT, " <blockIdentifier> <blockDirPath>"),
  description: 'Initialize a block repo',
  example: "block ".concat(CommandNames.INIT, " app123/blk456 my-block"),
  positionalMap: {
    blockIdentifier: {
      description: 'identifier for the block (of the form <baseId>/<blockId>)',
      type: 'string' },

    blockDirPath: {
      description: 'directory path for the block',
      type: 'string' } },


  optionMap: {
    environment: {
      type: 'string',
      description: 'Which environment the block lives on',
      choices: _.values(Environments),
      default: Environments.PRODUCTION,
      hidden: true // hide from --help output
    } },

  runCommandAsync: commandRunner(CommandNames.INIT) }), _defineProperty(_commandConfigs,

CommandNames.RUN, {
  name: CommandNames.RUN,
  command: "".concat(CommandNames.RUN),
  description: 'Build and run a block',
  example: "block ".concat(CommandNames.RUN),
  optionMap: {
    ngrok: {
      description:
      'Run blocks through ngrok.io',
      type: 'boolean',
      hidden: true, // hide from --help output
      default: false },

    'transpile-all': {
      description:
      'Transpile JS for all browsers airtable supports, rather than a minimal set for development',
      type: 'boolean',
      default: false },

    'sdk-repo': {
      description:
      'Path to a local copy of @airtable/blocks to use instead of the npm one',
      type: 'string',
      hidden: true },

    remote: {
      description: 'Configure which remote to use',
      type: 'string',
      hidden: true // hide from --help output
    } },

  runCommandAsync: commandRunner(CommandNames.RUN) }), _defineProperty(_commandConfigs,

CommandNames.RELEASE, {
  name: CommandNames.RELEASE,
  command: "".concat(CommandNames.RELEASE),
  description: 'Release a block',
  example: "block ".concat(CommandNames.RELEASE),
  optionMap: {
    remote: {
      description: 'Configure which remote to use',
      type: 'string',
      hidden: true // hide from --help output
    } },

  runCommandAsync: commandRunner(CommandNames.RELEASE) }), _defineProperty(_commandConfigs,




CommandNames.CLONE, {
  name: CommandNames.CLONE,
  command: "".concat(CommandNames.CLONE), // Doesn't specify the positionals here so that even doing `block clone` will show the unsupported command error.
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.CLONE, " app123/blk456 my-block"),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.PUSH, {
  name: CommandNames.PUSH,
  command: "".concat(CommandNames.PUSH),
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.PUSH),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.PULL, {
  name: CommandNames.PULL,
  command: "".concat(CommandNames.PULL),
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.PULL),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.RENAME_ENTRY, {
  name: CommandNames.RENAME_ENTRY,
  command: "".concat(CommandNames.RENAME_ENTRY), // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.RENAME_ENTRY, " newModuleName"),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.SET_CREDENTIAL, {
  name: CommandNames.SET_CREDENTIAL,
  command: "".concat(CommandNames.SET_CREDENTIAL),
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.SET_CREDENTIAL),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.DELETE_CREDENTIAL, {
  name: CommandNames.DELETE_CREDENTIAL,
  command: "".concat(CommandNames.DELETE_CREDENTIAL), // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.DELETE_CREDENTIAL, " CREDENTIAL_NAME"),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.RENAME_CREDENTIAL, {
  name: CommandNames.RENAME_CREDENTIAL,
  command: "".concat(CommandNames.RENAME_CREDENTIAL), // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.RENAME_CREDENTIAL, " CURRENT_NAME NEW_NAME"),
  runCommandAsync: runUnsupportedCommandAsync }), _defineProperty(_commandConfigs,

CommandNames.LIST_CREDENTIALS, {
  name: CommandNames.LIST_CREDENTIALS,
  command: "".concat(CommandNames.LIST_CREDENTIALS),
  description: false, // UNSUPPORTED, so hide this from help output.
  example: "block ".concat(CommandNames.LIST_CREDENTIALS),
  runCommandAsync: runUnsupportedCommandAsync }), _commandConfigs);



module.exports = commandConfigs;