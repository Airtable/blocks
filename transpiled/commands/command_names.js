"use strict";
var CommandNames = {
  INIT: 'init',
  RUN: 'run',
  RELEASE: 'release',

  // These commands are no longer supported.
  // TODO(jb): remove them once all blocks are migrated to the standalone CLI world.
  CLONE: 'clone',
  PUSH: 'push',
  PULL: 'pull',
  RENAME_ENTRY: 'rename-entry',
  SET_CREDENTIAL: 'set-credential',
  DELETE_CREDENTIAL: 'delete-credential',
  LIST_CREDENTIALS: 'list-credentials',
  RENAME_CREDENTIAL: 'rename-credential' };




module.exports = CommandNames;