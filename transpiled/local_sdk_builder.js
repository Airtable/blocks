"use strict";function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
/* eslint-disable no-console */
var path = require('path');
var npmPackageArg = require('npm-package-arg');
var chalk = require('chalk');
var cpx = require('cpx');
var fsUtils = require('./fs_utils');
var getBlockDirPath = require('./get_block_dir_path');var _require =
require('./helpers/cli_helpers'),exitWithError = _require.exitWithError;var _require2 =
require('./helpers/child_process_helpers'),spawn = _require2.spawn,execFileAsync = _require2.execFileAsync;

var SDK_PACKAGE_NAME = '@airtable/blocks';

function warnNonLiveDirectorySdk(installedPath) {
  var message = ["".concat(
  SDK_PACKAGE_NAME, " is currently installed from the local directory ").concat(installedPath, "."),
  "Since you didn't specify --sdk-repo, changes made in this directory won't automatically update your block.", "Consider either switching back to the distributed version of this package with 'yarn add ".concat(
  SDK_PACKAGE_NAME, "',"), "or enable local SDK development mode by passing --sdk-repo=".concat(
  installedPath, " to this command."),
  ''].
  join('\n');

  console.warn(chalk.yellow(message));
}

/**
   * LocalSdkBuilder enables the same automatic reload development experience we have for blocks for
   * the SDK. It works by:
   *   - Installing a local copy of the SDK (this makes sure that all the other npm dependencies are)
   *     in the right place
   *   - Starting the SDK's own development builder
   *   - Keeping node_modules/@airtable/blocks/dist in sync with the local SDK's dist folder so
   *     that changes there trigger normal bundle rebuilds
   *
   * Often, symlinking the package (e.g. yarn link) is enough to get this sort of workflow. We can't
   * use that here though, as node's (and subsequently browserify's) module resolution means that the
   * SDK won't be able to resolve the right version of packages that would usually be hoisted or peer
   * dependencies, like React.
   */var
LocalSdkBuilder = /*#__PURE__*/function () {_createClass(LocalSdkBuilder, null, [{ key: "startIfNeededAsync", value: function () {var _startIfNeededAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      sdkPath) {var sdkPackageVersionSpecifier, localSdkBuilder;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                  LocalSdkBuilder._getInstalledSdkPackageVersionSpecifierAsync());case 2:sdkPackageVersionSpecifier = _context.sent;if (!

                sdkPackageVersionSpecifier) {_context.next = 14;break;}if (!(
                sdkPath === null)) {_context.next = 8;break;}
                if (sdkPackageVersionSpecifier.type === 'directory') {
                  warnNonLiveDirectorySdk(sdkPackageVersionSpecifier.fetchSpec);
                }_context.next = 12;break;case 8:

                localSdkBuilder = new LocalSdkBuilder(sdkPath);_context.next = 11;return (
                  localSdkBuilder.startAsync());case 11:return _context.abrupt("return",
                localSdkBuilder);case 12:_context.next = 15;break;case 14:

                if (sdkPath !== null) {
                  exitWithError("Cannot use local SDK (--sdk-repo) without ".concat(
                  SDK_PACKAGE_NAME, " installed. Install it with 'yarn add ").concat(SDK_PACKAGE_NAME, "'"));

                }case 15:return _context.abrupt("return",

                null);case 16:case "end":return _context.stop();}}}, _callee);}));function startIfNeededAsync(_x) {return _startIfNeededAsync.apply(this, arguments);}return startIfNeededAsync;}() }, { key: "_getInstalledSdkPackageVersionSpecifierAsync", value: function () {var _getInstalledSdkPackageVersionSpecifierAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var blockDirPath, blockPackageJsonPath, blockPackageJson, sdkPackageVersionString;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:



                blockDirPath = getBlockDirPath();
                blockPackageJsonPath = path.join(blockDirPath, 'package.json');_context2.t0 =
                JSON;_context2.next = 5;return (
                  fsUtils.readFileAsync(blockPackageJsonPath, 'utf-8'));case 5:_context2.t1 = _context2.sent;blockPackageJson = _context2.t0.parse.call(_context2.t0, _context2.t1);


                sdkPackageVersionString = blockPackageJson.dependencies[SDK_PACKAGE_NAME];if (
                sdkPackageVersionString) {_context2.next = 10;break;}return _context2.abrupt("return",
                null);case 10:return _context2.abrupt("return",


                npmPackageArg.resolve(SDK_PACKAGE_NAME, sdkPackageVersionString, blockDirPath));case 11:case "end":return _context2.stop();}}}, _callee2);}));function _getInstalledSdkPackageVersionSpecifierAsync() {return _getInstalledSdkPackageVersionSpecifierAsync2.apply(this, arguments);}return _getInstalledSdkPackageVersionSpecifierAsync;}() }]);



  function LocalSdkBuilder(sdkPath) {_classCallCheck(this, LocalSdkBuilder);_defineProperty(this, "sdkPath", void 0);
    this.sdkPath = path.resolve(sdkPath);
  }_createClass(LocalSdkBuilder, [{ key: "startAsync", value: function () {var _startAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var tempPackagePath, copySourcePath, copyDestPath;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:


                console.log("Installing local SDK from ".concat(this.sdkPath, "..."));_context3.next = 3;return (
                  this._createTemporarySdkPackageAsync());case 3:tempPackagePath = _context3.sent;_context3.next = 6;return (
                  this._installLocalSdkAsync(tempPackagePath));case 6:_context3.next = 8;return (
                  fsUtils.unlinkAsync(tempPackagePath));case 8:

                console.log("Building local SDK in ".concat(this.sdkPath, "..."));_context3.next = 11;return (
                  this._buildAndWatchSourceAsync());case 11:

                copySourcePath = path.join(this.sdkPath, 'dist');
                copyDestPath = path.join(getBlockDirPath(), 'node_modules', SDK_PACKAGE_NAME, 'dist');
                console.log("Copying local SDK build from ".concat(copySourcePath, " to ").concat(copyDestPath));_context3.next = 16;return (
                  this._copyAndWatchBuildAsync(copySourcePath, copyDestPath));case 16:case "end":return _context3.stop();}}}, _callee3, this);}));function startAsync() {return _startAsync.apply(this, arguments);}return startAsync;}() }, { key: "_createTemporarySdkPackageAsync", value: function () {var _createTemporarySdkPackageAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {var sdkPackageJsonPath, initialPackageJsonString, initialPackageJson, tempPackageJson, _ref, stdout, lines, packedPackagePath;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:



                // temporarily rewrite package.json to get a unique version. without this, we might corrupt
                // yarn's cache by having two distinct tarballs at the same version
                sdkPackageJsonPath = path.join(this.sdkPath, 'package.json');_context4.next = 3;return (
                  fsUtils.readFileAsync(sdkPackageJsonPath, 'utf-8'));case 3:initialPackageJsonString = _context4.sent;
                initialPackageJson = JSON.parse(initialPackageJsonString);

                tempPackageJson = _objectSpread({},
                initialPackageJson, {
                  version: "".concat(initialPackageJson.version, "-local.").concat(Date.now()) });_context4.next = 8;return (

                  fsUtils.writeFileAsync(sdkPackageJsonPath, JSON.stringify(tempPackageJson), 'utf-8'));case 8:_context4.next = 10;return (

                  execFileAsync('npm', ['pack', '--quiet'], {
                    cwd: this.sdkPath,
                    prefix: 'npm pack' }));case 10:_ref = _context4.sent;stdout = _ref.stdout;_context4.next = 14;return (



                  fsUtils.writeFileAsync(sdkPackageJsonPath, initialPackageJsonString, 'utf-8'));case 14:

                // npm pack prints the location of the package to stdout before exiting
                lines = stdout.trim().split('\n');
                packedPackagePath = lines[lines.length - 1];return _context4.abrupt("return",

                path.join(this.sdkPath, packedPackagePath));case 17:case "end":return _context4.stop();}}}, _callee4, this);}));function _createTemporarySdkPackageAsync() {return _createTemporarySdkPackageAsync2.apply(this, arguments);}return _createTemporarySdkPackageAsync;}() }, { key: "_installLocalSdkAsync", value: function () {var _installLocalSdkAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(


      packagePath) {var blockDir, shouldUseYarn;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                blockDir = getBlockDirPath();_context5.next = 3;return (
                  fsUtils.existsAsync(path.join(blockDir, 'yarn.lock')));case 3:shouldUseYarn = _context5.sent;_context5.next = 6;return (

                  execFileAsync(
                  shouldUseYarn ? 'yarn' : 'npm',
                  shouldUseYarn ?
                  ['add', "".concat(SDK_PACKAGE_NAME, "@").concat(packagePath), '--non-interactive'] :
                  ['install', "".concat(SDK_PACKAGE_NAME, "@").concat(packagePath)],
                  {
                    prefix: shouldUseYarn ? 'yarn add' : 'npm install',
                    cwd: getBlockDirPath() }));case 6:case "end":return _context5.stop();}}}, _callee5);}));function _installLocalSdkAsync(_x2) {return _installLocalSdkAsync2.apply(this, arguments);}return _installLocalSdkAsync;}() }, { key: "_buildAndWatchSourceAsync", value: function _buildAndWatchSourceAsync()




    {var _this = this;
      return new Promise(function (resolve) {
        var sdkBuildProcess = spawn('npm', ['run', 'watch'], {
          prefix: SDK_PACKAGE_NAME,
          cwd: _this.sdkPath });


        sdkBuildProcess.on('error', function (err) {return exitWithError("Couldn't start SDK builder", err);});
        sdkBuildProcess.on('exit', function () {return (
            exitWithError("'npm run:watch' for ".concat(SDK_PACKAGE_NAME, " exited unexpectedly")));});


        sdkBuildProcess.stdout.on('data', function (chunk) {
          // TODO: find a more reliable way of detecting compile completion.
          if (chunk.toString('utf-8').includes('Successfully compiled')) {
            resolve();
          }
        });
      });
    } }, { key: "_copyAndWatchBuildAsync", value: function _copyAndWatchBuildAsync(

    sourcePath, destPath) {
      return new Promise(function (resolve) {
        var copier = cpx.watch(path.join(sourcePath, '**', '*'), destPath);
        copier.on('watch-ready', function () {return resolve();});
        copier.on('watch-error', function (err) {return (
            exitWithError("Error copying ".concat(SDK_PACKAGE_NAME, " build"), err));});

      });
    } }]);return LocalSdkBuilder;}();


module.exports = LocalSdkBuilder;