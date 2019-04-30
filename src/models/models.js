// @flow
const Base = require('./base');
const Table = require('./table');
const Field = require('./field');
const View = require('./view');
const Record = require('./record');
const QueryResult = require('./query_result');
const TableOrViewQueryResult = require('./table_or_view_query_result');
const LinkedRecordsQueryResult = require('./linked_records_query_result');
const aggregators = require('./aggregators');
const recordColoring = require('./record_coloring');
const FieldTypes = require('../types/field_types');
const ViewTypes = require('../types/view_types');
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
    fieldTypes: FieldTypes,
    /**
     * @example
     * import {models} from 'airtable-block';
     * const gridViews = myTable.views.filter(view => (
     *     view.type === models.viewTypes.GRID
     * ));
     */
    viewTypes: ViewTypes,
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
