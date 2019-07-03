"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var invariant = require('invariant');
var getBlockDirPath = require('../get_block_dir_path');
var getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');function



updateBlockDeveloperCredentialNameAsync(_x, _x2) {return _updateBlockDeveloperCredentialNameAsync.apply(this, arguments);}function _updateBlockDeveloperCredentialNameAsync() {_updateBlockDeveloperCredentialNameAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
  currentName,
  newName) {var blockDirPath, developerCredentialsEncrypted, existingCredentialIndex, existingCredentialThatAlreadyHasNewNameIndex;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

            blockDirPath = getBlockDirPath();_context.next = 3;return (
              getDeveloperCredentialsEncryptedIfExistsAsync());case 3:developerCredentialsEncrypted = _context.sent;if (!(

            developerCredentialsEncrypted === null)) {_context.next = 7;break;}
            console.log(_getNotFoundMessage(currentName));return _context.abrupt("return");case 7:



            existingCredentialIndex = developerCredentialsEncrypted.findIndex(function (developerCredentialEncrypted) {
              return developerCredentialEncrypted.name === currentName;
            });if (!(
            existingCredentialIndex < 0)) {_context.next = 11;break;}
            console.log(_getNotFoundMessage(currentName));return _context.abrupt("return");case 11:if (!(



            currentName === newName)) {_context.next = 14;break;}
            console.log('No changes were made! The new name is the same as the current name.');return _context.abrupt("return");case 14:



            existingCredentialThatAlreadyHasNewNameIndex = developerCredentialsEncrypted.findIndex(function (developerCredentialEncrypted) {
              return developerCredentialEncrypted.name === newName;
            });if (!(
            existingCredentialThatAlreadyHasNewNameIndex >= 0)) {_context.next = 18;break;}
            console.log("Duplicate name! Developer credential with '".concat(newName, "' already exists!"));return _context.abrupt("return");case 18:



            // Mutate values and then write back to the file system
            developerCredentialsEncrypted[existingCredentialIndex].name = newName;_context.next = 21;return (
              writeDeveloperCredentialsFromApiResponseAsync(
              developerCredentialsEncrypted,
              blockDirPath));case 21:

            console.log("Successfully renamed to ".concat(newName, "."));case 22:case "end":return _context.stop();}}}, _callee);}));return _updateBlockDeveloperCredentialNameAsync.apply(this, arguments);}


var _getNotFoundMessage = function _getNotFoundMessage(name) {return "Developer credential with '".concat(name, "' not found!");};function

runCommandAsync(_x3) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {var currentName, newName, currentNameTrimmed, newNameTrimmed;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            currentName = argv.currentName, newName = argv.newName;
            invariant(typeof currentName === 'string', 'currentName must be string');
            invariant(typeof newName === 'string', 'newName must be string');

            currentNameTrimmed = currentName.trim();
            newNameTrimmed = newName.trim();_context2.next = 7;return (
              updateBlockDeveloperCredentialNameAsync(currentNameTrimmed, newNameTrimmed));case 7:case "end":return _context2.stop();}}}, _callee2);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };