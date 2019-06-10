// @flow
import {FieldTypes} from '../types/field';
import {ViewTypes} from '../types/view';
import Base from './base';
import Table from './table';
import Field from './field';
import View from './view';
import Record from './record';
import QueryResult from './query_result';
import TableOrViewQueryResult from './table_or_view_query_result';
import LinkedRecordsQueryResult from './linked_records_query_result';
import aggregators from './aggregators';
import * as recordColoring from './record_coloring';

const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const hyperIdGenerator = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/hyper_id/hyper_id_generator',
);

/**
 * @alias fieldTypes
 * @example
 * import {models} from 'airtable-block';
 * const numberFields = myTable.fields.filter(field => (
 *     field.type === models.fieldTypes.NUMBER
 * ));
 */
const fieldTypes = FieldTypes;

/**
 * @alias viewTypes
 * @example
 * import {models} from 'airtable-block';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === models.viewTypes.GRID
 * ));
 */
const viewTypes = ViewTypes;

/**
 * Helper to generate a GUID
 * @function
 * @returns string
 * @alias generateGuid
 * @example
 * import {models} from 'airtable-block';
 * const id = models.generateGuid();
 */
const generateGuid = hyperIdGenerator.generateGuid;

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
    fieldTypes,
    viewTypes,
    permissionLevels: permissionHelpers.ApiPermissionLevels,

    generateGuid,
};

export default models;
