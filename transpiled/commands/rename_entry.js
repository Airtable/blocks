"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} /* eslint-disable no-console */
var _ = require('lodash');
var fs = require('fs');
var fsUtils = require('../fs_utils');
var path = require('path');function

renameEntryModuleAsync(_x) {return _renameEntryModuleAsync.apply(this, arguments);}function _renameEntryModuleAsync() {_renameEntryModuleAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(newNamePath) {var dirName, newFileName, blockFileJson, blockFile, oldName, oldNameWithoutExtension, newFilePath, doesModuleExistWithNewName, blockModule;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            // Ensure that newName is in the frontend directory.
            dirName = path.dirname(newNamePath);if (!(
            dirName !== '.' && !dirName.endsWith('frontend'))) {_context.next = 3;break;}throw (
              new Error('entry module should always be in frontend/'));case 3:


            // Get the file name path.
            newFileName = path.basename(newNamePath, '.js');_context.next = 6;return (

              fsUtils.readFileAsync('block.json'));case 6:blockFileJson = _context.sent;
            blockFile = JSON.parse(blockFileJson);
            oldName = blockFile.frontendEntryModuleName;
            oldNameWithoutExtension = oldName.replace(/\.js$/, '');

            newFilePath = path.join('frontend', "".concat(newFileName, ".js"));
            doesModuleExistWithNewName = fs.existsSync(newFilePath);

            // Set the frontendEntryModuleName.
            blockFile.frontendEntryModuleName = "".concat(newFileName, ".js");

            // If a module doesn't exist with the new name, then we'll update the current
            // entry module's name to the new one and update the block module's metadata.
            // If a module *does* exist with the new name, then we'll simply update block.json
            // to point frontendEntryModuleName to the other file.
            if (doesModuleExistWithNewName) {_context.next = 18;break;}
            // Set the module's name in our modules array.
            blockModule = _.find(
            blockFile.modules,
            function (o) {return o.metadata.name === oldNameWithoutExtension;});

            blockModule.metadata.name = newFileName;

            // Rename the actual file.
            _context.next = 18;return fsUtils.renameAsync(path.join('frontend', oldName), path.join('frontend', "".concat(newFileName, ".js")));case 18:_context.next = 20;return (



              fsUtils.writeFileAsync('block.json', JSON.stringify(blockFile, null, 4)));case 20:
            console.log('Entry module name updated');case 21:case "end":return _context.stop();}}}, _callee);}));return _renameEntryModuleAsync.apply(this, arguments);}function


runCommandAsync(_x2) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(argv) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
              renameEntryModuleAsync(argv.newName));case 2:case "end":return _context2.stop();}}}, _callee2);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };