"use strict";var _ = require('lodash');
var path = require('path');
var fsUtils = require('./fs_utils');
var blocksConfigSettings = require('./config/block_cli_config_settings');

module.exports = function writeFilesFromApiResponseAsync(response, blockDirPath, blockMetadata) {
  var modules = response.modules;
  var frontendEntryModuleId = response.frontendEntryModuleId;
  // Create sub dirs.
  var subDirs = _.uniq(modules.map(function (module) {return module.metadata.type;}));
  var createSubDirsPromises = subDirs.map(function (subDir) {return (
      fsUtils.mkdirIfDoesntAlreadyExistAsync(path.join(blockDirPath, subDir)));});


  return Promise.all(createSubDirsPromises).then(function () {
    // Write files.
    var writeFilesPromises = modules.map(function (module) {
      var metadata = module.metadata;
      // Add .js extension to all files so they work nicely with local tools like text editors, etc.
      var filePath = path.join(blockDirPath, metadata.type, "".concat(metadata.name, ".js"));
      return fsUtils.writeFileAsync(filePath, module.code);
    });

    var modulesWithoutCode = modules.map(function (module) {
      return _.omit(module, 'code');
    });

    var frontendEntryModule = _.find(modules, function (module) {return module.id === frontendEntryModuleId;});
    var frontendEntryModuleName = "".concat(frontendEntryModule.metadata.name, ".js");

    var writeBlockFilePromise = fsUtils.writeFileAsync(
    path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
    JSON.stringify(
    {
      frontendEntryModuleName: frontendEntryModuleName,
      environment: blockMetadata.environment,
      applicationId: blockMetadata.applicationId,
      blockId: blockMetadata.blockId,
      modules: modulesWithoutCode },

    null,
    4));



    return Promise.all(_.concat(writeFilesPromises, writeBlockFilePromise));
  });
};