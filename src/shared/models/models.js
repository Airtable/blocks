// @flow
const Base = require('block_sdk/shared/models/base');
const Table = require('block_sdk/shared/models/table');
const Field = require('block_sdk/shared/models/field');
const View = require('block_sdk/shared/models/view');
const Record = require('block_sdk/shared/models/record');
const QueryResult = require('block_sdk/shared/models/query_result');
const TableOrViewQueryResult = require('block_sdk/shared/models/table_or_view_query_result');
const LinkedRecordsQueryResult = require('block_sdk/shared/models/linked_records_query_result');
const aggregators = require('block_sdk/shared/models/aggregators');
const recordColoring = require('block_sdk/shared/models/record_coloring');
const ApiFieldTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/api_field_types',
);
const ApiViewTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/view_types/api_view_types',
);
const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const hyperIdGenerator = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/hyper_id/hyper_id_generator',
);

const models = {
    Base,
    Table,
    Field,
    View,
    Record,
    RecordList: QueryResult, // RecordList has been renamed to QueryResult.
    QueryResult,
    TableOrViewQueryResult,
    LinkedRecordsQueryResult,
    aggregators,
    recordColoring,
    /**
     * @example
     * import {models} from 'airtable-block';
     * const numberFields = myTable.fields.filter(field => (
     *     field.config.type === models.fieldTypes.NUMBER
     * ));
     */
    fieldTypes: ApiFieldTypes,
    /**
     * @example
     * import {models} from 'airtable-block';
     * const gridViews = myTable.views.filter(view => (
     *     view.type === models.viewTypes.GRID
     * ));
     */
    viewTypes: ApiViewTypes,
    permissionLevels: permissionHelpers.ApiPermissionLevels,
    /**
     * Helper to generate a GUID
     * @example
     * import {models} from 'airtable-block';
     * const id = models.generateGuid();
     */
    generateGuid: hyperIdGenerator.generateGuid,
};

module.exports = models;
