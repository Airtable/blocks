"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var getBlockDirPath = require('../get_block_dir_path');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var validateRemoteJson = require('./validate_remote_json');
var fsUtils = require('../fs_utils');
var path = require('path');function




parseAndValidateRemoteJsonAsync(_x) {return _parseAndValidateRemoteJsonAsync.apply(this, arguments);}function _parseAndValidateRemoteJsonAsync() {_parseAndValidateRemoteJsonAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(remoteName) {var blockDirPath, remoteJsonFileName, remoteJsonRelativePath, remoteJsonAbsolutePath, remoteJsonStr, remoteJson, validationResult;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockDirPath = getBlockDirPath();

            remoteJsonFileName = blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH;
            if (remoteName) {
              remoteJsonFileName = "".concat(remoteName, ".").concat(remoteJsonFileName);
            }

            remoteJsonRelativePath = path.join(blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME, remoteJsonFileName);
            remoteJsonAbsolutePath = path.join(blockDirPath, remoteJsonRelativePath);_context.next = 7;return (
              fsUtils.readFileIfExistsAsync(remoteJsonAbsolutePath));case 7:remoteJsonStr = _context.sent;if (!(
            remoteJsonStr === null)) {_context.next = 10;break;}return _context.abrupt("return",
            { err: new Error("Could not find file at ".concat(remoteJsonRelativePath)) });case 10:_context.prev = 10;



            remoteJson = JSON.parse(remoteJsonStr);_context.next = 17;break;case 14:_context.prev = 14;_context.t0 = _context["catch"](10);return _context.abrupt("return",

            { err: new Error("Could not parse ".concat(remoteJsonFileName)) });case 17:

            validationResult = validateRemoteJson(remoteJson);if (
            validationResult.pass) {_context.next = 20;break;}return _context.abrupt("return",
            { err: new Error(validationResult.reason) });case 20:return _context.abrupt("return",

            {
              value: remoteJson // eslint-disable-line flowtype/no-weak-types
            });case 21:case "end":return _context.stop();}}}, _callee, null, [[10, 14]]);}));return _parseAndValidateRemoteJsonAsync.apply(this, arguments);}


module.exports = parseAndValidateRemoteJsonAsync;