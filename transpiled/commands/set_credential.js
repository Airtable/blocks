"use strict";function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');
var invariant = require('invariant');
var BlockBuildTypes = require('../types/block_build_types');
var blockCliConfigSettings = require('../config/block_cli_config_settings');
var cliHelpers = require('../helpers/cli_helpers');
var APIClient = require('../api_client');
var getApiKeySync = require('../get_api_key_sync');
var getBlockDirPath = require('../get_block_dir_path');
var getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');
var writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');




















var PROMPT_DEVELOPMENT_OR_RELEASE_REGEX = /^(?:DEVELOPMENT|RELEASE|1|2)$/;

/**
                                                                            * This only "upserts" developer credentials to the local filesystem. Specifically, it
                                                                            * mutates the blockCliConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME file. It does NOT
                                                                            * synchronize credential values with the server.
                                                                            *
                                                                            * The developer will have to execute the `block push` command to synchronize
                                                                            * changes with the server.
                                                                            */function
blockSetDeveloperCredentialAsync(_x) {return _blockSetDeveloperCredentialAsync.apply(this, arguments);}function _blockSetDeveloperCredentialAsync() {_blockSetDeveloperCredentialAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(promptInput) {var blockDirPath, blockFileDataJson, blockFileData, apiClient, developerCredentialsEncrypted;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            blockDirPath = getBlockDirPath();
            blockFileDataJson = fs.readFileSync(
            path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
            'utf8');

            blockFileData = JSON.parse(blockFileDataJson);
            apiClient = _getApiClient(blockFileData, blockDirPath);_context.next = 6;return (
              getDeveloperCredentialsEncryptedIfExistsAsync());case 6:developerCredentialsEncrypted = _context.sent;if (!(

            developerCredentialsEncrypted === null)) {_context.next = 11;break;}_context.next = 10;return (


              _createNewDeveloperCredentialFileAsync(apiClient, blockDirPath, promptInput));case 10:return _context.abrupt("return", _context.sent);case 11:_context.next = 13;return (


              _upsertCredentialAsync(apiClient, blockDirPath, developerCredentialsEncrypted, promptInput));case 13:return _context.abrupt("return", _context.sent);case 14:case "end":return _context.stop();}}}, _callee);}));return _blockSetDeveloperCredentialAsync.apply(this, arguments);}function


_createNewDeveloperCredentialFileAsync(_x2, _x3, _x4) {return _createNewDeveloperCredentialFileAsync2.apply(this, arguments);}function _createNewDeveloperCredentialFileAsync2() {_createNewDeveloperCredentialFileAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
  apiClient,
  blockDirPath,
  promptInput) {var developmentOrReleaseType, name, credentialValue, credentialEncrypted, developerCredentialEncrypted;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:


            developmentOrReleaseType =


            promptInput.developmentOrReleaseType, name = promptInput.name, credentialValue = promptInput.credentialValue;_context2.next = 3;return (
              apiClient.encryptCredentialAsync(
              {
                name: name,
                credentialValuePlaintext: credentialValue }));case 3:credentialEncrypted = _context2.sent;


            developerCredentialEncrypted = _createNewDeveloperCredentialEncrypted(credentialEncrypted, developmentOrReleaseType);_context2.next = 7;return (
              writeDeveloperCredentialsFromApiResponseAsync(
              [developerCredentialEncrypted],
              blockDirPath));case 7:return _context2.abrupt("return", _context2.sent);case 8:case "end":return _context2.stop();}}}, _callee2);}));return _createNewDeveloperCredentialFileAsync2.apply(this, arguments);}function



_upsertCredentialAsync(_x5, _x6, _x7, _x8) {return _upsertCredentialAsync2.apply(this, arguments);}function _upsertCredentialAsync2() {_upsertCredentialAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
  apiClient,
  blockDirPath,
  developerCredentialsEncrypted,
  promptInput) {var developmentOrReleaseType, name, credentialValue, existingCredentialIndex, existingDeveloperCredentialEncrypted, kmsDataKeyId, credentialEncrypted, newDeveloperCredentialEncrypted, updatedDeveloperCredentialEncrypted;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:


            developmentOrReleaseType =


            promptInput.developmentOrReleaseType, name = promptInput.name, credentialValue = promptInput.credentialValue;

            existingCredentialIndex = developerCredentialsEncrypted.findIndex(function (developerCredentialEncrypted) {
              return developerCredentialEncrypted.name === name;
            });
            existingDeveloperCredentialEncrypted = _getExistingDeveloperCredentialEncryptedIfExists(existingCredentialIndex, developerCredentialsEncrypted);


            if (existingDeveloperCredentialEncrypted) {
              // kmsDataKeyId can be undefined in the create case because
              // existingDeveloperCredentialEncrypted will be null.
              kmsDataKeyId = existingDeveloperCredentialEncrypted.kmsDataKeyId;
            }_context3.next = 6;return (

              apiClient.encryptCredentialAsync(
              {
                name: name,
                credentialValuePlaintext: credentialValue },

              kmsDataKeyId));case 6:credentialEncrypted = _context3.sent;if (!(


            existingDeveloperCredentialEncrypted === null || existingDeveloperCredentialEncrypted.deleted)) {_context3.next = 12;break;}
            // 1. Create (i.e. "Insert") case.
            newDeveloperCredentialEncrypted = _createNewDeveloperCredentialEncrypted(credentialEncrypted, developmentOrReleaseType);

            developerCredentialsEncrypted.push(newDeveloperCredentialEncrypted);_context3.next = 16;break;case 12:_context3.next = 14;return (


              _getUpdatedDeveloperCredentialEncryptedAsync(
              apiClient,
              existingDeveloperCredentialEncrypted,
              credentialEncrypted,
              developmentOrReleaseType));case 14:updatedDeveloperCredentialEncrypted = _context3.sent;


            developerCredentialsEncrypted.splice(existingCredentialIndex, 1, updatedDeveloperCredentialEncrypted);case 16:_context3.next = 18;return (


              writeDeveloperCredentialsFromApiResponseAsync(
              developerCredentialsEncrypted,
              blockDirPath));case 18:return _context3.abrupt("return", _context3.sent);case 19:case "end":return _context3.stop();}}}, _callee3);}));return _upsertCredentialAsync2.apply(this, arguments);}



function _getExistingDeveloperCredentialEncryptedIfExists(
existingCredentialIndex,
developerCredentialsEncrypted)
{
  var existingDeveloperCredentialEncrypted;
  if (existingCredentialIndex === -1 && developerCredentialsEncrypted.length === blockCliConfigSettings.MAX_NUM_CREDENTIALS_PER_BLOCK) {
    // If existingCredentialIndex is not found, it means we are creating a new credential
    // and we should check to see if creating will exceed the limit.
    console.log('Cannot create credential because it would exceed the maximum number of credentials per block');
    throw new Error('Exceeded MAX_NUM_CREDENTIALS_PER_BLOCK');
  } else if (existingCredentialIndex === -1) {
    existingDeveloperCredentialEncrypted = null;
  } else if (existingCredentialIndex >= 0) {
    existingDeveloperCredentialEncrypted = developerCredentialsEncrypted[existingCredentialIndex];
  } else {
    throw new Error("Invalid index ".concat(existingCredentialIndex, " for developerCredentialsEncrypted"));
  }

  return existingDeveloperCredentialEncrypted;
}

/**
   * Creates a new developer credential object to insert in the file system.
   * Currently, only one credential type can be set at a time via the CLI command.
   * This means the other credential type will default to null.
   */
function _createNewDeveloperCredentialEncrypted(
credentialEncrypted,
blockBuildType)
{
  // flow-disable-next-line exact-type bug
  var developerCredentialEncrypted = {};
  developerCredentialEncrypted.name = credentialEncrypted.name;
  developerCredentialEncrypted.revision = 0;
  developerCredentialEncrypted.kmsDataKeyId = credentialEncrypted.kmsDataKeyId;

  switch (blockBuildType) {
    case BlockBuildTypes.DEVELOPMENT:
      developerCredentialEncrypted.developmentCredentialValueEncrypted = credentialEncrypted.credentialValueEncrypted;
      developerCredentialEncrypted.releaseCredentialValueEncrypted = null;
      break;

    case BlockBuildTypes.RELEASE:
      developerCredentialEncrypted.developmentCredentialValueEncrypted = null;
      developerCredentialEncrypted.releaseCredentialValueEncrypted = credentialEncrypted.credentialValueEncrypted;
      break;

    default:
      throw new Error("Unrecognized blockBuildType: ".concat(blockBuildType));}


  return developerCredentialEncrypted;
}

