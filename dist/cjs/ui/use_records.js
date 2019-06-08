"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRecordIds = useRecordIds;
exports.useRecords = useRecords;
exports.useRecordById = useRecordById;

var _use_loadable = _interopRequireDefault(require("./use_loadable"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

// TODO: should these hooks return [] if queryResult is null?
function useRecordIds(queryResult) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['recordIds']);
  return queryResult ? queryResult.recordIds : null;
}

function useRecords(queryResult) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'cellValues', 'recordColors']);
  return queryResult ? queryResult.records : null;
}

function useRecordById(queryResult, recordId) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'recordColors']);
  var record = queryResult ? queryResult.getRecordByIdIfExists(recordId) : null;
  (0, _use_watchable.default)(record, ['cellValues']);
  return record;
}