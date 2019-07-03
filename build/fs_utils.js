"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var fs = require('fs');
var promisify = require('es6-promisify');
var path = require('path');

module.exports = {
  readFileAsync: promisify(fs.readFile),
  readFileIfExistsAsync: function () {var _readFileIfExistsAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filepath) {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return (

                this.readFileAsync(filepath));case 3:return _context.abrupt("return", _context.sent);case 6:_context.prev = 6;_context.t0 = _context["catch"](0);if (!(

              _context.t0.code === 'ENOENT')) {_context.next = 10;break;}return _context.abrupt("return",
              null);case 10:throw _context.t0;case 11:case "end":return _context.stop();}}}, _callee, this, [[0, 6]]);}));function readFileIfExistsAsync(_x) {return _readFileIfExistsAsync.apply(this, arguments);}return readFileIfExistsAsync;}(),





  writeFileAsync: promisify(fs.writeFile),
  mkdirAsync: promisify(fs.mkdir),
  mkdirIfDoesntAlreadyExistAsync: function () {var _mkdirIfDoesntAlreadyExistAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dirPath) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.prev = 0;_context2.next = 3;return (

                this.mkdirAsync(dirPath));case 3:_context2.next = 9;break;case 5:_context2.prev = 5;_context2.t0 = _context2["catch"](0);if (!(


              _context2.t0.code !== 'EEXIST')) {_context2.next = 9;break;}throw _context2.t0;case 9:case "end":return _context2.stop();}}}, _callee2, this, [[0, 5]]);}));function mkdirIfDoesntAlreadyExistAsync(_x2) {return _mkdirIfDoesntAlreadyExistAsync.apply(this, arguments);}return mkdirIfDoesntAlreadyExistAsync;}(),




  mkdirPathAsync: function () {var _mkdirPathAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(dirPath) {return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;_context3.next = 3;return (


                this.mkdirIfDoesntAlreadyExistAsync(dirPath));case 3:_context3.next = 13;break;case 5:_context3.prev = 5;_context3.t0 = _context3["catch"](0);if (!(

              _context3.t0.code !== 'ENOENT')) {_context3.next = 9;break;}throw _context3.t0;case 9:_context3.next = 11;return (






                this.mkdirPathAsync(path.dirname(dirPath)));case 11:_context3.next = 13;return (



                this.mkdirIfDoesntAlreadyExistAsync(dirPath));case 13:case "end":return _context3.stop();}}}, _callee3, this, [[0, 5]]);}));function mkdirPathAsync(_x3) {return _mkdirPathAsync.apply(this, arguments);}return mkdirPathAsync;}(),


  readDirAsync: promisify(fs.readdir),
  readDirIfExistsAsync: function readDirIfExistsAsync(dirPath) {
    return this.readDirAsync(dirPath)["catch"](function (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      // Unknown error, so throw it.
      throw err;
    });
  },
  copyFileAsync: function () {var _copyFileAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(sourceFile, targetFile) {var contents;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                this.readFileAsync(sourceFile));case 2:contents = _context4.sent;_context4.next = 5;return (
                this.writeFileAsync(targetFile, contents));case 5:case "end":return _context4.stop();}}}, _callee4, this);}));function copyFileAsync(_x4, _x5) {return _copyFileAsync.apply(this, arguments);}return copyFileAsync;}(),

  symlinkAsync: promisify(fs.symlink),
  symlinkIfNeededAsync: function symlinkIfNeededAsync(target, filePath) {
    this.symlinkAsync(target, filePath)["catch"](function (err) {
      // Throw if we get any error other than that the symlink already exists.
      if (err.code !== 'EEXIST') {
        throw err;
      }
    });
  },
  statAsync: promisify(fs.stat),
  statIfExistsAsync: function statIfExistsAsync(filePath) {
    return this.statAsync(filePath)["catch"](function (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      // Throw if we get any error other than that the file doesn't exist.
      throw err;
    });
  },
  renameAsync: promisify(fs.rename),
  existsAsync: function existsAsync(filePath) {
    return this.statIfExistsAsync(filePath).then(function (result) {
      return result !== null;
    });
  } };