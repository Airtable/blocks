/* eslint-disable no-console */
'use strict';function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var _ = require('lodash');
var express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var envify = require('envify/custom');
var babelify = require('babelify');
var watchify = require('watchify');
var generateBlockBabelConfig = require('./generate_block_babel_config');
var blocksConfigSettings = require('./config/block_cli_config_settings');
var generateBlockClientWrapperCode = require('./generate_block_client_wrapper');
var APIClient = require('./api_client');
var fsUtils = require('./fs_utils');
var childProcessHelpers = require('./helpers/child_process_helpers');
var BlockBackendMessageTypes = require('./block_backend_message_types');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var chokidar = require('chokidar');
var getBlockDirPath = require('./get_block_dir_path');
var getDeveloperCredentialsEncryptedIfExistsAsync = require('./get_developer_credentials_encrypted_if_exists_async');
var normalizeUserResponse = require('./normalize_user_response');
var Environments = require('./types/environments');
var semver = require('semver');

var events = require('events');
var bundleMessageBus = new events.EventEmitter();

// Minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
var developmentBrowsers = [
'chrome 61', // Desktop (electron) app.
'last 2 chrome versions',
'last 2 firefox versions',
'last 1 safari version',
'last 1 edge version'];


// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
var allSupportedBrowsers = ['firefox >= 29', 'chrome >= 32', 'safari >= 9', 'edge >= 13'];var

BlockServer = /*#__PURE__*/function () {
  function BlockServer() {var _this = this;var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$transpileAll = _ref.transpileAll,transpileAll = _ref$transpileAll === void 0 ? false : _ref$transpileAll,apiKey = _ref.apiKey;_classCallCheck(this, BlockServer);
    this._pendingLongPollResponsesByRequestId = {};
    this._expressApp = express();
    this._shouldTranspileAll = transpileAll;
    this._nextRequestId = 0;
    this._pendingBackendResponsesByRequestId = {};
    this._apiKey = apiKey;
    this._developerCredentialPlaintextByName = null;

    this._watchBackendCode();
    this._setUpExpressRoutes();
    this._setUpRunFrameRoutes();
    this._setUpBackendRoutes();
    this._setUpBlockSdkAndWrapper();
    this._setUpBundler();

    bundleMessageBus.on('bundleUpdated', function () {
      // Whenever the bundle gets updated, return 200 to all the pending
      // long poll requests to automatically reload the page.
      Object.keys(_this._pendingLongPollResponsesByRequestId).forEach(function (requestId) {
        var res = _this._pendingLongPollResponsesByRequestId[requestId];
        res.sendStatus(200);
        delete _this._pendingLongPollResponsesByRequestId[requestId];
      });
    });
  }_createClass(BlockServer, [{ key: "_watchBackendCode", value: function _watchBackendCode()
    {
      var blockDirPath = getBlockDirPath();
      var blockJsonPath = path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME);
      var backendRoutePath = path.join(blockDirPath, 'backendRoute');
      var sharedPath = path.join(blockDirPath, 'shared');
      // Unlike fs.watch, chokidar lets us watch paths that may not exist yet.
      chokidar.watch([blockJsonPath, backendRoutePath, sharedPath]).on('change', this.startBackendProcessIfNeeded.bind(this));
    } }, { key: "_setUpExpressRoutes", value: function _setUpExpressRoutes()
    {var _this2 = this;
      // Set Access-Control-Allow-Origin on all requests.
      this._expressApp.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next(null, req, res, next);
      });

      // Set a requestId on each request.
      this._expressApp.use(function (req, res, next) {
        req.requestId = _this2._nextRequestId;
        _this2._nextRequestId++;
        next(null, req, res, next);
      });
    } }, { key: "_setUpRunFrameRoutes", value: function _setUpRunFrameRoutes()
    {var _this3 = this;
      var blockDirPath = getBlockDirPath();
      var runFrameRoutes = express.Router();

      // Use body parser for JSON payloads.
      runFrameRoutes.use(bodyParser.json({ limit: blocksConfigSettings.BLOCK_REQUEST_BODY_LIMIT }));

      // Serve the bundle file.
      runFrameRoutes.get('/bundle.js', function (req, res) {
        res.sendFile(blocksConfigSettings.BUNDLE_FILE_NAME, {
          root: path.join(blockDirPath, blocksConfigSettings.BUILD_DIR) });

      });

      runFrameRoutes.options('/registerBlockInstallationMetadata', function (req, res) {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Max-Age': 86400,
          'Access-Control-Allow-Headers': 'Content-Type' }).
        status(200).end();
      });

      runFrameRoutes.post('/registerBlockInstallationMetadata', function (req, res) {
        if (!req.body || !req.body.applicationId || !req.body.blockInstallationId) {
          res.status(400).send({
            error: 'BAD_REQUEST',
            message: 'Must include applicationId and blockInstallationId in request body' });

        } else {
          var blockData = JSON.parse(fs.readFileSync(path.join(blockDirPath, 'block.json')));

          if (!_this3._apiClient || _this3._apiClient.blockInstallationId !== req.body.blockInstallationId) {
            console.log('Switched to a new block installation.');
          }

          _this3._apiClient = new APIClient({
            environment: blockData.environment,
            applicationId: req.body.applicationId,
            blockInstallationId: req.body.blockInstallationId,
            apiKey: _this3._apiKey });

          res.sendStatus(200);
        }
      });

      runFrameRoutes.get('/poll', function (req, res) {
        // After 30 sec, send a request timeout to tell the client to retry.
        res.setTimeout(30000, function () {
          delete _this3._pendingLongPollResponsesByRequestId[req.requestId];
          res.sendStatus(408);
        });
        _this3._pendingLongPollResponsesByRequestId[req.requestId] = res;
      });

      this._expressApp.use('/__runFrame', runFrameRoutes);
    } }, { key: "_setUpBackendRoutes", value: function _setUpBackendRoutes()
    {var _this4 = this;
      var backendRoutes = express.Router();
      var textBodyParser = bodyParser.text({
        type: function type() {return true;},
        limit: blocksConfigSettings.BLOCK_REQUEST_BODY_LIMIT });

      backendRoutes.use(textBodyParser);

      // Send any other requests to the backend to be handled.
      backendRoutes.use(function (req, res) {
        if (_this4._isStartingBackendProcess) {
          // If the backend process is restarting (or just starting),
          // return a 503 to all requests during this period.
          res.status(503).send({
            error: 'SERVICE_UNAVAILABLE',
            message: 'Deploy in progress. Try again.' });

        } else if (!_this4._doesBlockHaveBackend() || !_this4._backendProcess) {
          // If this block has no backend routes at all (and therefore
          // no backend process), 404 on all requests.
          res.status(404).send({
            body: 'NOT_FOUND' });

        } else {
          _this4._fireRequestToBackend(req, res);
        }
      });

      this._expressApp.use('/', backendRoutes);
    } }, { key: "_getApiBaseUrlForEnvironment", value: function _getApiBaseUrlForEnvironment(
    environment) {
      switch (environment) {
        case Environments.TEST:
          return 'http://localhost:' + blocksConfigSettings.TEST_SERVER_PORT;
        case Environments.LOCAL:
          return 'https://api.hyperbasedev.com:3000';
        case Environments.STAGING:
          return 'https://api-staging.airtable.com';
        case Environments.PRODUCTION:
        default:
          return 'https://api.airtable.com';}

    } }, { key: "_fireRequestToBackend", value: function _fireRequestToBackend(
    req, res) {var _this5 = this;
      if (!this._apiClient || !this._apiClient.applicationId || !this._apiClient.blockInstallationId) {
        console.log(chalk.bold('Did not receive block information from Airtable. Cannot fulfill backend request'));
        return;
      }

      // Fetch an access policy for this invocation, so the backend code can make requests
      // to Airtable.
      this._apiClient.fetchAccessPolicyAsync().then(function (apiAccessPolicyString) {
        var event = {
          requestId: req.requestId,
          method: req.method,
          query: req.query,
          path: req.path,
          body: req.body,
          headers: req.headers,
          apiAccessPolicyString: apiAccessPolicyString,
          applicationId: _this5._apiClient.applicationId,
          blockInstallationId: _this5._apiClient.blockInstallationId,
          kvValuesByKey: undefined, // SDK will fetch the kvValuesByKey.
          apiBaseUrl: _this5._getApiBaseUrlForEnvironment(_this5._apiClient.environment) };

        // Save the response object for when the backend process responds.
        _this5._pendingBackendResponsesByRequestId[req.requestId] = res;

        // Lambda invocation is approximately 300ms, so we want the cli
        // to be approximately as slow in order to simulate realistic UX.
        var lambdaSimulationDelayMs = 300;
        setTimeout(function () {
          // Send event to the process serving backend requests.
          _this5._backendProcess.send(event);
        }, lambdaSimulationDelayMs);
      }, function (err) {
        console.log(err);
      });
    } }, { key: "_setUpBlockSdkAndWrapper", value: function _setUpBlockSdkAndWrapper(
    url) {
      var blockDirPath = getBlockDirPath();

      // Check if react and react-dom are listed in package.json.
      var packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'));
      var dependencies = JSON.parse(packageJson).dependencies;
      var dependenciesList = Object.keys(dependencies);
      if (!_.includes(dependenciesList, 'react') || !_.includes(dependenciesList, 'react-dom')) {
        console.log(
        'Please ensure that react and react-dom packages are installed and listed in package.json');

        process.exit(1);
      }

      // Check if the node_modules directory exists.
      var nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
      var nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
      if (!nodeModulesDirExists) {
        console.log("Must run yarn in ".concat(blockDirPath, " first to install modules"));
        process.exit(1);
      }
      // Get the block entry point.
      var frontendEntryModulePath;
      try {
        var blockMetadataJson = fs.readFileSync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME));

        var blockMetadata = JSON.parse(blockMetadataJson);
        frontendEntryModulePath = path.join(
        blockDirPath,
        'frontend',
        blockMetadata.frontendEntryModuleName);

      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('This directory does not contain a block');
        } else {
          console.log(err.message);
        }
        process.exit(1);
      }

      // Check if frontendEntryModule exists.
      var frontendEntryModuleExists = fs.existsSync(frontendEntryModulePath);
      if (!frontendEntryModuleExists) {
        console.log("The entry module at ".concat(
        frontendEntryModulePath, " does not exist. If you changed the entry module, please run 'block rename-entry <newName>'"));

        process.exit(1);
      }

      // Drop in the block SDK stub if it isn't already there.
      var blockSdkDirPath = path.join(
      blockDirPath,
      'node_modules',
      blocksConfigSettings.SDK_PACKAGE_NAME);

      var blockSdkExists = fs.existsSync(blockSdkDirPath);
      if (!blockSdkExists) {
        fs.mkdirSync(blockSdkDirPath);
        fs.writeFileSync(
        path.join(blockSdkDirPath, 'index.js'), "module.exports = (typeof window !== 'undefined' ? window : global)['".concat(
        blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME, "'];"));

      }

      // Write the client wrapper file.
      var buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
      if (!fs.existsSync(buildDirPath)) {
        fs.mkdirSync(buildDirPath);
      }
      var clientWrapperFilepath = path.join(buildDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME);
      var isDevelopment = true;
      var clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, isDevelopment);
      fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
    } }, { key: "_setUpBundler", value: function _setUpBundler()
    {
      var blockDirPath = getBlockDirPath();

      var browsers = this._shouldTranspileAll ? allSupportedBrowsers : developmentBrowsers;
      console.log('Transpiling code for the following browsers');
      browsers.forEach(function (browser) {return console.log("  - ".concat(browser));});
      if (this._shouldTranspileAll) {
        console.log('These are all the browsers that Airtable supports.');
      } else {
        console.log('These are recent browsers that support many modern JS features, which makes');
        console.log('debugging easier even with source maps. To transpile code for all the browsers');
        console.log('that Airtable supports, use --transpile-all');
      }
      console.log('');

      this._bundler = browserify(
      path.join(
      blockDirPath,
      blocksConfigSettings.BUILD_DIR,
      blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME),

      {
        cache: {},
        debug: true,
        packageCache: {},
        plugin: [watchify],
        paths: [blockDirPath],
        transform: [
        babelify.configure(generateBlockBabelConfig({
          browsers: this._shouldTranspileAll ?
          allSupportedBrowsers :
          developmentBrowsers }))] });





      this._bundler.on('update', this.bundle.bind(this));
      this._bundler.on('bundle', function () {return console.log('Updating bundle...');});
    } }, { key: "_doesBlockHaveBackend", value: function _doesBlockHaveBackend()
    {
      var blockDirPath = getBlockDirPath();
      var backendDirPath = path.join(blockDirPath, 'backendRoute');
      return fs.existsSync(backendDirPath);
    } }, { key: "startBackendProcessIfNeeded", value: function startBackendProcessIfNeeded()
    {var _this6 = this;
      // If our block doesn't have any backend routes, don't start the process.
      if (!this._doesBlockHaveBackend()) {
        return;
      }
      // Set a flag so our server knows not to forward requests
      // to the backend process while it is starting up.
      this._isStartingBackendProcess = true;
      // Stop our existing backend process, if we have one.
      if (this._backendProcess && this._backendProcess.connected) {
        this._backendProcess.disconnect();
      }
      console.log('Updating backend...');
      // Create a new process to run the user's backend code so errors do not propagate
      // to blocks-cli and to emulate the Lambda environment more closely.
      this._backendProcess = childProcessHelpers.fork(path.join(__dirname, 'block_backend_handler'), {
        env: this.generateEnvironmentVariablesForBackendProcess(),
        execArgv: [
        // HACK: production blocks currently run node 8.10. node 8.14
        // changed the default max http header size from 80kb to 8kb, so
        // if the user's local node version is >= 8.14, set the max http
        // header size back to 80kb. Ideally blocks-cli should actually
        // use the same version of node that the block runs in
        // production.
        semver.gte(process.versions.node, '8.14.0') ? '--max-http-header-size=80000' : null].
        filter(function (arg) {return !!arg;}),
        prefix: 'backend' });


      // Configure the block server to handle event responses sent by the backend process.
      this._pendingBackendResponsesByRequestId = {};
      this._backendProcess.on('message', function (response) {
        switch (response.messageType) {
          case BlockBackendMessageTypes.EVENT_RESPONSE:{
              // Fetch response object from when request was made.
              var res = _this6._pendingBackendResponsesByRequestId[response.requestId];
              if (!res) {
                console.log('Response object for request cannot be found...');
                return;
              }var _normalizeUserRespons =

              normalizeUserResponse(response),statusCode = _normalizeUserRespons.statusCode,headers = _normalizeUserRespons.headers,body = _normalizeUserRespons.body;
              res.writeHead(statusCode, headers);
              res.end(body);

              break;
            }
          case BlockBackendMessageTypes.PROCESS_READY:
            if (response.pid === _this6._backendProcess.pid) {
              // If this process matches our current backend
              // process, signal that it has finished starting
              // up to start forwarding requests to it again.
              _this6._isStartingBackendProcess = false;
              console.log('Backend updated');
            }
            break;
          default:
          // no-op
        }
      });

      this._backendProcess.on('error', function (err) {
        // Swallow any errors and log in console. This will allow for
        // recovery on next bundle update.
        console.error('ChildProcess Error:', err.message);
      });
    } }, { key: "setPublicBaseUrl", value: function setPublicBaseUrl(
    publicBaseUrl) {
      // Use process.env to provide the base URL.
      this._bundler.transform(
      envify({
        BLOCK_BASE_URL: publicBaseUrl }));


    }

    /**
       * 1. Read and decode the developerCredentialsEncrypted from the local file.
       * 2. Decrypt by hitting the public Decrypt API in Airtable.
       * 3. Set decrypted values as an instance variable. The startBackendProcessIfNeeded() method
       *    will set an Environment Variable from the instance variable.
       *
       * This only considers the development credential type from the developer credentials
       * when starting the server. It ignores the release credential type.
       */ }, { key: "setDevelopmentCredentialPlaintextByNameAsync", value: function () {var _setDevelopmentCredentialPlaintextByNameAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var blockData, developerCredentialsEncrypted, credentialsEncrypted, credentialsPlaintext;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:

                blockData = JSON.parse(fs.readFileSync(path.join(getBlockDirPath(), blocksConfigSettings.BLOCK_FILE_NAME)));_context.next = 3;return (
                  getDeveloperCredentialsEncryptedIfExistsAsync());case 3:developerCredentialsEncrypted = _context.sent;if (!(
                developerCredentialsEncrypted === null)) {_context.next = 7;break;}
                this._developerCredentialPlaintextByName = null;return _context.abrupt("return");case 7:



                credentialsEncrypted =
                developerCredentialsEncrypted.
                filter(function (developerCredentialEncrypted) {return !!developerCredentialEncrypted.developmentCredentialValueEncrypted;}).
                map(function (developerCredentialEncrypted) {
                  return {
                    name: developerCredentialEncrypted.name,
                    kmsDataKeyId: developerCredentialEncrypted.kmsDataKeyId,
                    credentialValueEncrypted: developerCredentialEncrypted.developmentCredentialValueEncrypted };

                });if (!(

                credentialsEncrypted.length === 0)) {_context.next = 10;break;}return _context.abrupt("return");case 10:




                if (!this._apiClient) {
                  this._apiClient = new APIClient({
                    environment: blockData.environment,
                    applicationId: blockData.applicationId,
                    blockId: blockData.blockId,
                    apiKey: this._apiKey });

                }_context.next = 13;return (
                  this._apiClient.decryptCredentialsAsync(credentialsEncrypted));case 13:credentialsPlaintext = _context.sent;

                if (credentialsPlaintext) {
                  this._developerCredentialPlaintextByName =
                  credentialsPlaintext.reduce(function (credentialPlaintextByName, credentialPlaintext) {
                    credentialPlaintextByName[credentialPlaintext.name] = credentialPlaintext.credentialValuePlaintext;
                    return credentialPlaintextByName;
                  }, {});
                } else {
                  this._developerCredentialPlaintextByName = null;
                }case 15:case "end":return _context.stop();}}}, _callee, this);}));function setDevelopmentCredentialPlaintextByNameAsync() {return _setDevelopmentCredentialPlaintextByNameAsync.apply(this, arguments);}return setDevelopmentCredentialPlaintextByNameAsync;}() }, { key: "generateEnvironmentVariablesForBackendProcess", value: function generateEnvironmentVariablesForBackendProcess()

    {
      var env = {
        FORCE_COLOR: 1,
        NODE_ENV: 'development' };

      if (this._developerCredentialPlaintextByName) {
        env.DEVELOPER_CREDENTIAL_BY_NAME = JSON.stringify(this._developerCredentialPlaintextByName);
      }

      return env;
    } }, { key: "startAsync", value: function () {var _startAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
      port, local) {var url;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!
                local) {_context2.next = 6;break;}_context2.next = 3;return (
                  this.startLocalAsync(port));case 3:_context2.t0 = _context2.sent;_context2.next = 9;break;case 6:_context2.next = 8;return (
                  this.startNgrokAsync(port));case 8:_context2.t0 = _context2.sent;case 9:url = _context2.t0;
                this.setPublicBaseUrl(url);_context2.next = 13;return (
                  this.setDevelopmentCredentialPlaintextByNameAsync());case 13:
                this.startBackendProcessIfNeeded();
                this.bundle(null, function () {
                  console.log(chalk.white.bgBlue.bold(" Serving block at ".concat(url, " ")));
                });case 15:case "end":return _context2.stop();}}}, _callee2, this);}));function startAsync(_x, _x2) {return _startAsync.apply(this, arguments);}return startAsync;}() }, { key: "startNgrokAsync", value: function () {var _startNgrokAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(

      port) {var _this7 = this;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (

                  new Promise(function (resolve, reject) {
                    _this7._expressApp.
                    listen(port).
                    on('error', reject).
                    on('listening', resolve);
                  }));case 2:_context3.next = 4;return (

                  new Promise(function (resolve, reject) {
                    require('ngrok').connect(port, function (err, url) {
                      if (err) {
                        reject(err);
                      }
                      resolve(url);
                    });
                  }));case 4:return _context3.abrupt("return", _context3.sent);case 5:case "end":return _context3.stop();}}}, _callee3);}));function startNgrokAsync(_x3) {return _startNgrokAsync.apply(this, arguments);}return startNgrokAsync;}() }, { key: "startLocalAsync", value: function () {var _startLocalAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(

      port) {var _this8 = this;var _ref2, _ref3, key, cert, url;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (

                  Promise.all([
                  fsUtils.readFileAsync(path.join(__dirname, '../keys/server.key'), 'utf8'),
                  fsUtils.readFileAsync(path.join(__dirname, '../keys/server.crt'), 'utf8')]));case 2:_ref2 = _context4.sent;_ref3 = _slicedToArray(_ref2, 2);key = _ref3[0];cert = _ref3[1];_context4.next = 8;return (


                  new Promise(function (resolve, reject) {
                    var server = https.createServer({ cert: cert, key: key }, _this8._expressApp);
                    server.
                    listen(port).
                    on('error', reject).
                    on('listening', resolve);
                  }));case 8:
                url = "https://localhost:".concat(port);
                console.log('Local mode: serving self-signed https on localhost');
                console.log(
                "If this is the first time you're running this command in local mode, you need to do some extra setup in your browser:");

                console.log("  - Firefox: go to https://localhost:".concat(port, " and add an ssl exception"));
                console.log("  - Safari: go to https://localhost:".concat(
                port, ", click show details > visit this website, and log in"));

                console.log(
                '  - Chrome: go to chrome://flags/#allow-insecure-localhost and click enable. Restart your browser');

                console.log('');return _context4.abrupt("return",
                url);case 16:case "end":return _context4.stop();}}}, _callee4);}));function startLocalAsync(_x4) {return _startLocalAsync.apply(this, arguments);}return startLocalAsync;}() }, { key: "bundle", value: function bundle(

    files, callback) {
      if (files && files.findIndex(function (file) {return file.includes('package.json');}) !== -1) {
        // When yarn adds or removes packages, it deletes the symlinks
        // and SDK stub we add to node_modules. As a temporary fix, we
        // quit and ask the user to restart the CLI. Note that we can't
        // easily regenerate the symlinks and stub at this point because
        // package.json updates before yarn deletes our files.
        console.log('package.json changed, please run again.');
        process.exit(0);
      }

      var blockDirPath = getBlockDirPath();
      var fsStream = fs.createWriteStream(path.join(
      blockDirPath,
      blocksConfigSettings.BUILD_DIR,
      blocksConfigSettings.BUNDLE_FILE_NAME));

      fsStream.on('finish', function () {
        if (fsStream.bytesWritten > 0) {
          console.log('Bundle updated');
          bundleMessageBus.emit('bundleUpdated');
          if (callback) {
            callback();
          }
        }
      });
      this._bundler.
      bundle().
      on('error', function (err) {
        console.error(err.message);
        if (err.codeFrame) {
          console.error(err.codeFrame);
        }
        this.emit('end');
      }).
      pipe(fsStream);
    } }]);return BlockServer;}();


module.exports = BlockServer;