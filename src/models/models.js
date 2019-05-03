// @flow
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
import FieldTypes from '../types/field_types';
import ViewTypes from '../types/view_types';
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

export default models;
