"use strict";function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}












function parseBlockIdentifier(blockIdentifier) {
  var blockIdentifierSplit = blockIdentifier.split('/');
  if (
  blockIdentifierSplit.length !== 2 ||
  !blockIdentifierSplit[0].startsWith('app') ||
  !blockIdentifierSplit[1].startsWith('blk'))
  {
    return {
      success: false,
      error: new Error('Block identifier must be of format <baseId>/<blockId>') };

  }var _blockIdentifierSplit = _slicedToArray(
  blockIdentifierSplit, 2),baseId = _blockIdentifierSplit[0],blockId = _blockIdentifierSplit[1];
  return {
    success: true,
    value: {
      baseId: baseId,
      blockId: blockId } };


}

module.exports = parseBlockIdentifier;