/**
   * Updates an existing developer credential object. Currently, only one credential type
   * can be updated at a time via the CLI command. This means the other credential type
   * will "inherit" from the parent.
   *
   * NOTE: There is a special case when "inheriting" the credential value: if the
   * kmsDataKey is no longer "active" for the credential object, we re-encrypt
   * the "inherited" value before saving to the file system.
   */function
_getUpdatedDeveloperCredentialEncryptedAsync(_x9, _x10, _x11, _x12) {return _getUpdatedDeveloperCredentialEncryptedAsync2.apply(this, arguments);}






















































/**
                                                                                                                                                    * Because we can only update one credential type at a time via the blocks-cli commands,
                                                                                                                                                    * the other credential type will be "inherited". In most cases, we can simply copy over
                                                                                                                                                    * the unchanged values.
                                                                                                                                                    *
                                                                                                                                                    * However, if the existing kmsDataKey is expired, then there will be a mismatch
                                                                                                                                                    * with the kmsDataKey used to encrypt the updated credential value. In this case, we'll
                                                                                                                                                    * need to re-encrypt the unchanged credential value with the new kmsDataKey.
                                                                                                                                                    */function _getUpdatedDeveloperCredentialEncryptedAsync2() {_getUpdatedDeveloperCredentialEncryptedAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(apiClient, parentDeveloperCredentialEncrypted, newCredentialEncrypted, blockBuildType) {var updatedDeveloperCredentialEncrypted;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (!(parentDeveloperCredentialEncrypted.name !== newCredentialEncrypted.name)) {_context4.next = 2;break;}throw new Error('Names do not match up after encrypt');case 2: // flow-disable-next-line exact-type bug
            updatedDeveloperCredentialEncrypted = {};updatedDeveloperCredentialEncrypted.id = parentDeveloperCredentialEncrypted.id;updatedDeveloperCredentialEncrypted.name = newCredentialEncrypted.name;updatedDeveloperCredentialEncrypted.revision = parentDeveloperCredentialEncrypted.revision;updatedDeveloperCredentialEncrypted.kmsDataKeyId = newCredentialEncrypted.kmsDataKeyId;_context4.t0 = blockBuildType;_context4.next = _context4.t0 === BlockBuildTypes.DEVELOPMENT ? 10 : _context4.t0 === BlockBuildTypes.RELEASE ? 15 : 20;break;case 10:updatedDeveloperCredentialEncrypted.developmentCredentialValueEncrypted = newCredentialEncrypted.credentialValueEncrypted;_context4.next = 13;return _inheritOrReEncryptCredentialValueEncryptedAsync(apiClient, { name: parentDeveloperCredentialEncrypted.name, kmsDataKeyId: parentDeveloperCredentialEncrypted.kmsDataKeyId, credentialValueEncrypted: parentDeveloperCredentialEncrypted.releaseCredentialValueEncrypted }, newCredentialEncrypted.kmsDataKeyId);case 13:updatedDeveloperCredentialEncrypted.releaseCredentialValueEncrypted = _context4.sent;return _context4.abrupt("break", 21);case 15:_context4.next = 17;return _inheritOrReEncryptCredentialValueEncryptedAsync(apiClient, { name: parentDeveloperCredentialEncrypted.name, kmsDataKeyId: parentDeveloperCredentialEncrypted.kmsDataKeyId, credentialValueEncrypted: parentDeveloperCredentialEncrypted.developmentCredentialValueEncrypted }, newCredentialEncrypted.kmsDataKeyId);case 17:updatedDeveloperCredentialEncrypted.developmentCredentialValueEncrypted = _context4.sent;updatedDeveloperCredentialEncrypted.releaseCredentialValueEncrypted = newCredentialEncrypted.credentialValueEncrypted;return _context4.abrupt("break", 21);case 20:throw new Error("Unrecognized blockBuildType: ".concat(blockBuildType));case 21:return _context4.abrupt("return", updatedDeveloperCredentialEncrypted);case 22:case "end":return _context4.stop();}}}, _callee4);}));return _getUpdatedDeveloperCredentialEncryptedAsync2.apply(this, arguments);}function _inheritOrReEncryptCredentialValueEncryptedAsync(_x13, _x14, _x15) {return _inheritOrReEncryptCredentialValueEncryptedAsync2.apply(this, arguments);}function _inheritOrReEncryptCredentialValueEncryptedAsync2() {_inheritOrReEncryptCredentialValueEncryptedAsync2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(
  apiClient,
  parentCredentialEncrypted,




  newCredentialKmsDataKeyId) {var name, kmsDataKeyId, credentialValueEncrypted, shouldInherit, credentialValueEncryptedToReturn, reEncryptedCredentialEncrypted;return regeneratorRuntime.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:


            name =


            parentCredentialEncrypted.name, kmsDataKeyId = parentCredentialEncrypted.kmsDataKeyId, credentialValueEncrypted = parentCredentialEncrypted.credentialValueEncrypted;

            shouldInherit = credentialValueEncrypted === null ||
            kmsDataKeyId === newCredentialKmsDataKeyId;if (!


            shouldInherit) {_context5.next = 6;break;}
            credentialValueEncryptedToReturn = credentialValueEncrypted;_context5.next = 11;break;case 6:

            invariant(credentialValueEncrypted, 'credentialValueEncrypted');_context5.next = 9;return (
              apiClient.reEncryptCredentialAsync(
              {
                name: name,
                kmsDataKeyId: kmsDataKeyId,
                credentialValueEncrypted: credentialValueEncrypted },

              newCredentialKmsDataKeyId));case 9:reEncryptedCredentialEncrypted = _context5.sent;

            credentialValueEncryptedToReturn = reEncryptedCredentialEncrypted.credentialValueEncrypted;case 11:return _context5.abrupt("return",

            credentialValueEncryptedToReturn);case 12:case "end":return _context5.stop();}}}, _callee5);}));return _inheritOrReEncryptCredentialValueEncryptedAsync2.apply(this, arguments);}


