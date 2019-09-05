// @flow
import {type GlobalConfigUpdate} from '../global_config';
import {type TableId} from './table';
import {type FieldId} from './field';
import {type RecordId} from './record';

export const MutationTypes = Object.freeze({
    SET_SINGLE_RECORD_CELL_VALUES: ('setSingleRecordCellValues': 'setSingleRecordCellValues'),
    DELETE_SINGLE_RECORD: ('deleteSingleRecord': 'deleteSingleRecord'),
    CREATE_SINGLE_RECORD: ('createSingleRecord': 'createSingleRecord'),
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: ('setMultipleGlobalConfigPaths': 'setMultipleGlobalConfigPaths'),
});

export type MutationType = $Values<typeof MutationTypes>;

export type SetSingleRecordCellValuesMutation = {|
    type: typeof MutationTypes.SET_SINGLE_RECORD_CELL_VALUES,
    tableId: TableId,
    recordId: RecordId,
    cellValuesByFieldId: {
        [FieldId]: mixed,
    },
|};

export type DeleteSingleRecordMutation = {|
    type: typeof MutationTypes.DELETE_SINGLE_RECORD,
    tableId: TableId,
    recordId: RecordId,
|};

export type CreateSingleRecordMutation = {|
    type: typeof MutationTypes.CREATE_SINGLE_RECORD,
    tableId: TableId,
    recordId: RecordId,
    cellValuesByFieldId: {
        [FieldId]: mixed,
    },
|};

export type SetMultipleGlobalConfigPathsMutation = {|
    type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
    updates: Array<GlobalConfigUpdate>,
|};

export type Mutation =
    | SetSingleRecordCellValuesMutation
    | DeleteSingleRecordMutation
    | CreateSingleRecordMutation
    | SetMultipleGlobalConfigPathsMutation;
