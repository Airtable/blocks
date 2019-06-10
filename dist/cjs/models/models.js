"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _field = require("../types/field");

var _view = require("../types/view");

var _base = _interopRequireDefault(require("./base"));

var _table = _interopRequireDefault(require("./table"));

var _field2 = _interopRequireDefault(require("./field"));

var _view2 = _interopRequireDefault(require("./view"));

var _record = _interopRequireDefault(require("./record"));

var _query_result = _interopRequireDefault(require("./query_result"));

var _table_or_view_query_result = _interopRequireDefault(require("./table_or_view_query_result"));

var _linked_records_query_result = _interopRequireDefault(require("./linked_records_query_result"));

var _aggregators = _interopRequireDefault(require("./aggregators"));

var recordColoring = _interopRequireWildcard(require("./record_coloring"));

var permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

var hyperIdGenerator = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id/hyper_id_generator');
/**
 * @alias fieldTypes
 * @example
 * import {models} from 'airtable-block';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === models.fieldTypes.NUMBER
 * ));
 */


var fieldTypes = _field.FieldTypes;
/**
 * @alias viewTypes
 * @example
 * import {models} from 'airtable-block';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === models.viewTypes.GRID
 * ));
 */

var viewTypes = _view.ViewTypes;
/**
 * Helper to generate a GUID
 * @function
 * @returns string
 * @alias generateGuid
 * @example
 * import {models} from 'airtable-block';
 * const id = models.generateGuid();
 */

var generateGuid = hyperIdGenerator.generateGuid;
var models = {
  Base: _base.default,
  Table: _table.default,
  Field: _field2.default,
  View: _view2.default,
  Record: _record.default,
  RecordList: _query_result.default,
  // RecordList has been renamed to QueryResult.
  QueryResult: _query_result.default,
  TableOrViewQueryResult: _table_or_view_query_result.default,
  LinkedRecordsQueryResult: _linked_records_query_result.default,
  aggregators: _aggregators.default,
  recordColoring,
  fieldTypes,
  viewTypes,
  permissionLevels: permissionHelpers.ApiPermissionLevels,
  generateGuid
};
var _default = models;
exports.default = _default;