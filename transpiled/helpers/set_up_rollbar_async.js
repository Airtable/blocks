"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var Rollbar = require('rollbar');var _require =
require('../config/block_cli_config_settings'),ROLLBAR_ACCESS_TOKEN = _require.ROLLBAR_ACCESS_TOKEN;
var path = require('path');
var fsExtra = require('fs-extra');
var getBlocksCliProjectRootPath = require('./get_blocks_cli_project_root_path');function

setUpRollbarAsync() {return _setUpRollbarAsync.apply(this, arguments);}function _setUpRollbarAsync() {_setUpRollbarAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
              isInDevelopmentRepositoryAsync());case 2:if (!_context.sent) {_context.next = 4;break;}return _context.abrupt("return");case 4:



            new Rollbar({
              accessToken: ROLLBAR_ACCESS_TOKEN,
              captureUncaught: true,
              captureUnhandledRejections: true,
              captureIp: false });case 5:case "end":return _context.stop();}}}, _callee);}));return _setUpRollbarAsync.apply(this, arguments);}



module.exports = setUpRollbarAsync;

// This is a bit brittle because it assumes this file lives at this path.
// In the future, we may wish to set a flag at publish time to accomplish this.
function isInDevelopmentRepositoryAsync() {return _isInDevelopmentRepositoryAsync.apply(this, arguments);}function _isInDevelopmentRepositoryAsync() {_isInDevelopmentRepositoryAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var possibleGitPath;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            possibleGitPath = path.join(
            getBlocksCliProjectRootPath(),
            '.git');_context2.next = 3;return (

              fsExtra.pathExists(possibleGitPath));case 3:return _context2.abrupt("return", _context2.sent);case 4:case "end":return _context2.stop();}}}, _callee2);}));return _isInDevelopmentRepositoryAsync.apply(this, arguments);}