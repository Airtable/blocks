
'use strict';

var fs = require('fs');
var path = require('path');
var blockCliConfigSettings = require('./config/block_cli_config_settings');

var fileSystemRoot = path.parse(process.cwd()).root;

function getBlockDirPath() {
  var currentDirPath = process.cwd();
  while (currentDirPath !== fileSystemRoot) {
    var currentDirFiles = fs.readdirSync(currentDirPath);
    if (currentDirFiles.includes(blockCliConfigSettings.BLOCK_FILE_NAME)) {
      return currentDirPath;
    }
    // Traverse up one level.
    currentDirPath = path.dirname(currentDirPath);
  }
  throw new Error('Could not find a block directory');
}

module.exports = getBlockDirPath;