function _getApiClient(
blockJson,
blockDirPath)
{
  var apiKey = getApiKeySync(blockDirPath);
  return new APIClient({
    environment: blockJson.environment,
    applicationId: blockJson.applicationId,
    blockId: blockJson.blockId,
    apiKey: apiKey });

}function

runCommandAsync(_x16) {return _runCommandAsync.apply(this, arguments);}function _runCommandAsync() {_runCommandAsync = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(argv) {var promptSchema, result;return regeneratorRuntime.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
            promptSchema = [
            {
              name: 'developmentOrReleaseType',
              description: "Select [1] for ".concat(BlockBuildTypes.DEVELOPMENT, " or [2] for ").concat(BlockBuildTypes.RELEASE, " credential"),
              required: true,
              pattern: PROMPT_DEVELOPMENT_OR_RELEASE_REGEX,
              message: "Input [1] ".concat(BlockBuildTypes.DEVELOPMENT, " or [2] ").concat(BlockBuildTypes.RELEASE),
              before: function before(value) {
                var trimmedValue = value.trim();

                var buildType;
                switch (trimmedValue) {
                  case '1':
                  case BlockBuildTypes.DEVELOPMENT:
                    buildType = BlockBuildTypes.DEVELOPMENT;
                    break;

                  case '2':
                  case BlockBuildTypes.RELEASE:
                    buildType = BlockBuildTypes.RELEASE;
                    break;

                  default:
                    console.log("Incorrect input: ".concat(trimmedValue));
                    // setting to null will be handled by the 'pattern' check.
                    buildType = null;
                    break;}


                if (buildType) {
                  console.log("Setting credential for ".concat(JSON.stringify(buildType), " type..."));
                }
                return buildType;
              } },

            {
              name: 'name',
              description: 'Please enter a name for the credentials',
              message: 'Name must be no more than 255 characters',
              conform: function conform(value) {
                var trimmedValue = value.trim();
                return trimmedValue.length <= blockCliConfigSettings.MAX_BLOCK_DEVELOPER_CREDENTIAL_NAME_LENGTH;
              },
              before: function before(value) {
                return value.trim();
              },
              required: true },

            {
              name: 'credentialValue',
              hidden: 'true',
              replace: '*',
              description: 'Please enter the credential value',
              required: true }];_context6.next = 3;return (



              cliHelpers.promptAsync(promptSchema));case 3:result = _context6.sent;_context6.next = 6;return (
              blockSetDeveloperCredentialAsync(result));case 6:
            console.log("Set ".concat(result.developmentOrReleaseType, " credential for '").concat(result.name, "'."));case 7:case "end":return _context6.stop();}}}, _callee6);}));return _runCommandAsync.apply(this, arguments);}


module.exports = { runCommandAsync: runCommandAsync };