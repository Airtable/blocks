// @flow
import {type GlobalConfigUpdate} from '../global_config';
import {type TableId} from './table';
import {type FieldId} from './field';
import {type RecordId} from './record';

export const MutationTypes = Object.freeze({
    SET_MULTIPLE_RECORDS_CELL_VALUES: ('setMultipleRecordsCellValues': 'setMultipleRecordsCellValues'),
    DELETE_MULTIPLE_RECORDS: ('deleteMultipleRecords': 'deleteMultipleRecords'),
    CREATE_MULTIPLE_RECORDS: ('createMultipleRecords': 'createMultipleRecords'),
    SET_MULTIPLE_GLOBAL_CONFIG_PATHS: ('setMultipleGlobalConfigPaths': 'setMultipleGlobalConfigPaths'),
});

export type MutationType = $Values<typeof MutationTypes>;

export type SetMultipleRecordsCellValuesMutation = {|
    +type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
    +tableId: TableId,
    +records: $ReadOnlyArray<{
        +id: RecordId,
        +cellValuesByFieldId: {
            +[FieldId]: mixed,
        },
    }>,
|};

export type DeleteMultipleRecordsMutation = {|
    +type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS,
    +tableId: TableId,
    +recordIds: $ReadOnlyArray<RecordId>,
|};

export type CreateMultipleRecordsMutation = {|
    +type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS,
    +tableId: TableId,
    +records: $ReadOnlyArray<{
        +id: RecordId,
        +cellValuesByFieldId: {
            +[FieldId]: mixed,
        },
    }>,
|};

export type SetMultipleGlobalConfigPathsMutation = {|
    +type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
    +updates: $ReadOnlyArray<GlobalConfigUpdate>,
|};

export type Mutation =
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation
    | SetMultipleGlobalConfigPathsMutation;
