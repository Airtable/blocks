"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var BlockBuilder = require('../builder/block_builder');
var path = require('path');



function _getOutputDirPath() {
  var timestampString = new Date().getTime().toString();
  return path.join('/tmp', 'build', timestampString);
}function

runCommandAsync(_x) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {var blockBuilder, outputDirPath, buildResult;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockBuilder = new BlockBuilder();
            outputDirPath = _getOutputDirPath();_context.next = 4;return (
              blockBuilder.buildAsync(outputDirPath));case 4:buildResult = _context.sent;if (
            buildResult.success) {_context.next = 7;break;}throw (
              buildResult.error);case 7:case "end":return _context.stop();}}}, _callee);}));return _runCommandAsync.apply(this, arguments);}



module.exports = { runCommandAsync: runCommandAsync };