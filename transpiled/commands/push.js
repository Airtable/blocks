"use strict";function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} /* eslint-disable no-console */
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var getBlockDirPath = require('../get_block_dir_path');
var getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var APIClient = require('../api_client');
var fsUtils = require('../fs_utils');
var getApiKeySync = require('../get_api_key_sync');

var dirsToRead = ['frontend', 'shared', 'backendRoute', 'backendEvent'];function

convertFileToModuleAsync(_x, _x2, _x3, _x4) {return _convertFileToModuleAsync.apply(this, arguments);}function _convertFileToModuleAsync() {_convertFileToModuleAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, parentDir, existingModulesByName, argv) {var fileNameWithoutExtension, blockDirPath, filePath, code, blockModule, existingModule, _blockModule;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (

            file.match(/.+\.js$/)) {_context.next = 2;break;}return _context.abrupt("return",
            null);case 2:


            fileNameWithoutExtension = file.replace(
            /\.js$/,
            '');


            blockDirPath = getBlockDirPath();
            filePath = path.join(blockDirPath, parentDir, file);_context.next = 7;return (
              fsUtils.readFileAsync(filePath, 'utf-8'));case 7:code = _context.sent;if (
            existingModulesByName[fileNameWithoutExtension]) {_context.next = 14;break;}
            blockModule = {
              code: code,
              metadata: {
                type: parentDir,
                name: fileNameWithoutExtension } };


            // The API should do this by default for new modules, but for now...
            if (blockModule.metadata.type === 'backendRoute') {
              blockModule.metadata.urlPath = '/';
              blockModule.metadata.method = 'get';
            }return _context.abrupt("return",
            blockModule);case 14:

            existingModule =
            existingModulesByName[fileNameWithoutExtension];
            _blockModule = {
              code: code,
              id: existingModule.id,
              metadata: existingModule.metadata };

            // If revision is provided, the server will reject updates that would clobber changes.
            // If we want to force update, omit revision, else add it.
            if (!argv.force) {
              _blockModule.revision = existingModule.revision;
            }return _context.abrupt("return",
            _blockModule);case 18:case "end":return _context.stop();}}}, _callee);}));return _convertFileToModuleAsync.apply(this, arguments);}function



readModulesInDirectoryAsync(_x5, _x6, _x7) {return _readModulesInDirectoryAsync.apply(this, arguments);}function _readModulesInDirectoryAsync() {_readModulesInDirectoryAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dir, existingModulesByName, argv) {var blockDirPath, files, modules;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            blockDirPath = getBlockDirPath();_context2.next = 3;return (
              fsUtils.readDirIfExistsAsync(path.join(blockDirPath, dir)));case 3:files = _context2.sent;if (
            files) {_context2.next = 6;break;}return _context2.abrupt("return",
            null);case 6:_context2.next = 8;return (

              Promise.all(files.map(function (file) {return (
                  convertFileToModuleAsync(file, dir, existingModulesByName, argv));})));case 8:modules = _context2.sent;return _context2.abrupt("return",

            modules);case 10:case "end":return _context2.stop();}}}, _callee2);}));return _readModulesInDirectoryAsync.apply(this, arguments);}function


readAllModulesAsync(_x8, _x9) {return _readAllModulesAsync.apply(this, arguments);}function _readAllModulesAsync() {_readAllModulesAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(argv, blockFileData) {var existingModules, existingModulesByName, modulesForEachDir;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            existingModules = blockFileData.modules;
            existingModulesByName = _.keyBy(existingModules, function (module) {return module.metadata.name;});_context3.next = 4;return (
              Promise.all(dirsToRead.map(function (dir) {return (
                  readModulesInDirectoryAsync(dir, existingModulesByName, argv));})));case 4:modulesForEachDir = _context3.sent;return _context3.abrupt("return",

            _.compact(_.flattenDeep(modulesForEachDir)));case 6:case "end":return _context3.stop();}}}, _callee3);}));return _readAllModulesAsync.apply(this, arguments);}function


