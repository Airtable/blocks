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
};

export default models;
