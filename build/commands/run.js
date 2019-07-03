"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}var getBlockDirPath = require('../get_block_dir_path');
var getApiKeySync = require('../get_api_key_sync');
var BlockServer = require('../block_server');
var LocalSdkBuilder = require('../local_sdk_builder');
var cliHelpers = require('../helpers/cli_helpers');

var DEFAULT_PORT = 8000;function

runCommandAsync(_x) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {var apiKey, local, transpileAll, sdkRepo, blockServer, port, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            apiKey = getApiKeySync(getBlockDirPath());
            local = argv.local, transpileAll = argv.transpileAll, sdkRepo = argv.sdkRepo;_context.next = 4;return (

              LocalSdkBuilder.startIfNeededAsync(sdkRepo || null));case 4:

            blockServer = new BlockServer({
              apiKey: apiKey,
              transpileAll: transpileAll });


            port = DEFAULT_PORT;case 6:if (!
            true) {_context.next = 27;break;}_context.prev = 7;_context.next = 10;return (


              blockServer.startAsync(port, local));case 10:return _context.abrupt("break", 27);case 13:_context.prev = 13;_context.t0 = _context["catch"](7);if (!(






            _context.t0.code === 'EADDRINUSE')) {_context.next = 24;break;}_context.next = 18;return (
              cliHelpers.promptAsync({
                name: 'port',
                description: "Port ".concat(port, " is taken, please provide an alternative port to run on") }));case 18:result = _context.sent;if (!

            isNaN(result.port)) {_context.next = 21;break;}throw (
              new Error('Invalid port number'));case 21:

            // Set our port and re-enter the loop.
            port = result.port;_context.next = 25;break;case 24:throw _context.t0;case 25:_context.next = 6;break;case 27:case "end":return _context.stop();}}}, _callee, null, [[7, 13]]);}));return _runCommandAsync.apply(this, arguments);}








module.exports = { runCommandAsync: runCommandAsync };