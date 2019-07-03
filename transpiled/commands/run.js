"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var invariant = require('invariant');
var getBlockDirPath = require('../get_block_dir_path');
var getApiKeySync = require('../get_api_key_sync');
var BlockServer = require('../block_server');
var LocalSdkBuilder = require('../local_sdk_builder');
var cliHelpers = require('../helpers/cli_helpers');
var parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
var parseAndValidateRemoteJsonAsync = require('../helpers/parse_and_validate_remote_json_async');



var DEFAULT_PORT = 8000;function

runCommandAsync(_x) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {var apiKey, ngrok, transpileAll, sdkRepo, remoteName, blockJsonValidationResult, blockJson, parseRemoteResult, remoteJson, sdkPath, blockServer, port, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            apiKey = getApiKeySync(getBlockDirPath());
            ngrok = argv.ngrok, transpileAll = argv.transpileAll, sdkRepo = argv.sdkRepo;
            remoteName = argv.remote || null;
            invariant(typeof ngrok === 'boolean', 'expects ngrok to be a boolean');
            invariant(typeof transpileAll === 'boolean', 'expects transpileAll to be a boolean');
            invariant(remoteName === null || typeof remoteName === 'string', 'expects remoteName to be null or a string');_context.next = 8;return (

              parseAndValidateBlockJsonAsync());case 8:blockJsonValidationResult = _context.sent;if (!
            blockJsonValidationResult.err) {_context.next = 11;break;}throw (
              blockJsonValidationResult.err);case 11:

            blockJson = blockJsonValidationResult.value;_context.next = 14;return (

              parseAndValidateRemoteJsonAsync(remoteName));case 14:parseRemoteResult = _context.sent;if (!
            parseRemoteResult.err) {_context.next = 17;break;}throw (
              parseRemoteResult.err);case 17:

            remoteJson = parseRemoteResult.value;


            if (sdkRepo) {
              invariant(typeof sdkRepo === 'string', 'expects sdkRepo to be a string');
              sdkPath = sdkRepo;
            } else {
              sdkPath = null;
            }_context.next = 21;return (
              LocalSdkBuilder.startIfNeededAsync(sdkPath));case 21:

            blockServer = new BlockServer({
              apiKey: apiKey,
              transpileAll: transpileAll,
              blockJson: blockJson,
              remoteJson: remoteJson });


            port = DEFAULT_PORT;case 23:if (!
            true) {_context.next = 44;break;}_context.prev = 24;_context.next = 27;return (


              blockServer.startAsync(port, ngrok));case 27:return _context.abrupt("break", 44);case 30:_context.prev = 30;_context.t0 = _context["catch"](24);if (!(






            _context.t0.code === 'EADDRINUSE')) {_context.next = 41;break;}_context.next = 35;return (
              cliHelpers.promptAsync({
                name: 'port',
                description: "Port ".concat(port, " is taken, please provide an alternative port to run on") }));case 35:result = _context.sent;if (!

            Number.isNaN(result.port)) {_context.next = 38;break;}throw (
              new Error('Invalid port number'));case 38:

            // Set our port and re-enter the loop.
            port = result.port;_context.next = 42;break;case 41:throw _context.t0;case 42:_context.next = 23;break;case 44:case "end":return _context.stop();}}}, _callee, null, [[24, 30]]);}));return _runCommandAsync.apply(this, arguments);}








module.exports = { runCommandAsync: runCommandAsync };