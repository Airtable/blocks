"use strict";function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} /* eslint-disable no-console */
require('@babel/polyfill');
var pathToRegexp = require('path-to-regexp');
var fsUtils = require('./fs_utils');
var path = require('path');
var BlockBackendMessageTypes = require('./block_backend_message_types');
var blockCliConfigSettings = require('./config/block_cli_config_settings');
var Babel = require('@babel/core');
var generateBlockBabelConfig = require('./generate_block_babel_config');
var chalk = require('chalk');
var generateResponseBodyBase64 = require('./generate_response_body_base64');
var getBlockDirPath = require('./get_block_dir_path');
var getBackendSdkUrl = require('./get_backend_sdk_url');
var Environments = require('./types/environments');var _require =
require('util'),promisify = _require.promisify;
var request = require('request');
request.getAsync = promisify(request.get);

function getFormattedProjectPath(folder, name) {var extension = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.js';
  return chalk.bold("".concat(path.join(folder, name)).concat(extension));
}
function getRouteAndParamsForEvent(event, routes) {
  var matchedRouteIdAndParams = null;var _arr =
  Object.keys(routes);for (var _i = 0; _i < _arr.length; _i++) {var routeId = _arr[_i];
    var _route = routes[routeId];
    if (_route.metadata.method.toLowerCase() === event.method.toLowerCase()) {var _ret = function () {
        var keys = [];
        var re = pathToRegexp(_route.metadata.urlPath, keys);
        var match = re.exec(event.path);
        if (match) {
          var params = keys.reduce(function (result, key, index) {
            var param = match[index + 1];
            result[key.name] = param;
            return result;
          }, {});
          matchedRouteIdAndParams = {
            routeId: routeId,
            params: params };

          return "break";
        }}();if (_ret === "break") break;
    }
  }
  if (!matchedRouteIdAndParams) {
    return null;
  }
  var route = routes[matchedRouteIdAndParams.routeId];
  return {
    route: route,
    params: matchedRouteIdAndParams.params };

}function

callUserCodeForEventAsync(_x, _x2, _x3) {return _callUserCodeForEventAsync.apply(this, arguments);}function _callUserCodeForEventAsync() {_callUserCodeForEventAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event, routes, developerCredentialByName) {var headers, routeAndParams, route, params, sdkWrapperInstance, blockDirPath, routeHandlerModule, errorMessage, handler, requestObj, responsePromise, response;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(








            event.method.toUpperCase() === 'OPTIONS')) {_context.next = 5;break;}
            headers = [
            'access-control-allow-origin', '*',
            'access-control-max-age', '86400'];


            if (event.headers['access-control-request-headers']) {
              headers.push('access-control-allow-headers', event.headers['access-control-request-headers']);
            }
            if (event.headers['access-control-request-method']) {
              headers.push('access-control-allow-methods', event.headers['access-control-request-method']);
            }return _context.abrupt("return",

            {
              statusCode: 200,
              headers: headers });case 5:



            routeAndParams = getRouteAndParamsForEvent(event, routes);if (!(
            routeAndParams === null)) {_context.next = 8;break;}return _context.abrupt("return", _objectSpread({


              statusCode: 404 },
            generateResponseBodyBase64('NOT_FOUND')));case 8:


            route = routeAndParams.route, params = routeAndParams.params;_context.prev = 9;


            sdkWrapperInstance = global[blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME];if (
            sdkWrapperInstance) {_context.next = 13;break;}throw (
              new Error('SDK not set on global'));case 13:_context.next = 15;return (


              sdkWrapperInstance.__initializeSdkForEventAsync(event, developerCredentialByName));case 15:

            blockDirPath = getBlockDirPath();
            routeHandlerModule = require(path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR, 'backendRoute', route.metadata.name));if (!(
            !routeHandlerModule || _typeof(routeHandlerModule) !== 'object' || typeof routeHandlerModule.default !== 'function')) {_context.next = 21;break;}
            errorMessage = "".concat(getFormattedProjectPath('backendRoute', route.metadata.name), " does not export a default function!");
            console.warn(errorMessage);return _context.abrupt("return", _objectSpread({

              statusCode: 500 },
            generateResponseBodyBase64({
              err: errorMessage,
              message: 'SERVER_ERROR' })));case 21:





            handler = routeHandlerModule.default;

            requestObj = {
              method: event.method,
              query: event.query,
              params: params,
              path: event.path,
              body: event.body,
              headers: event.headers,

              // Private fields for SDK consumption:
              _apiAccessPolicyString: event.apiAccessPolicyString,
              _applicationId: event.applicationId,
              _blockInstallationId: event.blockInstallationId,
              _kvValuesByKey: event.kvValuesByKey };


            // A backend route handler function may return a promise or a non-promise
            // value. For consistency, let's always convert it to a promise so that we
            // can handle both formats the same.
            responsePromise = Promise.resolve(handler(requestObj));_context.next = 26;return (

              responsePromise);case 26:response = _context.sent;return _context.abrupt("return",
            response);case 30:_context.prev = 30;_context.t0 = _context["catch"](9);

            // Their handler threw an error, so treat this as a 500.
            console.warn(chalk.red(_context.t0.stack));return _context.abrupt("return", _objectSpread({

              statusCode: 500 },
            generateResponseBodyBase64({
              err: _context.t0.toString(),
              stack: _context.t0.stack,
              message: 'SERVER_ERROR' })));case 34:case "end":return _context.stop();}}}, _callee, null, [[9, 30]]);}));return _callUserCodeForEventAsync.apply(this, arguments);}function





generateRoutesObjectFromModulesAsync(_x4) {return _generateRoutesObjectFromModulesAsync.apply(this, arguments);}function _generateRoutesObjectFromModulesAsync() {_generateRoutesObjectFromModulesAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(modules) {var backendModules, routes, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, backendModule;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
            backendModules = modules.filter(function (module) {return module.metadata.type === 'backendRoute';});
            routes = {};_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context2.prev = 5;
            for (_iterator = backendModules[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {backendModule = _step.value;
              routes[backendModule.id] = backendModule;
            }_context2.next = 13;break;case 9:_context2.prev = 9;_context2.t0 = _context2["catch"](5);_didIteratorError = true;_iteratorError = _context2.t0;case 13:_context2.prev = 13;_context2.prev = 14;if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}case 16:_context2.prev = 16;if (!_didIteratorError) {_context2.next = 19;break;}throw _iteratorError;case 19:return _context2.finish(16);case 20:return _context2.finish(13);case 21:return _context2.abrupt("return",
            routes);case 22:case "end":return _context2.stop();}}}, _callee2, null, [[5, 9, 13, 21], [14,, 16, 20]]);}));return _generateRoutesObjectFromModulesAsync.apply(this, arguments);}function


symlinkBackendAndSharedFoldersAsync() {return _symlinkBackendAndSharedFoldersAsync.apply(this, arguments);}function _symlinkBackendAndSharedFoldersAsync() {_symlinkBackendAndSharedFoldersAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var blockDirPath, buildDirPath, folderNames, _arr2, _i2, folderName, folderPath, nodeModulesPath;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            blockDirPath = getBlockDirPath();
            buildDirPath = path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR);
            folderNames = ['backendRoute', 'shared'];_arr2 =
            folderNames;_i2 = 0;case 5:if (!(_i2 < _arr2.length)) {_context3.next = 14;break;}folderName = _arr2[_i2];
            folderPath = path.join(buildDirPath, folderName);
            nodeModulesPath = path.join(blockDirPath, 'node_modules', folderName);_context3.next = 11;return (
              fsUtils.symlinkIfNeededAsync(folderPath, nodeModulesPath));case 11:_i2++;_context3.next = 5;break;case 14:case "end":return _context3.stop();}}}, _callee3);}));return _symlinkBackendAndSharedFoldersAsync.apply(this, arguments);}function



transpileFileIfNeededAsync(_x5, _x6, _x7, _x8) {return _transpileFileIfNeededAsync.apply(this, arguments);}function _transpileFileIfNeededAsync() {_transpileFileIfNeededAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fileName, moduleType, srcDirPath, destDirPath) {var srcFilePath, destFilePath, srcFileStat, destFileStat, slop, code, transpiledCode;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
            srcFilePath = path.join(srcDirPath, moduleType, fileName);
            destFilePath = path.join(destDirPath, moduleType, fileName);

            // Re-transpile if the file changed in the last minute, which helps
            // unbreak things if transpiling gets into a bad state and you restart.
            _context4.next = 4;return fsUtils.statIfExistsAsync(srcFilePath);case 4:srcFileStat = _context4.sent;_context4.next = 7;return (
              fsUtils.statIfExistsAsync(destFilePath));case 7:destFileStat = _context4.sent;
            slop = 1 * 60 * 1000; // 1 min
            if (!(destFileStat && (!srcFileStat || destFileStat.mtimeMs > srcFileStat.mtimeMs + slop))) {_context4.next = 11;break;}return _context4.abrupt("return");case 11:_context4.next = 13;return (



              fsUtils.readFileAsync(srcFilePath, 'utf8'));case 13:code = _context4.sent;
            transpiledCode = Babel.transform(code, generateBlockBabelConfig({
              node: blockCliConfigSettings.BLOCK_NODE_VERSION })).
            code;_context4.next = 17;return (
              fsUtils.writeFileAsync(destFilePath, transpiledCode));case 17:case "end":return _context4.stop();}}}, _callee4);}));return _transpileFileIfNeededAsync.apply(this, arguments);}function


transpileBackendAndSharedCodeAsync() {return _transpileBackendAndSharedCodeAsync.apply(this, arguments);}function _transpileBackendAndSharedCodeAsync() {_transpileBackendAndSharedCodeAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {var blockDirPath, sharedFiles, backendRouteFiles, filesByModuleType, buildDirPath, backendBuildDirPath, sharedBuildDirPath, transpilationPromises, jsRegex, _arr3, _i3, moduleType, files, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file, transpilationPromise;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
            blockDirPath = getBlockDirPath();_context5.next = 3;return (
              fsUtils.readDirIfExistsAsync(path.join(blockDirPath, 'shared')));case 3:sharedFiles = _context5.sent;_context5.next = 6;return (
              fsUtils.readDirIfExistsAsync(path.join(blockDirPath, 'backendRoute')));case 6:backendRouteFiles = _context5.sent;

            filesByModuleType = {
              shared: sharedFiles,
              backendRoute: backendRouteFiles };


            buildDirPath = path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR);_context5.next = 11;return (
              fsUtils.mkdirIfDoesntAlreadyExistAsync(buildDirPath));case 11:
            backendBuildDirPath = path.join(buildDirPath, 'backendRoute');_context5.next = 14;return (
              fsUtils.mkdirIfDoesntAlreadyExistAsync(backendBuildDirPath));case 14:
            sharedBuildDirPath = path.join(buildDirPath, 'shared');_context5.next = 17;return (
              fsUtils.mkdirIfDoesntAlreadyExistAsync(sharedBuildDirPath));case 17:

            transpilationPromises = [];
            jsRegex = /\.js$/;_arr3 =
            Object.keys(filesByModuleType);_i3 = 0;case 21:if (!(_i3 < _arr3.length)) {_context5.next = 46;break;}moduleType = _arr3[_i3];
            files = filesByModuleType[moduleType] || [];_iteratorNormalCompletion2 = true;_didIteratorError2 = false;_iteratorError2 = undefined;_context5.prev = 27;
            for (_iterator2 = files[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {file = _step2.value;
              if (jsRegex.test(file)) {
                transpilationPromise = transpileFileIfNeededAsync(file, moduleType, blockDirPath, buildDirPath);
                transpilationPromises.push(transpilationPromise);
              }
            }_context5.next = 35;break;case 31:_context5.prev = 31;_context5.t0 = _context5["catch"](27);_didIteratorError2 = true;_iteratorError2 = _context5.t0;case 35:_context5.prev = 35;_context5.prev = 36;if (!_iteratorNormalCompletion2 && _iterator2.return != null) {_iterator2.return();}case 38:_context5.prev = 38;if (!_didIteratorError2) {_context5.next = 41;break;}throw _iteratorError2;case 41:return _context5.finish(38);case 42:return _context5.finish(35);case 43:_i3++;_context5.next = 21;break;case 46:_context5.next = 48;return (

              Promise.all(transpilationPromises));case 48:case "end":return _context5.stop();}}}, _callee5, null, [[27, 31, 35, 43], [36,, 38, 42]]);}));return _transpileBackendAndSharedCodeAsync.apply(this, arguments);}function


checkIfBackendRoutesExistInBlockJsonAsync(_x9) {return _checkIfBackendRoutesExistInBlockJsonAsync.apply(this, arguments);}




















// Copied from https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function _checkIfBackendRoutesExistInBlockJsonAsync() {_checkIfBackendRoutesExistInBlockJsonAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(modules) {var blockDirPath, blockJsonBackendRouteFiles, backendRouteFiles, jsRegex;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:blockDirPath = getBlockDirPath();blockJsonBackendRouteFiles = new Set();modules.forEach(function (module) {if (module.metadata.type === 'backendRoute') {blockJsonBackendRouteFiles.add("".concat(module.metadata.name, ".js"));}});_context6.next = 5;return fsUtils.readDirAsync(path.join(blockDirPath, 'backendRoute'));case 5:backendRouteFiles = _context6.sent;jsRegex = /\.js$/;backendRouteFiles.forEach(function (file) {if (jsRegex.test(file) && !blockJsonBackendRouteFiles.has(file)) {var formattedFileName = getFormattedProjectPath('backendRoute', file, '');console.warn("".concat(formattedFileName, " is being ignored since this file could not be found in block.json."));console.warn("Please add an entry for ".concat(formattedFileName, " to block.json to resolve this error."));}});case 8:case "end":return _context6.stop();}}}, _callee6);}));return _checkIfBackendRoutesExistInBlockJsonAsync.apply(this, arguments);}function requireFromString(src) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, '');
  return m.exports;
}function

downloadBackendSdkAsync(_x10) {return _downloadBackendSdkAsync.apply(this, arguments);}






















/**
                                                                                         * In hyperbase, the code to extract and decrypt developer credentials
                                                                                         * is handled in the backend wrapper code. But in the blocks-cli world,
                                                                                         * we're decrypting the credential values in BlockServer and passing the
                                                                                         * values to this forked backend process via Environment Variables.
                                                                                         *
                                                                                         * Once we extract the credential values via the Environment Variable, we delete
                                                                                         * the Environment Variable for a couple reasons:
                                                                                         * 1. The hyperbase implementation does not have credential values in process.env.
                                                                                         *    Instead credentials are accessed via a similarly named method
                                                                                         *    getDeveloperCredentialByName(). In blocks_cli, by encapsulating the credential
                                                                                         *    access from the Env Var here, and then immediately deleting the Env Var, we make
                                                                                         *    the implementation a tiny, tad bit closer to the hyperbase implementation.
                                                                                         * 2. Some libraries unwittingly leak process.env values, and deleting the Env Var
                                                                                         *    helps prevent it.
                                                                                         */function _downloadBackendSdkAsync() {_downloadBackendSdkAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(blockJson) {var environment, sdkUrl, response, backendSdkJs, BackendBlockSdkWrapper;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:environment = blockJson.environment || Environments.PRODUCTION;sdkUrl = getBackendSdkUrl(environment);_context7.next = 4;return request.getAsync({ uri: sdkUrl, headers: { 'User-Agent': blockCliConfigSettings.USER_AGENT } });case 4:response = _context7.sent;if (!(response.statusCode !== 200)) {_context7.next = 7;break;}throw new Error("Failed to download backend SDK with statusCode: ".concat(response.statusCode));case 7:backendSdkJs = response.body; // This is sketchy: some runtime checks for "am I running in Node" check that
            // typeof self === 'undefined', so this breaks that...
            // But whatwg-fetch references `self` so if we don't do this, the SDK doesn't
            // load. TODO(kasra): look into removing the dependency on whatwg-fetch.
            global.self = global;BackendBlockSdkWrapper = requireFromString(backendSdkJs);return _context7.abrupt("return", BackendBlockSdkWrapper);case 11:case "end":return _context7.stop();}}}, _callee7);}));return _downloadBackendSdkAsync.apply(this, arguments);}function getDeveloperCredentialByName() {var developerCredentialByName;if (process.env.DEVELOPER_CREDENTIAL_BY_NAME) {developerCredentialByName = JSON.parse(process.env.DEVELOPER_CREDENTIAL_BY_NAME);
  } else {
    developerCredentialByName = {};
  }

  delete process.env.DEVELOPER_CREDENTIAL_BY_NAME;
  return developerCredentialByName;
}function

