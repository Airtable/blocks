"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
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

const permissionHelpers = window.__requirePrivateModuleFromAirtable('client_server_shared/permissions/permission_helpers');

const hyperIdGenerator = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id/hyper_id_generator');

const models = {
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

  /**
   * @example
   * import {models} from 'airtable-block';
   * const numberFields = myTable.fields.filter(field => (
   *     field.config.type === models.fieldTypes.NUMBER
   * ));
   */
  fieldTypes: _field.FieldTypes,

  /**
   * @example
   * import {models} from 'airtable-block';
   * const gridViews = myTable.views.filter(view => (
   *     view.type === models.viewTypes.GRID
   * ));
   */
  viewTypes: _view.ViewTypes,
  permissionLevels: permissionHelpers.ApiPermissionLevels,

  /**
   * Helper to generate a GUID
   * @example
   * import {models} from 'airtable-block';
   * const id = models.generateGuid();
   */
  generateGuid: hyperIdGenerator.generateGuid
};
var _default = models;
exports.default = _default;