"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var path = require('path');
var fsUtils = require('./fs_utils');
var blocksConfigSettings = require('./config/block_cli_config_settings');function



writeDeveloperCredentialsFromApiResponseAsync(_x, _x2) {return _writeDeveloperCredentialsFromApiResponseAsync.apply(this, arguments);}function _writeDeveloperCredentialsFromApiResponseAsync() {_writeDeveloperCredentialsFromApiResponseAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
  developerCredentialsEncrypted,
  blockDirPath) {var developerCredentialsBase64;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (


            developerCredentialsEncrypted) {_context.next = 2;break;}return _context.abrupt("return");case 2:




            if (developerCredentialsEncrypted.length > 0) {
              // NOTE(richsinn): We stringify then base64 encode here to discourage
              //   direct tampering of developer credential values. Access and modifications
              //   to developer credentials should only be done via the cli commands.
              developerCredentialsBase64 =
              Buffer.from(JSON.stringify(developerCredentialsEncrypted), 'utf8').toString('base64');
            } else {
              developerCredentialsBase64 = null;
            }_context.next = 5;return (

              fsUtils.writeFileAsync(
              path.join(blockDirPath, blocksConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME),
              JSON.stringify(
              {
                developerCredentials: developerCredentialsBase64 },

              null,
              4)));case 5:case "end":return _context.stop();}}}, _callee);}));return _writeDeveloperCredentialsFromApiResponseAsync.apply(this, arguments);}




module.exports = writeDeveloperCredentialsFromApiResponseAsync;