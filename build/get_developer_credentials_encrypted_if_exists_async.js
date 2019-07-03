"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var path = require('path');
var fsUtils = require('./fs_utils');
var getBlockDirPath = require('./get_block_dir_path');
var blocksConfigSettings = require('./config/block_cli_config_settings');function



getDeveloperCredentialsEncryptedIfExistsAsync() {return _getDeveloperCredentialsEncryptedIfExistsAsync.apply(this, arguments);}function _getDeveloperCredentialsEncryptedIfExistsAsync() {_getDeveloperCredentialsEncryptedIfExistsAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var blockDirPath, developerCredentialsFilePath, developerCredentialsFile, developerCredentialsEncrypted, _JSON$parse, developerCredentials;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockDirPath = getBlockDirPath();

            developerCredentialsFilePath = path.join(blockDirPath, blocksConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME);_context.next = 4;return (
              fsUtils.readFileIfExistsAsync(developerCredentialsFilePath));case 4:developerCredentialsFile = _context.sent;if (!(
            developerCredentialsFile === null)) {_context.next = 7;break;}return _context.abrupt("return",
            null);case 7:



            if (developerCredentialsFile) {_JSON$parse =
              JSON.parse(developerCredentialsFile), developerCredentials = _JSON$parse.developerCredentials;
              developerCredentialsEncrypted = developerCredentials ?
              JSON.parse(Buffer.from(developerCredentials, 'base64').toString('utf8')) :
              null;
            } else {
              developerCredentialsEncrypted = null;
            }return _context.abrupt("return",

            developerCredentialsEncrypted);case 9:case "end":return _context.stop();}}}, _callee);}));return _getDeveloperCredentialsEncryptedIfExistsAsync.apply(this, arguments);}


module.exports = getDeveloperCredentialsEncryptedIfExistsAsync;