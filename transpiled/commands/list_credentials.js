"use strict";function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');



var REDACTED_CREDENTIAL_VALUE = '********';
var NUM_SPACES_BETWEEN_DISPLAY_VALUES = 8;function







runCommandAsync(_x) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {var developerCredentialsEncrypted, developerCredentialsToDisplay, lengthOfLongestName, numSpacesAfterNameHeader, separatorAfterNameHeader, separatorAfterDevelopmentHeader, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, developerCredentialToDisplay, name, developmentValue, releaseValue, numSpacesAfterNameColumn, separatorAfterNameColumn, numSpacesAfterDevelopmentColumn, separatorAfterDevelopmentColumn;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
              getDeveloperCredentialsEncryptedIfExistsAsync());case 2:developerCredentialsEncrypted = _context.sent;if (!(
            developerCredentialsEncrypted === null)) {_context.next = 6;break;}
            console.log('No developer credentials on the local system. If expecting credentials, try refreshing with \'block pull\'');return _context.abrupt("return");case 6:



            developerCredentialsToDisplay =
            developerCredentialsEncrypted.
            filter(function (developerCredentialEncrypted) {return !developerCredentialEncrypted.deleted;}).
            map(function (developerCredentialEncrypted) {
              var developmentCredentialValueToDisplay = developerCredentialEncrypted.developmentCredentialValueEncrypted ?
              REDACTED_CREDENTIAL_VALUE : null;
              var releaseCredentialValueToDisplay = developerCredentialEncrypted.releaseCredentialValueEncrypted ?
              REDACTED_CREDENTIAL_VALUE : null;
              return {
                name: developerCredentialEncrypted.name,
                developmentValue: developmentCredentialValueToDisplay,
                releaseValue: releaseCredentialValueToDisplay };

            });

            // Log title headers
            // There will be 3 headers: NAME, DEVELOPMENT, and RELEASE
            lengthOfLongestName = Math.max.apply(Math, _toConsumableArray(developerCredentialsToDisplay.map(function (devCred) {return devCred.name.length;})));
            // Calculate whitespace width between columns
            numSpacesAfterNameHeader = lengthOfLongestName + NUM_SPACES_BETWEEN_DISPLAY_VALUES - 4;
            separatorAfterNameHeader = _whitespaceSeparator(numSpacesAfterNameHeader);
            separatorAfterDevelopmentHeader = _whitespaceSeparator(NUM_SPACES_BETWEEN_DISPLAY_VALUES);

            console.log("NAME".concat(separatorAfterNameHeader, "DEVELOPMENT").concat(separatorAfterDevelopmentHeader, "RELEASE"));
            console.log("----".concat(separatorAfterNameHeader, "-----------").concat(separatorAfterDevelopmentHeader, "-------"));

            // Log the credentials
            _iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context.prev = 16;for (_iterator = developerCredentialsToDisplay[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {developerCredentialToDisplay = _step.value;

              name =


              developerCredentialToDisplay.name, developmentValue = developerCredentialToDisplay.developmentValue, releaseValue = developerCredentialToDisplay.releaseValue;
              numSpacesAfterNameColumn = lengthOfLongestName - name.length + NUM_SPACES_BETWEEN_DISPLAY_VALUES;
              separatorAfterNameColumn = _whitespaceSeparator(numSpacesAfterNameColumn);

              // Whitespace width calculation depends on if developmentValue is null or '********'
              numSpacesAfterDevelopmentColumn = developmentValue ? NUM_SPACES_BETWEEN_DISPLAY_VALUES + 1 : NUM_SPACES_BETWEEN_DISPLAY_VALUES * 2;
              separatorAfterDevelopmentColumn = _whitespaceSeparator(numSpacesAfterDevelopmentColumn);

              console.log("".concat(name).concat(separatorAfterNameColumn).concat(JSON.stringify(developmentValue)).concat(separatorAfterDevelopmentColumn).concat(JSON.stringify(releaseValue)));
            }_context.next = 24;break;case 20:_context.prev = 20;_context.t0 = _context["catch"](16);_didIteratorError = true;_iteratorError = _context.t0;case 24:_context.prev = 24;_context.prev = 25;if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}case 27:_context.prev = 27;if (!_didIteratorError) {_context.next = 30;break;}throw _iteratorError;case 30:return _context.finish(27);case 31:return _context.finish(24);case 32:case "end":return _context.stop();}}}, _callee, null, [[16, 20, 24, 32], [25,, 27, 31]]);}));return _runCommandAsync.apply(this, arguments);}


function _whitespaceSeparator(numOfSpaces) {
  return ' '.repeat(numOfSpaces);
}

module.exports = { runCommandAsync: runCommandAsync };