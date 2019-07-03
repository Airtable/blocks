"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var getBlockDirPath = require('../get_block_dir_path');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var validateBlockJson = require('./validate_block_json');
var fsUtils = require('../fs_utils');
var path = require('path');function




parseAndValidateBlockJsonAsync() {return _parseAndValidateBlockJsonAsync.apply(this, arguments);}function _parseAndValidateBlockJsonAsync() {_parseAndValidateBlockJsonAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var blockDirPath, blockJsonPath, blockJsonStr, blockJson, validationResult;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockDirPath = getBlockDirPath();
            blockJsonPath = path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME);_context.next = 4;return (
              fsUtils.readFileAsync(blockJsonPath));case 4:blockJsonStr = _context.sent;_context.prev = 5;


            blockJson = JSON.parse(blockJsonStr);_context.next = 12;break;case 9:_context.prev = 9;_context.t0 = _context["catch"](5);return _context.abrupt("return",

            { err: new Error("Could not parse ".concat(blockCliConfigSettings.BLOCK_FILE_NAME)) });case 12:

            validationResult = validateBlockJson(blockJson);if (
            validationResult.pass) {_context.next = 15;break;}return _context.abrupt("return",
            { err: new Error(validationResult.reason) });case 15:return _context.abrupt("return",

            {
              value: blockJson // eslint-disable-line flowtype/no-weak-types
            });case 16:case "end":return _context.stop();}}}, _callee, null, [[5, 9]]);}));return _parseAndValidateBlockJsonAsync.apply(this, arguments);}


module.exports = parseAndValidateBlockJsonAsync;