pushBlockAsync(_x10) {return _pushBlockAsync.apply(this, arguments);}function _pushBlockAsync() {_pushBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(argv) {var blockDirPath, blockFileDataJson, blockFileData, developerCredentialsEncrypted, modules, apiKey, apiClient, packageJsonPath, packageJson, dependencies, putData, createdModules, moduleRevisionById, developerCredentialsEncryptedFromResponse, response, message, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, blockModule, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, createdModule, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _blockModule2, writeBlockDeveloperCredentialsFromApiResponseAsync;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
            blockDirPath = getBlockDirPath();

            // We read metadata from the block file.
            blockFileDataJson = fs.readFileSync(
            path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME));

            blockFileData = JSON.parse(blockFileDataJson);

            // Read developer credentials from disk.
            _context4.next = 5;return getDeveloperCredentialsEncryptedIfExistsAsync();case 5:developerCredentialsEncrypted = _context4.sent;_context4.next = 8;return (


              readAllModulesAsync(argv, blockFileData));case 8:modules = _context4.sent;

            // Try pushing the modules.
            apiKey = getApiKeySync(blockDirPath);
            apiClient = new APIClient({
              environment: blockFileData.environment,
              applicationId: blockFileData.applicationId,
              blockId: blockFileData.blockId,
              apiKey: apiKey });

            packageJsonPath = path.join(blockDirPath, 'package.json');
            packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
            dependencies = packageJson.dependencies;

            putData = _objectSpread({
              packageVersionByName: dependencies,
              modules: modules },
            developerCredentialsEncrypted ? { developerCredentialsEncrypted: developerCredentialsEncrypted } : null);

            console.log('Pushing...');_context4.prev = 16;_context4.next = 19;return (





              apiClient.updateBlockAsync(putData));case 19:response = _context4.sent;
            createdModules = response.createdModules;
            moduleRevisionById = response.moduleRevisionById;
            developerCredentialsEncryptedFromResponse = response.developerCredentialsEncrypted;_context4.next = 51;break;case 25:_context4.prev = 25;_context4.t0 = _context4["catch"](16);

            console.log('Push failed!');

            // Replace module ids with names in the error message.
            if (!blockFileData) {_context4.next = 50;break;}
            message = _context4.t0.message;_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context4.prev = 33;
            for (_iterator = blockFileData.modules[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {blockModule = _step.value;
              message = message.
              split(blockModule.id).
              join(blockModule.metadata.type + '/' + blockModule.metadata.name);
            }_context4.next = 41;break;case 37:_context4.prev = 37;_context4.t1 = _context4["catch"](33);_didIteratorError = true;_iteratorError = _context4.t1;case 41:_context4.prev = 41;_context4.prev = 42;if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}case 44:_context4.prev = 44;if (!_didIteratorError) {_context4.next = 47;break;}throw _iteratorError;case 47:return _context4.finish(44);case 48:return _context4.finish(41);case 49:
            _context4.t0.message = message;case 50:throw _context4.t0;case 51:





            // Add any new modules.
            _iteratorNormalCompletion2 = true;_didIteratorError2 = false;_iteratorError2 = undefined;_context4.prev = 54;for (_iterator2 = createdModules[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {createdModule = _step2.value;
              blockFileData.modules.push(createdModule);
            }
            // Update revision number of all modules.
            _context4.next = 62;break;case 58:_context4.prev = 58;_context4.t2 = _context4["catch"](54);_didIteratorError2 = true;_iteratorError2 = _context4.t2;case 62:_context4.prev = 62;_context4.prev = 63;if (!_iteratorNormalCompletion2 && _iterator2.return != null) {_iterator2.return();}case 65:_context4.prev = 65;if (!_didIteratorError2) {_context4.next = 68;break;}throw _iteratorError2;case 68:return _context4.finish(65);case 69:return _context4.finish(62);case 70:_iteratorNormalCompletion3 = true;_didIteratorError3 = false;_iteratorError3 = undefined;_context4.prev = 73;for (_iterator3 = blockFileData.modules[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {_blockModule2 = _step3.value;
              _blockModule2.revision = moduleRevisionById[_blockModule2.id];
            }

            // Write the developer credentials json file from the response.
            // This clobbers the locally stored file with the API response.
            _context4.next = 81;break;case 77:_context4.prev = 77;_context4.t3 = _context4["catch"](73);_didIteratorError3 = true;_iteratorError3 = _context4.t3;case 81:_context4.prev = 81;_context4.prev = 82;if (!_iteratorNormalCompletion3 && _iterator3.return != null) {_iterator3.return();}case 84:_context4.prev = 84;if (!_didIteratorError3) {_context4.next = 87;break;}throw _iteratorError3;case 87:return _context4.finish(84);case 88:return _context4.finish(81);case 89:_context4.next = 91;return writeDeveloperCredentialsFromApiResponseAsync(
            developerCredentialsEncryptedFromResponse,
            blockDirPath);case 91:writeBlockDeveloperCredentialsFromApiResponseAsync = _context4.sent;_context4.next = 94;return (


              Promise.all([
              fsUtils.writeFileAsync(
              path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
              JSON.stringify(blockFileData, null, 4)),

              writeBlockDeveloperCredentialsFromApiResponseAsync]));case 94:

            console.log('Remote block updated!');case 95:case "end":return _context4.stop();}}}, _callee4, null, [[16, 25], [33, 37, 41, 49], [42,, 44, 48], [54, 58, 62, 70], [63,, 65, 69], [73, 77, 81, 89], [82,, 84, 88]]);}));return _pushBlockAsync.apply(this, arguments);}function


runCommandAsync(_x11) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(argv) {return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
              pushBlockAsync(argv));case 2:case "end":return _context5.stop();}}}, _callee5);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };