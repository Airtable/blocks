"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var BlockBuilder = require('../builder/block_builder');
var APIClient = require('../api_client');
var parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
var fsUtils = require('../fs_utils');
var path = require('path');
var os = require('os');
var invariant = require('invariant');
var request = require('request');var _require =
require('util'),promisify = _require.promisify;
request.putAsync = promisify(request.put);






function _getOutputDirPath() {
  var timestampString = new Date().getTime().toString();
  return path.join(os.tmpdir(), 'build', timestampString);
}function

_generateBuildArtifactsAsync() {return _generateBuildArtifactsAsync2.apply(this, arguments);}function _generateBuildArtifactsAsync2() {_generateBuildArtifactsAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var blockBuilder, outputDirPath, buildResult;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockBuilder = new BlockBuilder();
            outputDirPath = _getOutputDirPath();_context.next = 4;return (
              blockBuilder.buildAsync(outputDirPath));case 4:buildResult = _context.sent;if (
            buildResult.success) {_context.next = 7;break;}throw (
              buildResult.error);case 7:return _context.abrupt("return",

            buildResult.value);case 8:case "end":return _context.stop();}}}, _callee);}));return _generateBuildArtifactsAsync2.apply(this, arguments);}function


_uploadFrontendBundleAsync(_x, _x2) {return _uploadFrontendBundleAsync2.apply(this, arguments);}function _uploadFrontendBundleAsync2() {_uploadFrontendBundleAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(frontendBundlePath, frontendBundleUploadUrl) {var bundle, response;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
              fsUtils.readFileAsync(frontendBundlePath));case 2:bundle = _context2.sent;_context2.next = 5;return (
              request.putAsync({
                url: frontendBundleUploadUrl,
                body: bundle,
                headers: {
                  'Content-Type': 'application/javascript',
                  'Cache-Control': 'max-age=31536000,immutable',
                  'x-amz-server-side-encryption': 'AES256' } }));case 5:response = _context2.sent;if (!(


            response.statusCode !== 200 && response.statusCode !== 204)) {_context2.next = 8;break;}throw (
              new Error('Failed to upload frontend bundle'));case 8:case "end":return _context2.stop();}}}, _callee2);}));return _uploadFrontendBundleAsync2.apply(this, arguments);}function



setTimeoutAsync(_x3) {return _setTimeoutAsync.apply(this, arguments);}function _setTimeoutAsync() {_setTimeoutAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(timeoutMs) {return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:return _context3.abrupt("return",
            new Promise(function (resolve, reject) {return setTimeout(resolve, timeoutMs);}));case 1:case "end":return _context3.stop();}}}, _callee3);}));return _setTimeoutAsync.apply(this, arguments);}function


_createDeployAndWaitUntilCompletionAsync(_x4, _x5) {return _createDeployAndWaitUntilCompletionAsync2.apply(this, arguments);}function _createDeployAndWaitUntilCompletionAsync2() {_createDeployAndWaitUntilCompletionAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(apiClient, buildId) {var _ref, deployId, _ref2, status;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
            console.log('deploying backend');_context4.next = 3;return (
              apiClient.createDeployAsync(buildId));case 3:_ref = _context4.sent;deployId = _ref.deployId;case 5:if (!

            true) {_context4.next = 21;break;}_context4.next = 8;return (
              apiClient.getDeployStatusAsync(deployId));case 8:_ref2 = _context4.sent;status = _ref2.status;if (!(
            status === 'success')) {_context4.next = 15;break;}
            console.log('successfully deployed backend');return _context4.abrupt("break", 21);case 15:if (!(

            status !== 'deploying')) {_context4.next = 17;break;}throw (
              new Error('Backend deploy did not finish successfully'));case 17:_context4.next = 19;return (



              setTimeoutAsync(500));case 19:_context4.next = 5;break;case 21:return _context4.abrupt("return",


            deployId);case 22:case "end":return _context4.stop();}}}, _callee4);}));return _createDeployAndWaitUntilCompletionAsync2.apply(this, arguments);}function


_uploadBackendDeploymentPackageAsync(_x6, _x7) {return _uploadBackendDeploymentPackageAsync2.apply(this, arguments);}function _uploadBackendDeploymentPackageAsync2() {_uploadBackendDeploymentPackageAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(backendDeploymentPackagePath, backendDeploymentPackageUploadUrl) {var backendDeploymentPackage, response;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
              fsUtils.readFileAsync(backendDeploymentPackagePath));case 2:backendDeploymentPackage = _context5.sent;_context5.next = 5;return (
              request.putAsync({
                url: backendDeploymentPackageUploadUrl,
                body: backendDeploymentPackage,
                headers: { 'x-amz-server-side-encryption': 'AES256' } }));case 5:response = _context5.sent;if (!(

            response.statusCode !== 200 && response.statusCode !== 204)) {_context5.next = 8;break;}throw (
              new Error('Failed to upload backend deployment package'));case 8:case "end":return _context5.stop();}}}, _callee5);}));return _uploadBackendDeploymentPackageAsync2.apply(this, arguments);}function



_buildAndDeployAsync(_x8) {return _buildAndDeployAsync2.apply(this, arguments);}function _buildAndDeployAsync2() {_buildAndDeployAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(apiClient) {var _ref3, frontendBundlePath, backendDeploymentPackagePath, hasBackend, _ref4, buildId, frontendBundleUploadUrl, backendDeploymentPackageUploadUrl, deployId;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.next = 2;return (
              _generateBuildArtifactsAsync());case 2:_ref3 = _context6.sent;frontendBundlePath = _ref3.frontendBundlePath;backendDeploymentPackagePath = _ref3.backendDeploymentPackagePath;

            hasBackend = !!backendDeploymentPackagePath;_context6.next = 8;return (




              apiClient.startBuildAsync(hasBackend));case 8:_ref4 = _context6.sent;buildId = _ref4.buildId;frontendBundleUploadUrl = _ref4.frontendBundleUploadUrl;backendDeploymentPackageUploadUrl = _ref4.backendDeploymentPackageUploadUrl;_context6.prev = 12;


            console.log('uploading build artifacts');_context6.next = 16;return (
              _uploadFrontendBundleAsync(frontendBundlePath, frontendBundleUploadUrl));case 16:if (!

            hasBackend) {_context6.next = 21;break;}
            invariant(backendDeploymentPackagePath, 'backendDeploymentPackagePath');
            invariant(backendDeploymentPackageUploadUrl, 'backendDeploymentPackageUploadUrl');_context6.next = 21;return (
              _uploadBackendDeploymentPackageAsync(backendDeploymentPackagePath, backendDeploymentPackageUploadUrl));case 21:_context6.next = 29;break;case 23:_context6.prev = 23;_context6.t0 = _context6["catch"](12);


            console.log('failed to upload build artifacts', _context6.t0);_context6.next = 28;return (
              apiClient.failBuildAsync(buildId));case 28:throw _context6.t0;case 29:_context6.next = 31;return (


              apiClient.succeedBuildAsync(buildId));case 31:if (!


            hasBackend) {_context6.next = 37;break;}_context6.next = 34;return (
              _createDeployAndWaitUntilCompletionAsync(apiClient, buildId));case 34:deployId = _context6.sent;_context6.next = 38;break;case 37:

            deployId = null;case 38:return _context6.abrupt("return",


            { buildId: buildId, deployId: deployId });case 39:case "end":return _context6.stop();}}}, _callee6, null, [[12, 23]]);}));return _buildAndDeployAsync2.apply(this, arguments);}function


runCommandAsync(_x9) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(argv) {var blockJsonValidationResult, remoteName, apiClientResult, apiClient, _ref5, buildId, deployId;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.next = 2;return (
              parseAndValidateBlockJsonAsync());case 2:blockJsonValidationResult = _context7.sent;if (!
            blockJsonValidationResult.err) {_context7.next = 5;break;}throw (
              blockJsonValidationResult.err);case 5:


            remoteName = argv.remote || null;
            invariant(remoteName === null || typeof remoteName === 'string', 'expects remoteName to be null or a string');_context7.next = 9;return (
              APIClient.constructAPIClientForRemoteAsync(remoteName));case 9:apiClientResult = _context7.sent;if (!
            apiClientResult.err) {_context7.next = 12;break;}throw (
              apiClientResult.err);case 12:

            apiClient = apiClientResult.value;

            console.log('building');_context7.next = 16;return (
              _buildAndDeployAsync(apiClient));case 16:_ref5 = _context7.sent;buildId = _ref5.buildId;deployId = _ref5.deployId;

            console.log('releasing');_context7.next = 22;return (
              apiClient.createReleaseAsync(buildId, deployId));case 22:

            console.log('successfully released block!');case 23:case "end":return _context7.stop();}}}, _callee7);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };