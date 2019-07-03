"use strict";function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
/* eslint-disable no-console */
var _ = require('lodash');
var invariant = require('invariant');
var express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var envify = require('envify/custom');
var babelify = require('babelify');
var watchify = require('watchify');
var AnsiToHtmlConverter = require('ansi-to-html');
var ErrorCodes = require('./types/error_codes');
var generateBlockBabelConfig = require('./generate_block_babel_config');
var blockCliConfigSettings = require('./config/block_cli_config_settings');
var generateBlockClientWrapperCode = require('./generate_block_client_wrapper');
var APIClient = require('./api_client');
var fsUtils = require('./fs_utils');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var getBlockDirPath = require('./get_block_dir_path');
var getBlocksCliProjectRootPath = require('./helpers/get_blocks_cli_project_root_path');
var clipboardy = require('clipboardy');



















// eslint-disable-line flowtype/no-weak-types

// Minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
var developmentBrowsers = [
'chrome 61', // Desktop (electron) app.
'last 2 chrome versions',
'last 2 firefox versions',
'last 1 safari version',
'last 1 edge version'];


// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
var allSupportedBrowsers = ['firefox >= 29', 'chrome >= 32', 'safari >= 9', 'edge >= 13'];

var BUNDLE_TIMEOUT_MS = 10000; // 10 seconds
var LONG_POLL_TIMEOUT_MS = 30000; // 30 seconds
var
BlockServer = /*#__PURE__*/function () {














  function BlockServer(args)




  {_classCallCheck(this, BlockServer);_defineProperty(this, "_pendingLongPollResolveRejectByRequestId", void 0);_defineProperty(this, "_expressApp", void 0);_defineProperty(this, "_shouldTranspileAll", void 0);_defineProperty(this, "_nextRequestId", void 0);_defineProperty(this, "_apiKey", void 0);_defineProperty(this, "_bundlePromiseIfExists", void 0);_defineProperty(this, "_blockJson", void 0);_defineProperty(this, "_remoteJson", void 0);_defineProperty(this, "_apiClient", void 0);_defineProperty(this, "_bundler", void 0);var _args$transpileAll =





    args.transpileAll,transpileAll = _args$transpileAll === void 0 ? false : _args$transpileAll,apiKey = args.apiKey,blockJson = args.blockJson,remoteJson = args.remoteJson;

    this._pendingLongPollResolveRejectByRequestId = new Map();
    this._expressApp = express();
    this._shouldTranspileAll = transpileAll;
    this._nextRequestId = 0;
    this._apiKey = apiKey;
    this._bundlePromiseIfExists = null;
    this._blockJson = blockJson;
    this._remoteJson = remoteJson;

    this._setUpExpressRoutes();
    this._setUpRunFrameRoutes();
    this._setUpBlockSdkAndWrapper();
    this._setUpBundler();
  }_createClass(BlockServer, [{ key: "_setUpExpressRoutes", value: function _setUpExpressRoutes()
    {var _this = this;
      // Set Access-Control-Allow-Origin on all requests.
      this._expressApp.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next();
      });

      // Set a requestId on each request.
      this._expressApp.use(function (req, res, next) {
        // Flow typecasting the `req` const to be `RequestWithRequestId`
        // because all request objects after this middleware should
        // have the "requestId" attribute defined to `req`.
        req.requestId = _this._nextRequestId; // eslint-disable-line flowtype/no-weak-types
        _this._nextRequestId++;
        next();
      });

      // TODO(richsinn): Add URL to instructions or docs?
      // TODO(richsinn): We'll need to figure out how to avoid conflicts when
      //   implementing backend blocks routes
      this._expressApp.get('/', function (req, res) {
        res.send("Congratulations! You've set up the Airtable Blocks server. Now go to your Airtable base to build your block.");
      });
    } }, { key: "_ensureBundleIsReadyAsync", value: function () {var _ensureBundleIsReadyAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(

                this._bundlePromiseIfExists === null)) {_context.next = 2;break;}return _context.abrupt("return");case 2:_context.next = 4;return (




                  this._bundlePromiseIfExists);case 4:_context.next = 6;return (




                  this._ensureBundleIsReadyAsync());case 6:case "end":return _context.stop();}}}, _callee, this);}));function _ensureBundleIsReadyAsync() {return _ensureBundleIsReadyAsync2.apply(this, arguments);}return _ensureBundleIsReadyAsync;}() }, { key: "_ensureBundleIsReadyMiddleware", value: function _ensureBundleIsReadyMiddleware()

    {var _this2 = this;
      return function (req, res, next) {
        Promise.race([
        _this2._ensureBundleIsReadyAsync(),
        new Promise(function (resolve, reject) {
          setTimeout(
          function () {return resolve('timeout _ensureBundleIsReadyAsync');},
          BUNDLE_TIMEOUT_MS);

        })]).
        then(function (value) {
          if (value === 'timeout _ensureBundleIsReadyAsync') {
            res.sendStatus(408);
            return;
          }
          next();
        });
      };
    } }, { key: "_setUpRunFrameRoutes", value: function _setUpRunFrameRoutes()
    {var _this3 = this;
      var blockDirPath = getBlockDirPath();
      var runFrameRoutes = express.Router();

      // Use body parser for JSON payloads.
      runFrameRoutes.use(bodyParser.json({ limit: blockCliConfigSettings.BLOCK_REQUEST_BODY_LIMIT }));

      // Serve the bundle file if ready.
      runFrameRoutes.get('/bundle.js', this._ensureBundleIsReadyMiddleware(), function (req, res) {
        res.sendFile(blockCliConfigSettings.BUNDLE_FILE_NAME, {
          root: path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR) });

      });

      runFrameRoutes.options('/registerBlockInstallationMetadata', function (req, res) {
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Max-Age': '86400',
          'Access-Control-Allow-Headers': 'Content-Type' }).
        status(200).end();
      });

      runFrameRoutes.post('/registerBlockInstallationMetadata', function (req, res) {
        if (!req.body || !req.body.applicationId || !req.body.blockInstallationId) {
          res.status(400).send({
            error: 'BAD_REQUEST',
            message: 'Must include applicationId and blockInstallationId in request body' });

        } else {
          if (!_this3._apiClient || _this3._apiClient.blockInstallationId !== req.body.blockInstallationId) {
            console.log('Switched to a new block installation.');
          }
          invariant(typeof req.body.applicationId === 'string', 'expects req.body.applicationId to be a string');
          invariant(typeof req.body.blockInstallationId === 'string', 'req.body.blockInstallationId to be a string');
          _this3._apiClient = new APIClient({
            apiBaseUrl: _this3._remoteJson.server,
            applicationId: req.body.applicationId,
            blockInstallationId: req.body.blockInstallationId,
            apiKey: _this3._apiKey });

          res.sendStatus(200);
        }
      });

      /**
           * This endpoint is used by the block frame to check if the
           * local block server is responding or not.
           */
      runFrameRoutes.head('/ping', function (req, res) {
        res.sendStatus(200);
      });

      runFrameRoutes.get('/poll', function (req, res, next) {
        // This promise will resolve whenever the bundle we're serving changes.
        var bundleChangePromise = new Promise(function (resolve, reject) {
          _this3._pendingLongPollResolveRejectByRequestId.set(req.requestId, { resolve: resolve, reject: reject });
        });
        // After the LONG_POLL_TIMEOUT_MS, send a request timeout to tell the client to retry.
        var timeoutPromise = new Promise(function (resolve, reject) {return setTimeout(function () {return resolve('timeout');}, LONG_POLL_TIMEOUT_MS);});

        Promise.race([
        bundleChangePromise,
        timeoutPromise]).
        then(function (result) {
          var statusCode = result === 'timeout' ? 408 : 200;
          res.sendStatus(statusCode);
        }).catch(function (err) {
          if (err.code === ErrorCodes.BUNDLE_ERROR) {
            var ansiToHtmlConverter = new AnsiToHtmlConverter();
            var errHtml = "<pre>\n".concat(
            ansiToHtmlConverter.toHtml(err.message), "\n</pre>\n");


            res.set('Content-Type', 'application/json');
            // TODO(richsinn): Handle the error overlay and polling logic for syntax
            //   errors in the iframe itself, instead of the block_client_wrapper code.
            // NOTE: There exists logic in the block_client_wrapper code to keep the
            //   polling connection alive for errors with'BUNDLE_ERROR' error code.
            res.status(500).send({ code: err.code, errStackHtml: errHtml });
          } else {
            next(err);
          }
        }).finally(function () {
          _this3._pendingLongPollResolveRejectByRequestId.delete(req.requestId);
        });
      });

      this._expressApp.use('/__runFrame', runFrameRoutes);
    } }, { key: "_setUpBlockSdkAndWrapper", value: function _setUpBlockSdkAndWrapper()
    {
      var blockDirPath = getBlockDirPath();

      // Check if react and react-dom are listed in package.json.
      var packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'), 'utf8');
      var dependencies = JSON.parse(packageJson).dependencies;
      if (!dependencies.hasOwnProperty('react') || !dependencies.hasOwnProperty('react-dom')) {
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
      // Get the block entry point filepath.
      var frontendEntryFilePath = path.join(blockDirPath, this._blockJson.frontendEntry);

      // Check if frontendEntryModule exists.
      var frontendEntryFileExists = fs.existsSync(frontendEntryFilePath);
      if (!frontendEntryFileExists) {
        console.log("The 'frontendEntry' file at ".concat(
        frontendEntryFilePath, " does not exist. Please check your 'frontendEntry' attribute in ").concat(blockCliConfigSettings.BLOCK_FILE_NAME));

        process.exit(1);
      }

      // Drop in the block SDK stub if it isn't already there.
      var blockSdkDirPath = path.join(
      blockDirPath,
      'node_modules',
      blockCliConfigSettings.SDK_PACKAGE_NAME);

      var blockSdkExists = fs.existsSync(blockSdkDirPath);
      if (!blockSdkExists) {
        fs.mkdirSync(blockSdkDirPath);
        fs.writeFileSync(
        path.join(blockSdkDirPath, 'index.js'), "module.exports = (typeof window !== 'undefined' ? window : global)['".concat(
        blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME, "'];"));

      }

      // Write the client wrapper file.
      var buildDirPath = path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR);
      if (!fs.existsSync(buildDirPath)) {
        fs.mkdirSync(buildDirPath);
      }
      var clientWrapperFilepath = path.join(buildDirPath, blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME);
      var isDevelopment = true;
      var clientWrapperCode = generateBlockClientWrapperCode(frontendEntryFilePath, isDevelopment);
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
      blockCliConfigSettings.BUILD_DIR,
      blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME),

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





      this._bundler.on('update', this.bundleAsync.bind(this));
      this._bundler.on('bundle', function () {return console.log('Updating bundle...');});
    } }, { key: "setPublicBaseUrl", value: function setPublicBaseUrl(
    publicBaseUrl) {
      // Use process.env to provide the base URL.
      this._bundler.transform(
      envify({
        BLOCK_BASE_URL: publicBaseUrl }));


    } }, { key: "startAsync", value: function () {var _startAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
      port, ngrok) {var url;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!
                ngrok) {_context2.next = 6;break;}_context2.next = 3;return (
                  this.startNgrokAsync(port));case 3:_context2.t0 = _context2.sent;_context2.next = 9;break;case 6:_context2.next = 8;return (
                  this.startLocalAsync(port));case 8:_context2.t0 = _context2.sent;case 9:url = _context2.t0;
                this.setPublicBaseUrl(url);_context2.next = 13;return (
                  this.bundleAsync(null));case 13:
                console.log(chalk.white.bgBlue.bold(" Serving block at ".concat(url, " ")));_context2.prev = 14;_context2.next = 17;return (

                  clipboardy.write(url));case 17:
                console.log('Block URL has been copied to your clipboard');_context2.next = 22;break;case 20:_context2.prev = 20;_context2.t1 = _context2["catch"](14);case 22:case "end":return _context2.stop();}}}, _callee2, this, [[14, 20]]);}));function startAsync(_x, _x2) {return _startAsync.apply(this, arguments);}return startAsync;}() }, { key: "startNgrokAsync", value: function () {var _startNgrokAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(




      port) {var _this4 = this;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (

                  new Promise(function (resolve, reject) {
                    var expressServer = _this4._expressApp.listen(port);
                    invariant(expressServer, 'expressServer');
                    expressServer.
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

      port) {var _this5 = this;var _ref, _ref2, key, cert, url;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (

                  Promise.all([
                  fsUtils.readFileAsync(path.join(getBlocksCliProjectRootPath(), 'keys', 'server.key'), 'utf8'),
                  fsUtils.readFileAsync(path.join(getBlocksCliProjectRootPath(), 'keys', 'server.crt'), 'utf8')]));case 2:_ref = _context4.sent;_ref2 = _slicedToArray(_ref, 2);key = _ref2[0];cert = _ref2[1];_context4.next = 8;return (


                  new Promise(function (resolve, reject) {
                    // flow-disable-next-line because flow confuses Socket types for createServer
                    var server = https.createServer({ cert: cert, key: key }, _this5._expressApp);
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
                url);case 16:case "end":return _context4.stop();}}}, _callee4);}));function startLocalAsync(_x4) {return _startLocalAsync.apply(this, arguments);}return startLocalAsync;}() }, { key: "bundleAsync", value: function bundleAsync(

    files) {var _this6 = this;
      if (files && files.findIndex(function (file) {return file.includes('package.json');}) !== -1) {
        // When yarn adds or removes packages, it deletes the symlinks
        // and SDK stub we add to node_modules. As a temporary fix, we
        // quit and ask the user to restart the CLI. Note that we can't
        // easily regenerate the symlinks and stub at this point because
        // package.json updates before yarn deletes our files.
        console.log('package.json changed, please run again.');
        process.exit(0);
      }

      var resolve;
      var reject;
      var bundlePromise = new Promise(function (resolveInner, rejectInner) {
        resolve = resolveInner;
        reject = rejectInner;
      });
      // NOTE: In the case where `bundleAsync` is triggered multiple times,
      // this assignment to the `this._bundlePromiseIfExists` instance variable
      // will be the latest Promise. This mechanism allows us to serve the
      // most recently updated bundle.js file.
      this._bundlePromiseIfExists = bundlePromise;

      var blockDirPath = getBlockDirPath();
      var fsStream = fs.createWriteStream(path.join(
      blockDirPath,
      blockCliConfigSettings.BUILD_DIR,
      blockCliConfigSettings.BUNDLE_FILE_NAME));

      fsStream.on('finish', function () {
        console.log('Bundle updated');
        // NOTE: A null value for the `this._bundlePromiseIfExists`
        // instance variable means the bundle is ready to serve.
        // If `bundleAsync` is quickly triggered multiple times:
        //   1) It's possible the earlier Promises have not resolved yet.
        //   2) We only want to serve the bundle for the latest Promise.
        // Because the instance variable always stores the latest Promise, we
        // check the local Promise against the instance variable to determine
        // if this is the latest Promise and the bundle is ready.
        if (_this6._bundlePromiseIfExists === bundlePromise) {
          _this6._bundlePromiseIfExists = null;
        }
        // Resolve any long poll promises that were listening for bundle changes.
        var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = _this6._pendingLongPollResolveRejectByRequestId.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var longPollResolve = _step.value.resolve;
            longPollResolve();
          }
          // Resolve our primary bundle promise.
        } catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}resolve();
      }).on('error', function (err) {
        // Reject our primary bundle promise.
        reject(err);
      });

      var bundleStream = this._bundler.bundle();
      bundleStream.
      on('error', function (err) {
        // Append a custom error code here. The error code will be used
        // to signal that the HTTP connection to block_server should be
        // kept alive via long polling.
        err.code = ErrorCodes.BUNDLE_ERROR;

        console.error(err.message);
        if (err.codeFrame) {
          console.error(err.codeFrame);
        }
        if (_this6._bundlePromiseIfExists === bundlePromise) {
          _this6._bundlePromiseIfExists = null;
        }
        bundleStream.unpipe(fsStream);
        fsStream.destroy(err);
      }).
      pipe(fsStream);

      return bundlePromise.catch(function (err) {
        // Reject any long poll promises that were listening for bundle changes.
        var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = _this6._pendingLongPollResolveRejectByRequestId.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var longPollReject = _step2.value.reject;
            longPollReject(err);
          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return != null) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
      });
    } }]);return BlockServer;}();


module.exports = BlockServer;