"use strict";var _Object$freeze;function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var invariant = require('invariant');
var request = require('request');var _require =
require('util'),promisify = _require.promisify;
var Environments = require('./types/environments');var _require2 =
require('url'),URL = _require2.URL;var _require3 =
require('./config/block_cli_config_settings'),USER_AGENT = _require3.USER_AGENT,TEST_SERVER_PORT = _require3.TEST_SERVER_PORT;
var parseAndValidateRemoteJsonAsync = require('./helpers/parse_and_validate_remote_json_async');
var getBlockDirPath = require('./get_block_dir_path');
var getApiKeySync = require('./get_api_key_sync');
request.getAsync = promisify(request.get);
request.putAsync = promisify(request.put);
request.postAsync = promisify(request.post);










var apiBaseUrlsByEnvironment = Object.freeze((_Object$freeze = {}, _defineProperty(_Object$freeze,
Environments.PRODUCTION, 'https://api.airtable.com'), _defineProperty(_Object$freeze,
Environments.STAGING, 'https://api-staging.airtable.com'), _defineProperty(_Object$freeze,
Environments.LOCAL, 'https://api.hyperbasedev.com:3000'), _defineProperty(_Object$freeze,
Environments.TEST, 'http://localhost:' + TEST_SERVER_PORT), _Object$freeze));


// TODO(jb): realistically, all of these endpoints should be using `bases` and not `meta`.
// If/when we update the endpoints, we should get rid of support for `meta` here.
var ApiTypes = Object.freeze({
  BASES: 'bases',
  META: 'meta' });var



APIClient = /*#__PURE__*/function () {_createClass(APIClient, null, [{ key: "constructAPIClientForRemoteAsync", value: function () {var _constructAPIClientForRemoteAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(








      remoteName) {var parseResult, remoteJson, apiKey, apiClient;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                  parseAndValidateRemoteJsonAsync(remoteName));case 2:parseResult = _context.sent;if (!
                parseResult.err) {_context.next = 5;break;}return _context.abrupt("return",
                parseResult);case 5:

                remoteJson = parseResult.value;
                apiKey = getApiKeySync(getBlockDirPath());
                apiClient = new APIClient({
                  applicationId: remoteJson.baseId,
                  blockId: remoteJson.blockId,
                  apiBaseUrl: remoteJson.server,
                  apiKey: apiKey });return _context.abrupt("return",

                { value: apiClient });case 9:case "end":return _context.stop();}}}, _callee);}));function constructAPIClientForRemoteAsync(_x) {return _constructAPIClientForRemoteAsync.apply(this, arguments);}return constructAPIClientForRemoteAsync;}() }]);


  function APIClient(opts)





  {_classCallCheck(this, APIClient);_defineProperty(this, "_apiBaseUrl", void 0);_defineProperty(this, "_applicationId", void 0);_defineProperty(this, "_blockInstallationId", void 0);_defineProperty(this, "_blockId", void 0);_defineProperty(this, "_apiKey", void 0);
    this._apiBaseUrl = opts.apiBaseUrl || apiBaseUrlsByEnvironment[Environments.PRODUCTION];
    this._applicationId = opts.applicationId;
    this._blockInstallationId = opts.blockInstallationId || null;
    this._blockId = opts.blockId || null;
    this._apiKey = opts.apiKey;
  }_createClass(APIClient, [{ key: "_getBlockBaseUrl", value: function _getBlockBaseUrl(

    apiType) {
      invariant(this._blockId, 'this._blockId');
      return this._getUrl("/v2/".concat(apiType, "/").concat(this._applicationId, "/blocks/").concat(this._blockId));
    } }, { key: "_getAccessPolicyUrl", value: function _getAccessPolicyUrl()

    {
      invariant(this._blockInstallationId, '_blockInstallationId');
      return this._getUrl("/v2/".concat(ApiTypes.META, "/").concat(this._applicationId, "/blockInstallations/").concat(this._blockInstallationId, "/accessPolicy"));
    } }, { key: "_getUrl", value: function _getUrl(

    path) {
      return new URL(path, this._apiBaseUrl).href;
    } }, { key: "startBuildAsync", value: function () {var _startBuildAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(

      hasBackend) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/builds/start"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: { hasBackend: hasBackend },
                  json: true };_context2.next = 3;return (

                  request.postAsync(options));case 3:response = _context2.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context2.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:return _context2.abrupt("return",

                body);case 9:case "end":return _context2.stop();}}}, _callee2, this);}));function startBuildAsync(_x2) {return _startBuildAsync.apply(this, arguments);}return startBuildAsync;}() }, { key: "succeedBuildAsync", value: function () {var _succeedBuildAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(


      buildId) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/builds/").concat(buildId, "/succeed"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  json: true };_context3.next = 3;return (

                  request.postAsync(options));case 3:response = _context3.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context3.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:case "end":return _context3.stop();}}}, _callee3, this);}));function succeedBuildAsync(_x3) {return _succeedBuildAsync.apply(this, arguments);}return succeedBuildAsync;}() }, { key: "failBuildAsync", value: function () {var _failBuildAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(



      buildId) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/builds/").concat(buildId, "/fail"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  json: true };_context4.next = 3;return (

                  request.postAsync(options));case 3:response = _context4.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context4.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:case "end":return _context4.stop();}}}, _callee4, this);}));function failBuildAsync(_x4) {return _failBuildAsync.apply(this, arguments);}return failBuildAsync;}() }, { key: "createDeployAsync", value: function () {var _createDeployAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(



      buildId) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/deploys/create"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: { buildId: buildId },
                  json: true };_context5.next = 3;return (

                  request.postAsync(options));case 3:response = _context5.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context5.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:return _context5.abrupt("return",

                body);case 9:case "end":return _context5.stop();}}}, _callee5, this);}));function createDeployAsync(_x5) {return _createDeployAsync.apply(this, arguments);}return createDeployAsync;}() }, { key: "getDeployStatusAsync", value: function () {var _getDeployStatusAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(


      deployId) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/deploys/").concat(deployId, "/status"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  json: true };_context6.next = 3;return (

                  request.getAsync(options));case 3:response = _context6.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context6.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:return _context6.abrupt("return",

                body);case 9:case "end":return _context6.stop();}}}, _callee6, this);}));function getDeployStatusAsync(_x6) {return _getDeployStatusAsync.apply(this, arguments);}return getDeployStatusAsync;}() }, { key: "createReleaseAsync", value: function () {var _createReleaseAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(


      buildId, deployId) {var options, response, body, statusCode, errorMessage;return regeneratorRuntime.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                options = {
                  url: "".concat(this._getBlockBaseUrl(ApiTypes.BASES), "/releases/create"),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey) },

                  body: {
                    buildId: buildId,
                    deployId: deployId },

                  json: true };_context7.next = 3;return (

                  request.postAsync(options));case 3:response = _context7.sent;
                body = response.body, statusCode = response.statusCode;if (!(
                statusCode !== 200)) {_context7.next = 8;break;}
                errorMessage = body.errors.map(function (o) {return o.message;}).join('\n');throw (
                  new Error(errorMessage));case 8:return _context7.abrupt("return",

                body);case 9:case "end":return _context7.stop();}}}, _callee7, this);}));function createReleaseAsync(_x7, _x8) {return _createReleaseAsync.apply(this, arguments);}return createReleaseAsync;}() }, { key: "fetchAccessPolicyAsync", value: function () {var _fetchAccessPolicyAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {var options, response, body, statusCode, bodyParsed;return regeneratorRuntime.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:



                options = {
                  url: this._getAccessPolicyUrl(),
                  headers: {
                    Authorization: "Bearer ".concat(this._apiKey),
                    'User-Agent': USER_AGENT } };_context8.next = 3;return (


                  request.getAsync(options));case 3:response = _context8.sent;
                body = response.body;
                statusCode = response.statusCode;
                // If we got a 404, return incorrect app or block id error.
                if (!(statusCode === 404)) {_context8.next = 8;break;}throw (
                  new Error('Incorrect application or block installation id'));case 8:

                bodyParsed = JSON.parse(body);
                // If we got anything else other than 200 and 404, return whatever error we got.
                if (!(statusCode !== 200)) {_context8.next = 11;break;}throw (
                  new Error(bodyParsed.error.message));case 11:return _context8.abrupt("return",

                bodyParsed.accessPolicy);case 12:case "end":return _context8.stop();}}}, _callee8, this);}));function fetchAccessPolicyAsync() {return _fetchAccessPolicyAsync.apply(this, arguments);}return fetchAccessPolicyAsync;}() }, { key: "applicationId", get: function get()


    {
      return this._applicationId;
    } }, { key: "blockInstallationId", get: function get()

    {
      return this._blockInstallationId;
    } }, { key: "apiBaseUrl", get: function get()

    {
      return this._apiBaseUrl;
    } }]);return APIClient;}();_defineProperty(APIClient, "apiBaseUrlsByEnvironment", apiBaseUrlsByEnvironment);


module.exports = APIClient;