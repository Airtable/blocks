"use strict";var _domainByEnvironment;function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var cliHelpers = require('./cli_helpers');
var Environments = require('../types/environments');var _require =
require('../config/block_cli_config_settings'),TEST_SERVER_PORT = _require.TEST_SERVER_PORT;



var domainByEnvironment = (_domainByEnvironment = {}, _defineProperty(_domainByEnvironment,
Environments.PRODUCTION, 'airtable.com'), _defineProperty(_domainByEnvironment,
Environments.STAGING, 'staging.airtable.com'), _defineProperty(_domainByEnvironment,
Environments.LOCAL, 'hyperbasedev.com:3000'), _defineProperty(_domainByEnvironment,
Environments.TEST, 'localhost:' + TEST_SERVER_PORT), _domainByEnvironment);function


promptForApiKeyAsync(_x) {return _promptForApiKeyAsync.apply(this, arguments);}function _promptForApiKeyAsync() {_promptForApiKeyAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(environment) {var domain, result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            domain = domainByEnvironment[environment];_context.next = 3;return (
              cliHelpers.promptAsync({
                name: 'apiKey',
                description: "Please enter your API key. You can generate one at https://".concat(domain, "/account") }));case 3:result = _context.sent;return _context.abrupt("return",

            result.apiKey);case 5:case "end":return _context.stop();}}}, _callee);}));return _promptForApiKeyAsync.apply(this, arguments);}


module.exports = promptForApiKeyAsync;