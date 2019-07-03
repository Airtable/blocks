"use strict";function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var BlockModuleTypes = require('../types/block_module_types');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var parseBlockIdentifier = require('../helpers/parse_block_identifier');
var promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
var Environments = require('../types/environments');
var fs = require('fs');
var fsUtils = require('../fs_utils');
var path = require('path');
var invariant = require('invariant');




var DEFAULT_FRONTEND_ENTRY_MODULE_NAME = 'index';
var DEFAULT_FRONTEND_ENTRY_MODULE_METADATA = {
  type: BlockModuleTypes.FRONTEND,
  name: DEFAULT_FRONTEND_ENTRY_MODULE_NAME };

var DEFAULT_FRONTEND_CODE = "import Block from 'airtable-block';\nimport React from 'react';\n\nclass Component extends React.Component {\n    render() {\n        // YOUR CODE GOES HERE\n        return <div>Hello world \uD83D\uDE80</div>;\n    }\n}\n\nexport default Component;\n";function












writeDefaultFilesAsync(_x) {return _writeDefaultFilesAsync.apply(this, arguments);}function _writeDefaultFilesAsync() {_writeDefaultFilesAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(blockDirPath) {var frontendDirPath;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            frontendDirPath = path.join(blockDirPath, BlockModuleTypes.FRONTEND);_context.next = 3;return (
              fsUtils.mkdirAsync(frontendDirPath));case 3:_context.next = 5;return (
              fsUtils.writeFileAsync(
              path.join(frontendDirPath, "".concat(DEFAULT_FRONTEND_ENTRY_MODULE_NAME, ".js")),
              DEFAULT_FRONTEND_CODE));case 5:case "end":return _context.stop();}}}, _callee);}));return _writeDefaultFilesAsync.apply(this, arguments);}function



initBlockAsync(_x2, _x3, _x4, _x5, _x6) {return _initBlockAsync.apply(this, arguments);}function _initBlockAsync() {_initBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
  baseId,
  blockId,
  blockDirPath,
  apiKey,
  environment) {var blockJson, writeBlockJsonPromise, writeDefaultFilesPromise, writeAirtableApiKeyFilePromise, defaultDependencies, writePackageJsonPromise, gitignoreContents, writeGitignoreFilePromise;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (


              fsUtils.mkdirAsync(blockDirPath));case 2:

            // Create the block.json file.
            blockJson = _objectSpread({
              frontendEntryModuleName: "".concat(DEFAULT_FRONTEND_ENTRY_MODULE_NAME, ".js"),
              applicationId: baseId,
              blockId: blockId },
            environment === Environments.PRODUCTION ? {} : { environment: environment }, {
              modules: [
              { revision: 0, metadata: DEFAULT_FRONTEND_ENTRY_MODULE_METADATA }] });


            writeBlockJsonPromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
            JSON.stringify(blockJson, null, 4));


            writeDefaultFilesPromise = writeDefaultFilesAsync(blockDirPath);

            // Write the API key to the file system.
            writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
            apiKey);


            // Create a minimal package json so the user can yarn install.
            defaultDependencies = {
              react: '^16.8.0',
              'react-dom': '^16.8.0' };

            writePackageJsonPromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, 'package.json'),
            JSON.stringify(
            { dependencies: defaultDependencies },
            null,
            4));



            // Create a .gitignore file.
            gitignoreContents = [
            'node_modules',
            blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
            blockCliConfigSettings.BUILD_DIR,
            blockCliConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME];

            writeGitignoreFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, '.gitignore'),
            gitignoreContents.join('\n'));_context2.next = 12;return (


              Promise.all([
              writeBlockJsonPromise,
              writeDefaultFilesPromise,
              writePackageJsonPromise,
              writeGitignoreFilePromise,
              writeAirtableApiKeyFilePromise]));case 12:case "end":return _context2.stop();}}}, _callee2);}));return _initBlockAsync.apply(this, arguments);}function



runCommandAsync(_x7) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(argv) {var blockIdentifier, blockDirPath, environment, blockIdentifierParseResult, _blockIdentifierParse, baseId, blockId, doesBlockDirExist, apiKey;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            blockIdentifier = argv.blockIdentifier, blockDirPath = argv.blockDirPath, environment = argv.environment;
            invariant(typeof blockIdentifier === 'string', 'expects blockIdentifier to be a string');
            invariant(typeof blockDirPath === 'string', 'expects blockDirPath to be a string');
            invariant(typeof environment === 'string', 'expects environment to be a string');
            blockIdentifierParseResult = parseBlockIdentifier(blockIdentifier);if (
            blockIdentifierParseResult.success) {_context3.next = 7;break;}throw (
              blockIdentifierParseResult.error);case 7:_blockIdentifierParse =

            blockIdentifierParseResult.value, baseId = _blockIdentifierParse.baseId, blockId = _blockIdentifierParse.blockId;

            // Lets validate that the given blockDir doesn't already have something in it.
            doesBlockDirExist = fs.existsSync(blockDirPath);if (!
            doesBlockDirExist) {_context3.next = 11;break;}throw (
              new Error("A directory already exists at ".concat(blockDirPath)));case 11:_context3.next = 13;return (



              promptForApiKeyAsync(
              environment // eslint-disable-line flowtype/no-weak-types
              ));case 13:apiKey = _context3.sent;

            console.log('Initializing block');_context3.next = 17;return (
              initBlockAsync(
              baseId,
              blockId,
              blockDirPath,
              apiKey,
              environment));case 17:

            console.log('Your block is ready!');case 18:case "end":return _context3.stop();}}}, _callee3);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };