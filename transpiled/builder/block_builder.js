"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
/* eslint-disable no-console */
var path = require('path');
var fs = require('fs');
var fsUtils = require('../fs_utils');
var invariant = require('invariant');var _require =
require('../helpers/node_modules_command_helpers'),babelAsync = _require.babelAsync,yarnInstallAsync = _require.yarnInstallAsync;
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var generateBlockClientWrapperCode = require('../generate_block_client_wrapper');
var parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
var SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
var getBlockDirPath = require('../get_block_dir_path');
var browserify = require('browserify');var _require2 =
require('util'),promisify = _require2.promisify;
var Terser = require('terser');
















function buildStepSuccess(value) {
  return {
    success: true,
    value: value };

}
function buildStepFailure(message) {
  return {
    success: false,
    error: new Error(message) };

}var

BlockBuilder = /*#__PURE__*/function () {function BlockBuilder() {_classCallCheck(this, BlockBuilder);}_createClass(BlockBuilder, [{ key: "_transpileSourceCodeAsync", value: function () {var _transpileSourceCodeAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      srcDirPath, outputDirPath) {var transpiledTopLevelOutputDirectoryNamesSet, _arr, _i, topLevelDirName, topLevelSrcDirPath, stats, topLevelOutputDirPath, transpileResult, buildNodeModulesPath, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, topLevelOutputDirName, symlinkPath;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                transpiledTopLevelOutputDirectoryNamesSet = new Set();_arr =
                Object.values(SupportedTopLevelDirectoryNames);_i = 0;case 3:if (!(_i < _arr.length)) {_context.next = 22;break;}topLevelDirName = _arr[_i];
                invariant(typeof topLevelDirName === 'string', 'topLevelDirName should be string');
                topLevelSrcDirPath = path.join(srcDirPath, topLevelDirName);_context.next = 9;return (
                  fsUtils.statIfExistsAsync(topLevelSrcDirPath));case 9:stats = _context.sent;if (!(
                stats === null || !stats.isDirectory())) {_context.next = 12;break;}return _context.abrupt("continue", 19);case 12:



                topLevelOutputDirPath = path.join(outputDirPath, topLevelDirName);_context.next = 15;return (
                  this._transpileDirectoryAsync(topLevelSrcDirPath, topLevelOutputDirPath));case 15:transpileResult = _context.sent;if (
                transpileResult.success) {_context.next = 18;break;}return _context.abrupt("return",
                transpileResult);case 18:

                transpiledTopLevelOutputDirectoryNamesSet.add(topLevelDirName);case 19:_i++;_context.next = 3;break;case 22:


                // Create symlinks in node_modules for our top-level directories. We do this so that you can
                // require files using absolute paths like `frontend/foo`.
                buildNodeModulesPath = path.join(outputDirPath, 'node_modules');_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context.prev = 26;_iterator =
                transpiledTopLevelOutputDirectoryNamesSet[Symbol.iterator]();case 28:if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {_context.next = 36;break;}topLevelOutputDirName = _step.value;
                symlinkPath = path.join(buildNodeModulesPath, topLevelOutputDirName);_context.next = 33;return (
                  fsUtils.symlinkAsync(path.join(outputDirPath, topLevelOutputDirName), symlinkPath));case 33:_iteratorNormalCompletion = true;_context.next = 28;break;case 36:_context.next = 42;break;case 38:_context.prev = 38;_context.t0 = _context["catch"](26);_didIteratorError = true;_iteratorError = _context.t0;case 42:_context.prev = 42;_context.prev = 43;if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}case 45:_context.prev = 45;if (!_didIteratorError) {_context.next = 48;break;}throw _iteratorError;case 48:return _context.finish(45);case 49:return _context.finish(42);case 50:return _context.abrupt("return",


                buildStepSuccess());case 51:case "end":return _context.stop();}}}, _callee, this, [[26, 38, 42, 50], [43,, 45, 49]]);}));function _transpileSourceCodeAsync(_x, _x2) {return _transpileSourceCodeAsync2.apply(this, arguments);}return _transpileSourceCodeAsync;}() }, { key: "_transpileDirectoryAsync", value: function () {var _transpileDirectoryAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(

      srcDirPath, outputDirPath) {var presets, plugins;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.prev = 0;

                presets = [
                '@babel/preset-env',
                '@babel/preset-flow',
                '@babel/preset-react'];

                plugins = [
                '@babel/proposal-class-properties'];


                // Use the blocks-cli dir as the cwd so babel can properly find
                // presets/plugins.
                _context2.next = 5;return babelAsync(__dirname, [
                srcDirPath, "--out-dir=".concat(
                outputDirPath),
                '--copy-files',
                '--no-babelrc', "--presets=".concat(
                presets.join(',')), "--plugins=".concat(
                plugins.join(',')),
                '--retain-lines',
                '--minified']);case 5:_context2.next = 10;break;case 7:_context2.prev = 7;_context2.t0 = _context2["catch"](0);return _context2.abrupt("return",


                { success: false, error: _context2.t0 });case 10:return _context2.abrupt("return",

                buildStepSuccess());case 11:case "end":return _context2.stop();}}}, _callee2, null, [[0, 7]]);}));function _transpileDirectoryAsync(_x3, _x4) {return _transpileDirectoryAsync2.apply(this, arguments);}return _transpileDirectoryAsync;}() }, { key: "_getErrorFromYarnInstallStderr", value: function _getErrorFromYarnInstallStderr(

    stderr) {
      var errorMessageLines = stderr.split('\n').
      filter(function (message) {return message.trim().length > 0 && !message.startsWith('warning ');});
      if (errorMessageLines.length > 0) {
        return new Error(errorMessageLines.join('\n'));
      }
      return null;
    } }, { key: "_yarnInstallAsync", value: function () {var _yarnInstallAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
      dirPath) {var _ref, stderr, yarnInstallError;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;_context3.next = 3;return (

                  yarnInstallAsync(dirPath, ['--prod', '--non-interactive']));case 3:_ref = _context3.sent;stderr = _ref.stderr;
                yarnInstallError = this._getErrorFromYarnInstallStderr(stderr.toString());if (!
                yarnInstallError) {_context3.next = 8;break;}return _context3.abrupt("return",
                { success: false, error: yarnInstallError });case 8:_context3.next = 13;break;case 10:_context3.prev = 10;_context3.t0 = _context3["catch"](0);return _context3.abrupt("return",


                { success: false, error: _context3.t0 });case 13:return _context3.abrupt("return",

                buildStepSuccess());case 14:case "end":return _context3.stop();}}}, _callee3, this, [[0, 10]]);}));function _yarnInstallAsync(_x5) {return _yarnInstallAsync2.apply(this, arguments);}return _yarnInstallAsync;}() }, { key: "_browserifyAsync", value: function () {var _browserifyAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(

      entryFilePath) {var originalNodeEnv, browserifyInstance, bundle, error;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                // Temporarily set the NODE_ENV to production, regardless of the actual NODE_ENV.
                originalNodeEnv = process.env.NODE_ENV;
                process.env.NODE_ENV = 'production';

                browserifyInstance = browserify(entryFilePath);
                browserifyInstance.bundleAsync = promisify(browserifyInstance.bundle.bind(browserifyInstance));

                bundle = null;
                error = null;_context4.prev = 6;_context4.next = 9;return (

                  browserifyInstance.bundleAsync());case 9:bundle = _context4.sent;_context4.next = 15;break;case 12:_context4.prev = 12;_context4.t0 = _context4["catch"](6);

                error = _context4.t0;case 15:


                // Restore NODE_ENV.
                process.env.NODE_ENV = originalNodeEnv;if (!(

                error !== null)) {_context4.next = 20;break;}return _context4.abrupt("return",
                { success: false, error: error });case 20:

                invariant(bundle, 'expects a bundle if there is no error');return _context4.abrupt("return",
                { success: true, value: bundle });case 22:case "end":return _context4.stop();}}}, _callee4, null, [[6, 12]]);}));function _browserifyAsync(_x6) {return _browserifyAsync2.apply(this, arguments);}return _browserifyAsync;}() }, { key: "_minify", value: function _minify(


    bundle) {
      var options = {
        mangle: false,
        keep_fnames: true,
        compress: {
          drop_debugger: false } };


      var bundleString = bundle.toString();
      var result = Terser.minify(bundleString, options);
      if (result.error) {
        return {
          success: false,
          error: result.error };

      }
      return {
        success: true,
        value: Buffer.from(result.code) };

    } }, { key: "_generateFrontendBundleAsync", value: function () {var _generateFrontendBundleAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(

      blockJson,
      userSrcDirPath,
      buildArtifactsDirPath) {var clientWrapperFilePath, frontendEntryModulePath, isDevelopment, clientWrapperCode, browserifyResult, minifyResult, frontendBundlePath;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:

                // We need to write our client wrapper file.
                // NOTE: it's a bit weird that we write the client wrapper file in the user
                // source code directory. This is necessary since we can't have multiple copies
                // of react and react-dom, which the wrapper code depends on. This way, the client
                // wrapper code and the user source code share the same versions of react and
                // react-dom.
                clientWrapperFilePath = path.join(userSrcDirPath, 'block_client_wrapper');
                frontendEntryModulePath = path.join(userSrcDirPath, blockJson.frontendEntry);

                isDevelopment = false;
                clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, isDevelopment);_context5.next = 6;return (
                  fsUtils.writeFileAsync(clientWrapperFilePath, clientWrapperCode));case 6:_context5.next = 8;return (

                  this._browserifyAsync(clientWrapperFilePath));case 8:browserifyResult = _context5.sent;if (
                browserifyResult.success) {_context5.next = 11;break;}return _context5.abrupt("return",
                browserifyResult);case 11:

                invariant(browserifyResult.value, 'expects browserifyResult.value if there is no error');

                minifyResult = this._minify(browserifyResult.value);if (
                minifyResult.success) {_context5.next = 15;break;}return _context5.abrupt("return",
                minifyResult);case 15:

                frontendBundlePath = path.join(buildArtifactsDirPath, 'bundle.js');_context5.next = 18;return (
                  fsUtils.writeFileAsync(frontendBundlePath, minifyResult.value));case 18:return _context5.abrupt("return",
                buildStepSuccess(frontendBundlePath));case 19:case "end":return _context5.stop();}}}, _callee5, this);}));function _generateFrontendBundleAsync(_x7, _x8, _x9) {return _generateFrontendBundleAsync2.apply(this, arguments);}return _generateFrontendBundleAsync;}() }, { key: "buildAsync", value: function () {var _buildAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(

      outputDirPath) {var blockDirPath, blockJsonResult, blockJson, srcDirPath, userSrcDirPath, buildArtifactsDirPath, packageJsonPath, yarnInstallResult, userSrcNodeModulesPath, transpileResult, bundleResult;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:if (!
                fs.existsSync(outputDirPath)) {_context6.next = 2;break;}return _context6.abrupt("return",
                buildStepFailure("directory already exists at ".concat(outputDirPath)));case 2:


                console.log('reading block json');
                blockDirPath = getBlockDirPath();_context6.next = 6;return (
                  parseAndValidateBlockJsonAsync());case 6:blockJsonResult = _context6.sent;if (!
                blockJsonResult.err) {_context6.next = 9;break;}return _context6.abrupt("return",
                { success: false, error: blockJsonResult.err });case 9:

                invariant(blockJsonResult.value, 'blockJson.value');
                blockJson = blockJsonResult.value;_context6.next = 13;return (

                  fsUtils.mkdirPathAsync(outputDirPath));case 13:
                srcDirPath = path.join(outputDirPath, 'src');_context6.next = 16;return (
                  fsUtils.mkdirAsync(srcDirPath));case 16:

                userSrcDirPath = path.join(srcDirPath, 'user');_context6.next = 19;return (
                  fsUtils.mkdirAsync(userSrcDirPath));case 19:

                buildArtifactsDirPath = path.join(outputDirPath, 'build_artifacts');_context6.next = 22;return (
                  fsUtils.mkdirAsync(buildArtifactsDirPath));case 22:

                console.log('copying package.json and block.json files');
                packageJsonPath = path.join(blockDirPath, 'package.json');if (!
                fs.existsSync(packageJsonPath)) {_context6.next = 27;break;}_context6.next = 27;return (
                  fsUtils.copyFileAsync(packageJsonPath, path.join(userSrcDirPath, 'package.json')));case 27:_context6.next = 29;return (

                  fsUtils.writeFileAsync(
                  path.join(userSrcDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
                  JSON.stringify(blockJson, null, 4)));case 29:


                // Install user packages.
                console.log('installing node modules');_context6.next = 32;return (
                  this._yarnInstallAsync(userSrcDirPath));case 32:yarnInstallResult = _context6.sent;if (
                yarnInstallResult.success) {_context6.next = 35;break;}return _context6.abrupt("return",
                yarnInstallResult);case 35:


                userSrcNodeModulesPath = path.join(userSrcDirPath, 'node_modules');if (
                fs.existsSync(userSrcNodeModulesPath)) {_context6.next = 38;break;}return _context6.abrupt("return",
                buildStepFailure('No modules installed. react and react-dom are required.'));case 38:


                // Transpile the user's source code.
                console.log('transpiling source code');_context6.next = 41;return (
                  this._transpileSourceCodeAsync(blockDirPath, userSrcDirPath));case 41:transpileResult = _context6.sent;if (
                transpileResult.success) {_context6.next = 44;break;}return _context6.abrupt("return",
                transpileResult);case 44:


                // Generate frontend bundle.
                console.log('generating frontend bundle');_context6.next = 47;return (
                  this._generateFrontendBundleAsync(blockJson, userSrcDirPath, buildArtifactsDirPath));case 47:bundleResult = _context6.sent;if (
                bundleResult.success) {_context6.next = 50;break;}return _context6.abrupt("return",
                bundleResult);case 50:return _context6.abrupt("return",


                buildStepSuccess({
                  frontendBundlePath: bundleResult.value,
                  // Backend blocks not currently supported.
                  backendDeploymentPackagePath: null }));case 51:case "end":return _context6.stop();}}}, _callee6, this);}));function buildAsync(_x10) {return _buildAsync.apply(this, arguments);}return buildAsync;}() }]);return BlockBuilder;}();




module.exports = BlockBuilder;