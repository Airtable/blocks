"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} /* eslint-disable no-console */
var path = require('path');
var getBlockDirPath = require('../get_block_dir_path');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var writeFilesFromApiResponseAsync = require('../write_files_from_api_response');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');
var APIClient = require('../api_client');
var fsUtils = require('../fs_utils');
var getApiKeySync = require('../get_api_key_sync');function

pullBlockAsync() {return _pullBlockAsync.apply(this, arguments);}function _pullBlockAsync() {_pullBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var blockDirPath, blockFileDataJson, blockFileData, apiKey, apiClient, response, writeBlockFilesFromApiResponsePromise, packageJsonPath, packageJson, packageJsonParsed, writePackageJsonPromise, writeBlockDeveloperCredentialsFromApiResponseAsync;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockDirPath = getBlockDirPath();_context.next = 3;return (
              fsUtils.readFileAsync(
              path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME)));case 3:blockFileDataJson = _context.sent;

            blockFileData = JSON.parse(blockFileDataJson);

            apiKey = getApiKeySync(blockDirPath);

            apiClient = new APIClient({
              environment: blockFileData.environment,
              applicationId: blockFileData.applicationId,
              blockId: blockFileData.blockId,
              apiKey: apiKey });_context.next = 9;return (

              apiClient.fetchBlockAsync());case 9:response = _context.sent;

            // Write source code files.
            writeBlockFilesFromApiResponsePromise = writeFilesFromApiResponseAsync(
            response,
            blockDirPath,
            {
              applicationId: blockFileData.applicationId,
              blockId: blockFileData.blockId,
              environment: blockFileData.environment });



            // Write package.json
            packageJsonPath = path.join(blockDirPath, 'package.json');_context.next = 14;return (
              fsUtils.readFileAsync(packageJsonPath, 'utf-8'));case 14:packageJson = _context.sent;
            packageJsonParsed = JSON.parse(packageJson);
            packageJsonParsed.dependencies = response.packageVersionByName;
            writePackageJsonPromise = fsUtils.writeFileAsync(
            packageJsonPath,
            JSON.stringify(packageJsonParsed, null, 4));


            // Write developer credential file
            _context.next = 20;return writeDeveloperCredentialsFromApiResponseAsync(
            response.developerCredentialsEncrypted,
            blockDirPath);case 20:writeBlockDeveloperCredentialsFromApiResponseAsync = _context.sent;_context.next = 23;return (


              Promise.all([
              writeBlockFilesFromApiResponsePromise,
              writePackageJsonPromise,
              writeBlockDeveloperCredentialsFromApiResponseAsync]));case 23:

            console.log('Local block updated');case 24:case "end":return _context.stop();}}}, _callee);}));return _pullBlockAsync.apply(this, arguments);}function


runCommandAsync(_x) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
              pullBlockAsync());case 2:case "end":return _context2.stop();}}}, _callee2);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };