// @flow
import {FieldTypes} from '../types/field';
import {ViewTypes} from '../types/view';
import Base from './base';
import Table from './table';
import Field from './field';
import View from './view';
import Record from './record';
import RecordQueryResult from './record_query_result';
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
 * Helper to generate a GUID.
 *
 * @function
 * @returns {string}
 * @alias generateGuid
 * @example
 * import {generateGuid} from '@airtable/blocks/models';
 * const id = generateGuid();
 */
const generateGuid = hyperIdGenerator.generateGuid;

const models = {
    Base,
    Table,
    Field,
    View,
    Record,
    RecordQueryResult,
    TableOrViewQueryResult,
    LinkedRecordsQueryResult,
    aggregators,
    recordColoring,
    fieldTypes: FieldTypes,
    viewTypes: ViewTypes,
    permissionLevels: permissionHelpers.ApiPermissionLevels,

    generateGuid,
};

export default models;
