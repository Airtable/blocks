"use strict";var _apiBaseUrlsByEnviron;function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var invariant = require('invariant');
var request = require('request');
var promisify = require('es6-promisify');
var Environments = require('./types/environments');var _require =
require('url'),URL = _require.URL;var _require2 =
require('./config/block_cli_config_settings'),TEST_SERVER_PORT = _require2.TEST_SERVER_PORT;
request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);
request.postAsync = promisify(request.post);

















var apiBaseUrlsByEnvironment = (_apiBaseUrlsByEnviron = {}, _defineProperty(_apiBaseUrlsByEnviron,
Environments.PRODUCTION, 'https://api.airtable.com'), _defineProperty(_apiBaseUrlsByEnviron,
Environments.STAGING, 'https://api-staging.airtable.com'), _defineProperty(_apiBaseUrlsByEnviron,
Environments.LOCAL, 'https://api.hyperbasedev.com:3000'), _defineProperty(_apiBaseUrlsByEnviron,
Environments.TEST, 'http://localhost:' + TEST_SERVER_PORT), _apiBaseUrlsByEnviron);var


APIClient = /*#__PURE__*/function () {






  function APIClient(opts)





  {_classCallCheck(this, APIClient);_defineProperty(this, "_environment", void 0);_defineProperty(this, "_applicationId", void 0);_defineProperty(this, "_blockInstallationId", void 0);_defineProperty(this, "_blockId", void 0);_defineProperty(this, "_apiKey", void 0);
    this._environment = opts.environment || Environments.PRODUCTION;
    this._applicationId = opts.applicationId;
    this._blockInstallationId = opts.blockInstallationId || null;
    this._blockId = opts.blockId || null;
    this._apiKey = opts.apiKey;
  }_createClass(APIClient, [{ key: "_getRequestUrl", value: function _getRequestUrl()

    {
      invariant(this._blockId, '_blockId');
      return this._getUrl("/v2/meta/".concat(this._applicationId, "/blocks/").concat(this._blockId));
    } }, { key: "updateBlockAsync", value: function () {var _updateBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(

      data) {var options, response, body, statusCode;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                options = {
                  url: this._getRequestUrl(),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: data,
                  json: true };_context.next = 3;return (

                  request.putAsync(options));case 3:response = _context.sent;
                body = response.body;
                statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context.next = 8;break;}throw (
                  new Error(body.error.message));case 8:return _context.abrupt("return",

                body);case 9:case "end":return _context.stop();}}}, _callee, this);}));function updateBlockAsync(_x) {return _updateBlockAsync.apply(this, arguments);}return updateBlockAsync;}() }, { key: "fetchBlockAsync", value: function () {var _fetchBlockAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var options, response, body, statusCode, bodyParsed;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:



                options = {
                  url: this._getRequestUrl(),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) } };_context2.next = 3;return (


                  request.getAsync(options));case 3:response = _context2.sent;
                body = response.body;
                statusCode = response.statusCode;
                // If we got a 404, return incorrect app or block id error.
                if (!(statusCode === 404)) {_context2.next = 8;break;}throw (
                  new Error('Incorrect application or block id'));case 8:

                bodyParsed = JSON.parse(body);
                // If we got anything else other than 200 and 404, return whatever error we got.
                if (!(statusCode !== 200)) {_context2.next = 11;break;}throw (
                  new Error(bodyParsed.error.message));case 11:return _context2.abrupt("return",

                bodyParsed);case 12:case "end":return _context2.stop();}}}, _callee2, this);}));function fetchBlockAsync() {return _fetchBlockAsync.apply(this, arguments);}return fetchBlockAsync;}() }, { key: "decryptCredentialsAsync", value: function () {var _decryptCredentialsAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(



      credentialsEncrypted) {var options, response, body, statusCode;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:

                options = {
                  url: "".concat(this._getRequestUrl(), "/credentials/decrypt"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: { credentialsEncrypted: credentialsEncrypted },
                  json: true };_context3.next = 3;return (

                  request.postAsync(options));case 3:response = _context3.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context3.next = 7;break;}throw (
                  new Error(body.error.message));case 7:return _context3.abrupt("return",


                body);case 8:case "end":return _context3.stop();}}}, _callee3, this);}));function decryptCredentialsAsync(_x2) {return _decryptCredentialsAsync.apply(this, arguments);}return decryptCredentialsAsync;}() }, { key: "encryptCredentialAsync", value: function () {var _encryptCredentialAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(



      credentialPlaintext,
      kmsDataKeyId) {var options, response, body, statusCode;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:

                options = {
                  url: "".concat(this._getRequestUrl(), "/credential/encrypt"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: {
                    credentialPlaintext: credentialPlaintext,
                    kmsDataKeyId: kmsDataKeyId },

                  json: true };_context4.next = 3;return (

                  request.postAsync(options));case 3:response = _context4.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context4.next = 7;break;}throw (
                  new Error(body.error.message));case 7:return _context4.abrupt("return",


                body);case 8:case "end":return _context4.stop();}}}, _callee4, this);}));function encryptCredentialAsync(_x3, _x4) {return _encryptCredentialAsync.apply(this, arguments);}return encryptCredentialAsync;}() }, { key: "reEncryptCredentialAsync", value: function () {var _reEncryptCredentialAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(



      credentialEncrypted,
      newKmsDataKeyId) {var options, response, body, statusCode;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:

                options = {
                  url: "".concat(this._getRequestUrl(), "/credential/reEncrypt"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: {
                    credentialEncrypted: credentialEncrypted,
                    newKmsDataKeyId: newKmsDataKeyId },

                  json: true };_context5.next = 3;return (

                  request.postAsync(options));case 3:response = _context5.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context5.next = 7;break;}throw (
                  new Error(body.error.message));case 7:return _context5.abrupt("return",


                body);case 8:case "end":return _context5.stop();}}}, _callee5, this);}));function reEncryptCredentialAsync(_x5, _x6) {return _reEncryptCredentialAsync.apply(this, arguments);}return reEncryptCredentialAsync;}() }, { key: "_getAccessPolicyUrl", value: function _getAccessPolicyUrl()


    {
      invariant(this._blockInstallationId, '_blockInstallationId');
      return this._getUrl("/v2/meta/".concat(this._applicationId, "/blockInstallations/").concat(this._blockInstallationId, "/accessPolicy"));
    } }, { key: "_getUrl", value: function _getUrl(

    path) {
      var baseUrl = apiBaseUrlsByEnvironment[this._environment];
      return new URL(path, baseUrl).href;
    } }, { key: "fetchAccessPolicyAsync", value: function () {var _fetchAccessPolicyAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {var options, response, body, statusCode, bodyParsed;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:


                options = {
                  url: this._getAccessPolicyUrl(),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) } };_context6.next = 3;return (


                  request.getAsync(options));case 3:response = _context6.sent;
                body = response.body;
                statusCode = response.statusCode;
                // If we got a 404, return incorrect app or block id error.
                if (!(statusCode === 404)) {_context6.next = 8;break;}throw (
                  new Error('Incorrect application or block installation id'));case 8:

                bodyParsed = JSON.parse(body);
                // If we got anything else other than 200 and 404, return whatever error we got.
                if (!(statusCode !== 200)) {_context6.next = 11;break;}throw (
                  new Error(bodyParsed.error.message));case 11:return _context6.abrupt("return",

                bodyParsed.accessPolicy);case 12:case "end":return _context6.stop();}}}, _callee6, this);}));function fetchAccessPolicyAsync() {return _fetchAccessPolicyAsync.apply(this, arguments);}return fetchAccessPolicyAsync;}() }, { key: "applicationId", get: function get()


    {
      return this._applicationId;
    } }, { key: "blockInstallationId", get: function get()

    {
      return this._blockInstallationId;
    } }, { key: "environment", get: function get()

    {
      return this._environment;
    } }]);return APIClient;}();


module.exports = APIClient;