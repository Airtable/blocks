"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var getBlockDirPath = require('../get_block_dir_path');
var getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');



var CREDENTIAL_NOT_FOUND_MSG = 'Credential not found!';
/**
                                                         * This only modifies the developer credentials locally. 'block push' must be used
                                                         * to synchronize changes with the server.
                                                         */function
deleteDeveloperCredentialAsync(_x) {return _deleteDeveloperCredentialAsync.apply(this, arguments);}function _deleteDeveloperCredentialAsync() {_deleteDeveloperCredentialAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(nameOfCredentialToDelete) {var developerCredentialsEncrypted, indexOfDeveloperCredentialToDelete, developerCredentialEncryptedToDelete, blockDirPath;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
              getDeveloperCredentialsEncryptedIfExistsAsync());case 2:developerCredentialsEncrypted = _context.sent;if (!(

            developerCredentialsEncrypted === null)) {_context.next = 6;break;}
            console.log(CREDENTIAL_NOT_FOUND_MSG);return _context.abrupt("return");case 6:



            indexOfDeveloperCredentialToDelete = developerCredentialsEncrypted.findIndex(function (developerCredentialEncrypted) {
              return developerCredentialEncrypted.name === nameOfCredentialToDelete;
            });if (!(
            indexOfDeveloperCredentialToDelete < 0)) {_context.next = 10;break;}
            console.log(CREDENTIAL_NOT_FOUND_MSG);return _context.abrupt("return");case 10:



            developerCredentialEncryptedToDelete = developerCredentialsEncrypted[indexOfDeveloperCredentialToDelete];

            // Mutate developerCredentialEncrypted with deletions:
            //   1. Mark object as deleted if `id` value exists. The server will handle the deletion
            //      on next `block push`.
            //   2. Remove object from the array if `id` value does not exist because the object
            //      doesn't exist on server yet.
            if (developerCredentialEncryptedToDelete.id) {
              // If id exists, we mark it as deleted and re-write to the local file system.
              // The next time 'block push' is executed, the server will delete the marked credential.
              developerCredentialEncryptedToDelete.deleted = true;
            } else {
              // If id doesn't exist, then it means the credential is not on the server yet.
              // We can just remove it from the array and re-write to the file system
              developerCredentialsEncrypted.splice(indexOfDeveloperCredentialToDelete, 1);
            }

            blockDirPath = getBlockDirPath();_context.next = 15;return (
              writeDeveloperCredentialsFromApiResponseAsync(
              developerCredentialsEncrypted,
              blockDirPath));case 15:case "end":return _context.stop();}}}, _callee);}));return _deleteDeveloperCredentialAsync.apply(this, arguments);}function



runCommandAsync(_x2) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {var credentialName, nameOfCredentialToDelete;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            credentialName = argv.credentialName;
            nameOfCredentialToDelete = credentialName; // eslint-disable-line flowtype/no-weak-types
            _context2.next = 4;return deleteDeveloperCredentialAsync(nameOfCredentialToDelete);case 4:
            console.log("Deleted '".concat(nameOfCredentialToDelete, "' credential."));case 5:case "end":return _context2.stop();}}}, _callee2);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };