"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var nodeModulesCommandHelpers = require('../helpers/node_modules_command_helpers');
var parseBlockIdentifier = require('../helpers/parse_block_identifier');
var promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
var SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
var fs = require('fs');
var fsUtils = require('../fs_utils');
var path = require('path');
var invariant = require('invariant');var _require =
require('lodash'),camelCase = _require.camelCase,upperFirst = _require.upperFirst;






var DEFAULT_FRONTEND_ENTRY_NAME = 'index';

function getDefaultFrontendCode(blockDirPath) {
  var componentName = upperFirst(camelCase(path.basename(blockDirPath)));
  if (!componentName.includes('Block')) {
    componentName = "".concat(componentName, "Block");
  }

  return "import {initializeBlock} from '@airtable/blocks/ui';\nimport React from 'react';\n\nfunction ".concat(


  componentName, "() {\n    // YOUR CODE GOES HERE\n    return (\n        <div>Hello world \uD83D\uDE80</div>\n    );\n}\n\ninitializeBlock(() => <").concat(






  componentName, " />);\n");

}function

_writeDefaultFrontendFilesAsync(_x) {return _writeDefaultFrontendFilesAsync2.apply(this, arguments);}function _writeDefaultFrontendFilesAsync2() {_writeDefaultFrontendFilesAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(blockDirPath) {var frontendDirPath;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            frontendDirPath = path.join(blockDirPath, SupportedTopLevelDirectoryNames.FRONTEND);_context.next = 3;return (
              fsUtils.mkdirAsync(frontendDirPath));case 3:_context.next = 5;return (
              fsUtils.writeFileAsync(
              path.join(frontendDirPath, "".concat(DEFAULT_FRONTEND_ENTRY_NAME, ".js")),
              getDefaultFrontendCode(blockDirPath)));case 5:case "end":return _context.stop();}}}, _callee);}));return _writeDefaultFrontendFilesAsync2.apply(this, arguments);}function



initBlockAsync(_x2, _x3, _x4, _x5) {return _initBlockAsync.apply(this, arguments);}function _initBlockAsync() {_initBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
  baseId,
  blockId,
  blockDirPath,
  apiKey) {var blockJson, writeBlockJsonPromise, writeDefaultFrontendFilesPromise, remoteJson, blockConfigDirPath, writeRemoteJsonPromise, writeAirtableApiKeyFilePromise, defaultDependencies, writePackageJsonPromise, gitignoreContents, writeGitignoreFilePromise;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (


              fsUtils.mkdirAsync(blockDirPath));case 2:

            // Create the block.json file.

            blockJson = {
              frontendEntry: "./".concat(SupportedTopLevelDirectoryNames.FRONTEND, "/").concat(DEFAULT_FRONTEND_ENTRY_NAME, ".js") };

            writeBlockJsonPromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
            JSON.stringify(blockJson, null, 4));


            writeDefaultFrontendFilesPromise = _writeDefaultFrontendFilesAsync(blockDirPath);

            // Create the .block/remote.json file.
            remoteJson = {
              blockId: blockId,
              baseId: baseId };

            blockConfigDirPath = path.join(blockDirPath, blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME);_context2.next = 9;return (
              fsUtils.mkdirPathAsync(blockConfigDirPath));case 9:
            writeRemoteJsonPromise = fsUtils.writeFileAsync(
            path.join(blockConfigDirPath, blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
            JSON.stringify(remoteJson, null, 4));


            // Write the API key to the file system.
            writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
            apiKey);


            // Create a minimal package json so the user can yarn install.
            defaultDependencies = {
              '@airtable/blocks': '^0.0.12',
              react: '^16.8.0',
              'react-dom': '^16.8.0' };

            writePackageJsonPromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, 'package.json'),
            JSON.stringify(
            {
              private: true,
              dependencies: defaultDependencies },

            null,
            4));



            // Create a .gitignore file.
            gitignoreContents = [
            'node_modules',
            blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
            blockCliConfigSettings.BUILD_DIR];

            writeGitignoreFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, '.gitignore'),
            gitignoreContents.join('\n'));_context2.next = 17;return (


              Promise.all([
              writeBlockJsonPromise,
              writeRemoteJsonPromise,
              writeDefaultFrontendFilesPromise,
              writePackageJsonPromise,
              writeGitignoreFilePromise,
              writeAirtableApiKeyFilePromise]));case 17:_context2.next = 19;return (


              nodeModulesCommandHelpers.yarnInstallAsync(blockDirPath, ['--non-interactive']));case 19:case "end":return _context2.stop();}}}, _callee2);}));return _initBlockAsync.apply(this, arguments);}function


runCommandAsync(_x6) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(argv) {var blockIdentifier, blockDirPath, environment, blockIdentifierParseResult, _blockIdentifierParse, baseId, blockId, doesBlockDirExist, apiKey;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
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
              apiKey));case 17:

            console.log('Your block is ready!');case 18:case "end":return _context3.stop();}}}, _callee3);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };