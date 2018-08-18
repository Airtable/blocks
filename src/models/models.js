// @flow
const Base = require('client/blocks/sdk/models/base');
const Table = require('client/blocks/sdk/models/table');
const Field = require('client/blocks/sdk/models/field');
const View = require('client/blocks/sdk/models/view');
const Record = require('client/blocks/sdk/models/record');
const QueryResult = require('client/blocks/sdk/models/query_result');
const LinkedRecordsQueryResult = require('client/blocks/sdk/models/linked_records_query_result');
const aggregators = require('client/blocks/sdk/models/aggregators');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const permissionHelpers = require('client_server_shared/permissions/permission_helpers');
const hyperIdGenerator = require('client_server_shared/hyper_id/hyper_id_generator');

const models = {
    Base,
    Table,
    Field,
    View,
    Record,
    RecordList: QueryResult, // RecordList has been renamed to QueryResult.
    QueryResult,
    LinkedRecordsQueryResult,
    aggregators,
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
