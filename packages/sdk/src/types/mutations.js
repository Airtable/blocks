// @flow
import {type GlobalConfigUpdate, type GlobalConfigValue} from '../global_config';
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

export type PartialSetMultipleRecordsCellValuesMutation = {|
    +type: typeof MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
    +tableId: TableId | void,
    +records: $ReadOnlyArray<{
        +id: RecordId | void,
        +cellValuesByFieldId: {
            +[FieldId]: mixed | void,
        } | void,
    }> | void,
|};

export type DeleteMultipleRecordsMutation = {|
    +type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS,
    +tableId: TableId,
    +recordIds: $ReadOnlyArray<RecordId>,
|};

export type PartialDeleteMultipleRecordsMutation = {|
    +type: typeof MutationTypes.DELETE_MULTIPLE_RECORDS,
    +tableId: TableId | void,
    +recordIds: $ReadOnlyArray<RecordId> | void,
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

export type PartialCreateMultipleRecordsMutation = {|
    +type: typeof MutationTypes.CREATE_MULTIPLE_RECORDS,
    +tableId: TableId | void,
    +records: $ReadOnlyArray<{
        +id: RecordId | void,
        +cellValuesByFieldId: {
            +[FieldId]: mixed | void,
        } | void,
    }> | void,
|};

export type SetMultipleGlobalConfigPathsMutation = {|
    +type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
    +updates: $ReadOnlyArray<GlobalConfigUpdate>,
|};

export type PartialSetMultipleGlobalConfigPathsMutation = {|
    +type: typeof MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
    +updates: $ReadOnlyArray<{|
        +path: $ReadOnlyArray<string | void> | void,
        +value: GlobalConfigValue | void | void,
    |}> | void,
|};

export type Mutation =
    | SetMultipleRecordsCellValuesMutation
    | DeleteMultipleRecordsMutation
    | CreateMultipleRecordsMutation
    | SetMultipleGlobalConfigPathsMutation;

export type PartialMutation =
    | PartialSetMultipleRecordsCellValuesMutation
    | PartialDeleteMultipleRecordsMutation
    | PartialCreateMultipleRecordsMutation
    | PartialSetMultipleGlobalConfigPathsMutation;

export type PermissionCheckResult =
    | {|hasPermission: true|}
    | {|hasPermission: false, reasonDisplayString: string|};
