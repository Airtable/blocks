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

function useRecordIds(queryResult) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['recordIds']);
  return queryResult.recordIds;
}

function useRecords(queryResult) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'cellValues', 'recordColors']);
  return queryResult.records;
}

function useRecordById(queryResult, recordId) {
  (0, _use_loadable.default)(queryResult);
  (0, _use_watchable.default)(queryResult, ['records', 'recordColors']);
  var record = queryResult.getRecordByIdIfExists(recordId);
  (0, _use_watchable.default)(record, ['cellValues']);
  return record;
}