setUpBackendAsync() {return _setUpBackendAsync.apply(this, arguments);}function _setUpBackendAsync() {_setUpBackendAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {var blockDirPath, rawBlockJson, blockJson, modules, routes, developerCredentialByName, BackendBlockSdkWrapper, sdkWrapperInstance;return regeneratorRuntime.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:
            // Parse block.json.
            blockDirPath = getBlockDirPath();_context9.next = 3;return (
              fsUtils.readFileAsync(path.join(blockDirPath, 'block.json')));case 3:rawBlockJson = _context9.sent;
            blockJson = JSON.parse(rawBlockJson);
            modules = blockJson.modules;
            // Check if all files in backendRoute exist in block.json, and issue
            // warnings otherwise.
            _context9.next = 8;return checkIfBackendRoutesExistInBlockJsonAsync(modules);case 8:_context9.next = 10;return (

              transpileBackendAndSharedCodeAsync());case 10:_context9.next = 12;return (


              symlinkBackendAndSharedFoldersAsync());case 12:_context9.next = 14;return (


              generateRoutesObjectFromModulesAsync(modules));case 14:routes = _context9.sent;
            // Get the developer credential values so we can initialize the SDK with it
            developerCredentialByName = getDeveloperCredentialByName();
            // Download the backend sdk.
            _context9.next = 18;return downloadBackendSdkAsync(blockJson, blockDirPath);case 18:BackendBlockSdkWrapper = _context9.sent;
            sdkWrapperInstance = new BackendBlockSdkWrapper();

            // When we receive a request, call user code and send back the response.
            process.on('message', /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(event) {var response;return regeneratorRuntime.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                        if (sdkWrapperInstance) {
                          // NOTE: in hyperbase, this code is inside callUserCodeForEventAsync, but
                          // hyperbase doesn't have to deal with downloading the SDK, so for more
                          // organizational clarity, we'll do this step here.
                          if (global[blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME] !== sdkWrapperInstance) {
                            // If this isn't assigned yet, or the user's code replaced it for
                            // some reason in the previous invocation, set it to the SDK wrapper.
                            global[blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME] = sdkWrapperInstance;
                          }
                        }_context8.next = 3;return (

                          callUserCodeForEventAsync(event, routes, developerCredentialByName));case 3:response = _context8.sent;
                        process.send(_objectSpread({
                          messageType: BlockBackendMessageTypes.EVENT_RESPONSE,
                          requestId: event.requestId },
                        response));case 5:case "end":return _context8.stop();}}}, _callee8);}));return function (_x11) {return _ref.apply(this, arguments);};}());



            // Signal that this process is ready to start serving requests.
            process.send({
              messageType: BlockBackendMessageTypes.PROCESS_READY,
              pid: process.pid });case 22:case "end":return _context9.stop();}}}, _callee9);}));return _setUpBackendAsync.apply(this, arguments);}



setUpBackendAsync();