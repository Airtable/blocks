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

}

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
      "default": Environments.PRODUCTION,
      hidden: true // hide from --help output
    } },

  runCommandAsync: commandRunner(CommandNames.INIT) }), _defineProperty(_commandConfigs,

CommandNames.BUILD, {
  name: CommandNames.BUILD,
  command: "".concat(CommandNames.BUILD),
  description: 'Build a block',
  example: "block ".concat(CommandNames.BUILD),
  runCommandAsync: commandRunner(CommandNames.BUILD) }), _defineProperty(_commandConfigs,

CommandNames.CLONE, {
  name: CommandNames.CLONE,
  command: "".concat(CommandNames.CLONE, " <blockIdentifier> <blockDirPath>"),
  description: 'Clone a block from Airtable',
  example: "block ".concat(CommandNames.CLONE, " app123/blk456 my-block"),
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
      description: 'Which environment to clone from',
      choices: _.values(Environments),
      "default": Environments.PRODUCTION,
      hidden: true // hide from --help output
    } },

  runCommandAsync: commandRunner(CommandNames.CLONE) }), _defineProperty(_commandConfigs,

CommandNames.RUN, {
  name: CommandNames.RUN,
  command: "".concat(CommandNames.RUN),
  description: 'Build and run a block',
  example: "block ".concat(CommandNames.RUN),
  optionMap: {
    local: {
      description:
      'Run blocks locally on with a self-signed certificate instead of through ngrok.io',
      type: 'boolean',
      "default": false },

    'transpile-all': {
      description:
      'Transpile JS for all browsers airtable supports, rather than a minimal set for development',
      type: 'boolean',
      "default": false },

    'sdk-repo': {
      description:
      'Path to a local copy of @airtable/blocks to use instead of the npm one',
      type: 'string',
      hidden: true } },


  runCommandAsync: commandRunner(CommandNames.RUN) }), _defineProperty(_commandConfigs,

CommandNames.PUSH, {
  name: CommandNames.PUSH,
  command: "".concat(CommandNames.PUSH),
  description: 'Push changes to Airtable',
  example: "block ".concat(CommandNames.PUSH),
  optionMap: {
    force: {
      description: 'Bypass revision check when updating files?',
      type: 'boolean',
      "default": false } },


  runCommandAsync: commandRunner(CommandNames.PUSH) }), _defineProperty(_commandConfigs,

CommandNames.PULL, {
  name: CommandNames.PULL,
  command: "".concat(CommandNames.PULL),
  description: 'Pull changes from Airtable',
  example: "block ".concat(CommandNames.PULL),
  runCommandAsync: commandRunner(CommandNames.PULL) }), _defineProperty(_commandConfigs,

CommandNames.RENAME_ENTRY, {
  name: CommandNames.RENAME_ENTRY,
  command: "".concat(CommandNames.RENAME_ENTRY, " <newName>"),
  description: 'Update the entry module name',
  example: "block ".concat(CommandNames.RENAME_ENTRY, " newModuleName"),
  positionalMap: {
    newName: {
      description: 'new name for the frontend entry module',
      type: 'string' } },


  // NOTE: the module name (rename_entry) doesn't exactly match the command name (rename-entry)
  // in order to conform to our file naming guidelines.
  runCommandAsync: commandRunner('rename_entry') }), _defineProperty(_commandConfigs,

CommandNames.SET_CREDENTIAL, {
  name: CommandNames.SET_CREDENTIAL,
  command: "".concat(CommandNames.SET_CREDENTIAL),
  description: 'Set developer credentials',
  example: "block ".concat(CommandNames.SET_CREDENTIAL),
  // NOTE: the module name (set_credential) doesn't exactly match the command name (set-credential)
  // in order to conform to our file naming guidelines.
  runCommandAsync: commandRunner('set_credential') }), _defineProperty(_commandConfigs,

CommandNames.DELETE_CREDENTIAL, {
  name: CommandNames.DELETE_CREDENTIAL,
  command: "".concat(CommandNames.DELETE_CREDENTIAL, " <credentialName>"),
  description: 'Delete a developer credential',
  example: "block ".concat(CommandNames.DELETE_CREDENTIAL, " CREDENTIAL_NAME"),
  positionalMap: {
    credentialName: {
      description: 'name of credential to delete',
      type: 'string' } },


  // NOTE: the module name (delete_credential) doesn't exactly match the command name (delete-credential)
  // in order to conform to our file naming guidelines.
  runCommandAsync: commandRunner('delete_credential') }), _defineProperty(_commandConfigs,

CommandNames.RENAME_CREDENTIAL, {
  name: CommandNames.RENAME_CREDENTIAL,
  command: "".concat(CommandNames.RENAME_CREDENTIAL, " <currentName> <newName>"),
  description: 'Rename a developer credential',
  example: "block ".concat(CommandNames.RENAME_CREDENTIAL, " CURRENT_NAME NEW_NAME"),
  positionalMap: {
    currentName: {
      type: 'string',
      description: 'Current name for the credential' },

    newName: {
      type: 'string',
      description: 'New name for the credential' } },


  // NOTE: the module name (rename_credential) doesn't exactly match the command name (rename-credential)
  // in order to conform to our file naming guidelines.
  runCommandAsync: commandRunner('rename_credential') }), _defineProperty(_commandConfigs,

CommandNames.LIST_CREDENTIALS, {
  name: CommandNames.LIST_CREDENTIALS,
  command: "".concat(CommandNames.LIST_CREDENTIALS),
  description: 'List developer credentials',
  example: "block ".concat(CommandNames.LIST_CREDENTIALS),
  // NOTE: the module name (list_credentials) doesn't exactly match the command name (list-credentials)
  // in order to conform to our file naming guidelines.
  runCommandAsync: commandRunner('list_credentials') }), _commandConfigs);



module.exports = commandConfigs;