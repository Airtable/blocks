"use strict";
var path = require('path');

function getBlocksCliProjectRootPath() {
  return path.join(__dirname, '..', '..');
}

module.exports = getBlocksCliProjectRootPath;