"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} /* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var writeFilesFromApiResponseAsync = require('../write_files_from_api_response');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');
var APIClient = require('../api_client');
var fsUtils = require('../fs_utils');
var parseBlockIdentifier = require('../helpers/parse_block_identifier');
var promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');function

cloneBlockAsync(_x, _x2, _x3, _x4, _x5) {return _cloneBlockAsync.apply(this, arguments);}function _cloneBlockAsync() {_cloneBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
  environment,
  applicationId,
  blockId,
  blockDirPath,
  apiKey) {var apiClient, response, writeBlockFilesFromApiResponsePromise, writeAirtableApiKeyFilePromise, writePackageJsonPromise, writeBlockDeveloperCredentialsFromApiResponseAsync, gitignoreContents, writeGitignoreFilePromise;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


              fsUtils.mkdirAsync(blockDirPath));case 2:

            // Fetch the block from the server.
            apiClient = new APIClient({
              environment: environment,
              applicationId: applicationId,
              blockId: blockId,
              apiKey: apiKey });_context.next = 5;return (

              apiClient.fetchBlockAsync());case 5:response = _context.sent;

            // Write the block to the file system.
            writeBlockFilesFromApiResponsePromise = writeFilesFromApiResponseAsync(
            response,
            blockDirPath,
            { environment: environment, applicationId: applicationId, blockId: blockId });


            writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
            apiKey);


            // Create a minimal package json so the user can yarn install.
            writePackageJsonPromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, 'package.json'),
            JSON.stringify(
            { dependencies: response.packageVersionByName },
            null,
            4));



            // Create a developer credentials json file.
            _context.next = 11;return writeDeveloperCredentialsFromApiResponseAsync(
            response.developerCredentialsEncrypted,
            blockDirPath);case 11:writeBlockDeveloperCredentialsFromApiResponseAsync = _context.sent;


            // Create a .gitignore file.
            gitignoreContents = [
            'node_modules',
            blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
            blockCliConfigSettings.BUILD_DIR,
            blockCliConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME];

            writeGitignoreFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, '.gitignore'),
            gitignoreContents.join('\n'));_context.next = 16;return (


              Promise.all([
              writeBlockFilesFromApiResponsePromise,
              writePackageJsonPromise,
              writeAirtableApiKeyFilePromise,
              writeGitignoreFilePromise,
              writeBlockDeveloperCredentialsFromApiResponseAsync]));case 16:case "end":return _context.stop();}}}, _callee);}));return _cloneBlockAsync.apply(this, arguments);}function



runCommandAsync(_x6) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {var blockIdentifier, blockDirPath, blockIdentifierParseResult, _blockIdentifierParse, baseId, blockId, doesBlockDirExist, environment, apiKey;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            blockIdentifier = argv.blockIdentifier, blockDirPath = argv.blockDirPath;
            blockIdentifierParseResult = parseBlockIdentifier(blockIdentifier);if (
            blockIdentifierParseResult.success) {_context2.next = 4;break;}throw (
              blockIdentifierParseResult.error);case 4:_blockIdentifierParse =

            blockIdentifierParseResult.value, baseId = _blockIdentifierParse.baseId, blockId = _blockIdentifierParse.blockId;

            // Lets validate that the given blockDir doesn't already have something in it.
            doesBlockDirExist = fs.existsSync(blockDirPath);if (!
            doesBlockDirExist) {_context2.next = 8;break;}throw (
              new Error("A directory already exists at ".concat(blockDirPath)));case 8:


            environment = argv.environment;_context2.next = 11;return (
              promptForApiKeyAsync(environment));case 11:apiKey = _context2.sent;_context2.next = 14;return (
              cloneBlockAsync(
              environment,
              baseId,
              blockId,
              blockDirPath,
              apiKey));case 14:

            console.log("Block cloned in ".concat(argv.blockDirPath));case 15:case "end":return _context2.stop();}}}, _callee2);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };