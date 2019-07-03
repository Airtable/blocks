"use strict";var _Object$freeze;function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
/* eslint-disable no-console */
var path = require('path');
var fs = require('fs');
var fsUtils = require('../fs_utils');
var invariant = require('invariant');var _require =
require('../helpers/child_process_helpers'),execFileAsync = _require.execFileAsync;
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var generateBlockClientWrapperCode = require('../generate_block_client_wrapper');
var generateBlockBabelConfig = require('../generate_block_babel_config');
var BlockModuleTypes = require('../types/block_module_types');
var babel = require('@babel/core');
var browserify = require('browserify');
var promisify = require('es6-promisify');
var Terser = require('terser');




var BlockModuleDirectoryNamesByType = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze,
BlockModuleTypes.FRONTEND, 'frontend'), _defineProperty(_Object$freeze,
BlockModuleTypes.SHARED, 'shared'), _defineProperty(_Object$freeze,
BlockModuleTypes.BACKEND_ROUTE, 'routes'), _Object$freeze));












var BUILD_STEP_RESULT_OK = Object.freeze({ success: true, value: undefined });var



BlockBuilder = /*#__PURE__*/function () {function BlockBuilder() {_classCallCheck(this, BlockBuilder);}_createClass(BlockBuilder, [{ key: "_buildFailure", value: function _buildFailure(
    message) {
      return {
        success: false,
        error: new Error(message) };

    } }, { key: "_readAndParseBlockJson", value: function () {var _readAndParseBlockJson2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      blockDirPath) {var blockJsonPath, blockJsonStr, blockJson;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                blockJsonPath = path.join(blockDirPath, 'block.json');if (
                fs.existsSync(blockJsonPath)) {_context.next = 3;break;}return _context.abrupt("return",
                this._buildFailure('must have a block.json file'));case 3:_context.next = 5;return (

                  fsUtils.readFileAsync(blockJsonPath, 'utf8'));case 5:blockJsonStr = _context.sent;_context.prev = 6;


                blockJson = JSON.parse(blockJsonStr);_context.next = 13;break;case 10:_context.prev = 10;_context.t0 = _context["catch"](6);return _context.abrupt("return",

                this._buildFailure('invalid block.json file'));case 13:return _context.abrupt("return",

                { success: true, value: blockJson });case 14:case "end":return _context.stop();}}}, _callee, this, [[6, 10]]);}));function _readAndParseBlockJson(_x) {return _readAndParseBlockJson2.apply(this, arguments);}return _readAndParseBlockJson;}() }, { key: "_transpileSourceCodeAsync", value: function () {var _transpileSourceCodeAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(

      srcDirPath, outputDirPath, blockJson) {var modulesByType, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, blockModule, type, modules, moduleTypeOutputDirPathByModuleType, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _step2$value, moduleType, blockModules, moduleTypeDirName, moduleTypeOutputDirPath, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _blockModule, moduleName, moduleOutputFilePath, srcModuleFilePath, moduleValue, compiledCode, buildNodeModulesPath, _i, _Object$entries, _Object$entries$_i, moduleTypeDirpath, symlinkPath;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                modulesByType = new Map();_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context2.prev = 4;
                for (_iterator = blockJson.modules[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {blockModule = _step.value;
                  type = blockModule.metadata.type;
                  if (!modulesByType.get(type)) {
                    modulesByType.set(type, []);
                  }
                  modules = modulesByType.get(type);
                  invariant(modules, 'modules');
                  modulesByType.set(type, modules.concat(blockModule));
                }

                // Generate a dict of module type to dirpath that we can use to
                // create symlinks for requiring client code.
                _context2.next = 12;break;case 8:_context2.prev = 8;_context2.t0 = _context2["catch"](4);_didIteratorError = true;_iteratorError = _context2.t0;case 12:_context2.prev = 12;_context2.prev = 13;if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}case 15:_context2.prev = 15;if (!_didIteratorError) {_context2.next = 18;break;}throw _iteratorError;case 18:return _context2.finish(15);case 19:return _context2.finish(12);case 20:moduleTypeOutputDirPathByModuleType = new Map();_iteratorNormalCompletion2 = true;_didIteratorError2 = false;_iteratorError2 = undefined;_context2.prev = 24;_iterator2 =
                modulesByType[Symbol.iterator]();case 26:if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {_context2.next = 78;break;}_step2$value = _slicedToArray(_step2.value, 2), moduleType = _step2$value[0], blockModules = _step2$value[1];
                moduleTypeDirName = BlockModuleDirectoryNamesByType[moduleType];
                moduleTypeOutputDirPath = path.join(outputDirPath, moduleTypeDirName);
                moduleTypeOutputDirPathByModuleType.set(moduleType, moduleTypeOutputDirPath);_context2.next = 33;return (
                  fsUtils.mkdirAsync(moduleTypeOutputDirPath));case 33:_iteratorNormalCompletion3 = true;_didIteratorError3 = false;_iteratorError3 = undefined;_context2.prev = 36;_iterator3 =

                blockModules[Symbol.iterator]();case 38:if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {_context2.next = 61;break;}_blockModule = _step3.value;
                moduleName = _blockModule.metadata.name;
                moduleOutputFilePath = path.join(moduleTypeOutputDirPath, "".concat(moduleName, ".js"));

                // NOTE: currently, when using blocks-cli, the dir names match the module type
                // (not our canonical dir names for each module type).
                srcModuleFilePath = path.join(srcDirPath, moduleType, "".concat(moduleName, ".js"));if (
                fs.existsSync(srcModuleFilePath)) {_context2.next = 45;break;}return _context2.abrupt("return",
                this._buildFailure("module does not exist: ".concat(srcModuleFilePath)));case 45:_context2.next = 47;return (

                  fsUtils.readFileAsync(srcModuleFilePath));case 47:moduleValue = _context2.sent;

                compiledCode = void 0;_context2.prev = 49;

                compiledCode = babel.transform(moduleValue, _objectSpread({},
                generateBlockBabelConfig(), {
                  filename: moduleOutputFilePath })).
                code;_context2.next = 56;break;case 53:_context2.prev = 53;_context2.t1 = _context2["catch"](49);return _context2.abrupt("return",

                { success: false, error: _context2.t1 });case 56:_context2.next = 58;return (

                  fsUtils.writeFileAsync(moduleOutputFilePath, compiledCode));case 58:_iteratorNormalCompletion3 = true;_context2.next = 38;break;case 61:_context2.next = 67;break;case 63:_context2.prev = 63;_context2.t2 = _context2["catch"](36);_didIteratorError3 = true;_iteratorError3 = _context2.t2;case 67:_context2.prev = 67;_context2.prev = 68;if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {_iterator3["return"]();}case 70:_context2.prev = 70;if (!_didIteratorError3) {_context2.next = 73;break;}throw _iteratorError3;case 73:return _context2.finish(70);case 74:return _context2.finish(67);case 75:_iteratorNormalCompletion2 = true;_context2.next = 26;break;case 78:_context2.next = 84;break;case 80:_context2.prev = 80;_context2.t3 = _context2["catch"](24);_didIteratorError2 = true;_iteratorError2 = _context2.t3;case 84:_context2.prev = 84;_context2.prev = 85;if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {_iterator2["return"]();}case 87:_context2.prev = 87;if (!_didIteratorError2) {_context2.next = 90;break;}throw _iteratorError2;case 90:return _context2.finish(87);case 91:return _context2.finish(84);case 92:



                // Create symlinks in node_modules for our top-level directories. We do this so that you can
                // require files using absolute paths like `frontend/foo`.
                buildNodeModulesPath = path.join(outputDirPath, 'node_modules');_i = 0, _Object$entries =
                Object.entries(moduleTypeOutputDirPathByModuleType);case 94:if (!(_i < _Object$entries.length)) {_context2.next = 102;break;}_Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), moduleType = _Object$entries$_i[0], moduleTypeDirpath = _Object$entries$_i[1];
                symlinkPath = path.join(buildNodeModulesPath, BlockModuleDirectoryNamesByType[moduleType]);_context2.next = 99;return (
                  fsUtils.symlinkAsync(moduleTypeDirpath, symlinkPath));case 99:_i++;_context2.next = 94;break;case 102:return _context2.abrupt("return",


                BUILD_STEP_RESULT_OK);case 103:case "end":return _context2.stop();}}}, _callee2, this, [[4, 8, 12, 20], [13,, 15, 19], [24, 80, 84, 92], [36, 63, 67, 75], [49, 53], [68,, 70, 74], [85,, 87, 91]]);}));function _transpileSourceCodeAsync(_x2, _x3, _x4) {return _transpileSourceCodeAsync2.apply(this, arguments);}return _transpileSourceCodeAsync;}() }, { key: "_getErrorFromYarnInstallStderr", value: function _getErrorFromYarnInstallStderr(

    stderr) {
      var errorMessageLines = stderr.split('\n').
      filter(function (message) {return message.trim().length > 0 && !message.startsWith('warning ');});
      if (errorMessageLines.length > 0) {
        return new Error(errorMessageLines.join('\n'));
      }
      return null;
    } }, { key: "_yarnInstallAsync", value: function () {var _yarnInstallAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
      dirPath) {var currPath, yarnPath, _ref, stderr, yarnInstallError;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                currPath = __dirname;
                yarnPath = path.join(currPath, '..', '..', 'node_modules', '.bin', 'yarn');_context3.prev = 2;_context3.next = 5;return (

                  execFileAsync(yarnPath, ['--prod', '--non-interactive'], {
                    cwd: dirPath,
                    prefix: 'yarn' }));case 5:_ref = _context3.sent;stderr = _ref.stderr;

                yarnInstallError = this._getErrorFromYarnInstallStderr(stderr.toString());if (!
                yarnInstallError) {_context3.next = 10;break;}return _context3.abrupt("return",
                { success: false, error: yarnInstallError });case 10:_context3.next = 15;break;case 12:_context3.prev = 12;_context3.t0 = _context3["catch"](2);return _context3.abrupt("return",


                { success: false, error: _context3.t0 });case 15:return _context3.abrupt("return",

                BUILD_STEP_RESULT_OK);case 16:case "end":return _context3.stop();}}}, _callee3, this, [[2, 12]]);}));function _yarnInstallAsync(_x5) {return _yarnInstallAsync2.apply(this, arguments);}return _yarnInstallAsync;}() }, { key: "_browserifyAsync", value: function () {var _browserifyAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(

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
      blockJson, userSrcDirPath, buildArtifactsDirPath) {var clientWrapperFilePath, frontendEntryModulePath, isDevelopment, clientWrapperCode, browserifyResult, minifyResult;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                // We need to write our client wrapper file.
                // NOTE: it's a bit weird that we write the client wrapper file in the user
                // source code directory. This is necessary since we can't have multiple copies
                // of react and react-dom, which the wrapper code depends on. This way, the client
                // wrapper code and the user source code share the same versions of react and
                // react-dom.
                clientWrapperFilePath = path.join(userSrcDirPath, 'block_client_wrapper');
                frontendEntryModulePath = path.join(userSrcDirPath, BlockModuleDirectoryNamesByType.frontend, blockJson.frontendEntryModuleName);

                isDevelopment = false;
                clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, isDevelopment);_context5.next = 6;return (
                  fsUtils.writeFileAsync(clientWrapperFilePath, clientWrapperCode));case 6:_context5.next = 8;return (

                  this._browserifyAsync(clientWrapperFilePath));case 8:browserifyResult = _context5.sent;if (
                browserifyResult.success) {_context5.next = 11;break;}return _context5.abrupt("return",
                browserifyResult);case 11:

                invariant(browserifyResult.value, 'expects browserifyResult.value if there is no error');

                minifyResult = this._minify(browserifyResult.value);if (
                minifyResult.success) {_context5.next = 15;break;}return _context5.abrupt("return",
                minifyResult);case 15:_context5.next = 17;return (

                  fsUtils.writeFileAsync(path.join(buildArtifactsDirPath, 'bundle.js'), minifyResult.value));case 17:return _context5.abrupt("return",
                BUILD_STEP_RESULT_OK);case 18:case "end":return _context5.stop();}}}, _callee5, this);}));function _generateFrontendBundleAsync(_x7, _x8, _x9) {return _generateFrontendBundleAsync2.apply(this, arguments);}return _generateFrontendBundleAsync;}() }, { key: "buildAsync", value: function () {var _buildAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(

      outputDirPath) {var blockDirPath, blockJsonResult, blockJson, srcDirPath, userSrcDirPath, buildArtifactsDirPath, packageJsonPath, yarnInstallResult, userSrcNodeModulesPath, blockSdkDirPath, transpileResult, bundleResult;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:if (!
                fs.existsSync(outputDirPath)) {_context6.next = 2;break;}return _context6.abrupt("return",
                this._buildFailure("directory already exists at ".concat(outputDirPath)));case 2:


                console.log("building in ".concat(outputDirPath));_context6.next = 5;return (
                  fsUtils.mkdirPathAsync(outputDirPath));case 5:

                // TODO(jb): be smarter about this? (see get_block_dir_path).
                blockDirPath = process.cwd();

                console.log('reading block json');_context6.next = 9;return (
                  this._readAndParseBlockJson(blockDirPath));case 9:blockJsonResult = _context6.sent;if (
                blockJsonResult.success) {_context6.next = 12;break;}return _context6.abrupt("return",
                blockJsonResult);case 12:

                invariant(blockJsonResult.value, 'blockJson.value');
                blockJson = blockJsonResult.value;

                srcDirPath = path.join(outputDirPath, 'src');_context6.next = 17;return (
                  fsUtils.mkdirAsync(srcDirPath));case 17:

                userSrcDirPath = path.join(srcDirPath, 'user');_context6.next = 20;return (
                  fsUtils.mkdirAsync(userSrcDirPath));case 20:

                buildArtifactsDirPath = path.join(outputDirPath, 'build_artifacts');_context6.next = 23;return (
                  fsUtils.mkdirAsync(buildArtifactsDirPath));case 23:

                console.log('copying package.json and block.json files');
                packageJsonPath = path.join(blockDirPath, 'package.json');
                if (fs.existsSync(packageJsonPath)) {
                  fsUtils.copyFileAsync(packageJsonPath, path.join(userSrcDirPath, 'package.json'));
                }
                fsUtils.writeFileAsync(path.join(userSrcDirPath, 'block.json'), JSON.stringify(blockJson, null, 4));

                console.log('installing node modules');_context6.next = 30;return (
                  this._yarnInstallAsync(userSrcDirPath));case 30:yarnInstallResult = _context6.sent;if (
                yarnInstallResult.success) {_context6.next = 33;break;}return _context6.abrupt("return",
                yarnInstallResult);case 33:


                userSrcNodeModulesPath = path.join(userSrcDirPath, 'node_modules');if (
                fs.existsSync(userSrcNodeModulesPath)) {_context6.next = 36;break;}return _context6.abrupt("return",
                this._buildFailure('No modules installed. react and react-dom are required.'));case 36:


                // Drop in the stub for the Block SDK.
                console.log('writing block sdk stub');
                blockSdkDirPath = path.join(userSrcNodeModulesPath, blockCliConfigSettings.SDK_PACKAGE_NAME);_context6.next = 40;return (
                  fsUtils.mkdirAsync(blockSdkDirPath));case 40:_context6.next = 42;return (



                  fsUtils.writeFileAsync(
                  path.join(blockSdkDirPath, 'index.js'), "module.exports = (typeof window !== 'undefined' ? window : global)['".concat(
                  blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME, "'];")));case 42:


                // Transpile the user's source code.
                console.log('transpiling source code');_context6.next = 45;return (
                  this._transpileSourceCodeAsync(blockDirPath, userSrcDirPath, blockJson));case 45:transpileResult = _context6.sent;if (
                transpileResult.success) {_context6.next = 48;break;}return _context6.abrupt("return",
                transpileResult);case 48:


                // Generate frontend bundle.
                console.log('generating frontend bundle');_context6.next = 51;return (
                  this._generateFrontendBundleAsync(blockJson, userSrcDirPath, buildArtifactsDirPath));case 51:bundleResult = _context6.sent;if (
                bundleResult.success) {_context6.next = 54;break;}return _context6.abrupt("return",
                bundleResult);case 54:return _context6.abrupt("return",


                { success: true });case 55:case "end":return _context6.stop();}}}, _callee6, this);}));function buildAsync(_x10) {return _buildAsync.apply(this, arguments);}return buildAsync;}() }]);return BlockBuilder;}();



module.exports = BlockBuilder;