"use strict";


var INVALID_REMOTE_JSON_ERROR_MESSAGE = "remote.json must be an object with the following properties:\n\n- blockId: string\n- baseId: string";




function validateRemoteJson(remoteJson) {
  if (
  remoteJson instanceof Object &&
  typeof remoteJson.blockId === 'string' &&
  typeof remoteJson.baseId === 'string' && (
  remoteJson.server === undefined || typeof remoteJson.server === 'string'))
  {
    return { pass: true };
  }
  return { pass: false, reason: INVALID_REMOTE_JSON_ERROR_MESSAGE };
}

module.exports = validateRemoteJson;