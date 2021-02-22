import {Mutation, MutationTypes} from '@airtable/blocks/unstable_testing_utils';
import {FieldId, TableId, ViewId} from '@airtable/blocks/types';

/**
 * Get the type of all the values of an object.
 *
 * Same as the legacy Flow `$Values<T>` type.
 *
 * @hidden
 */
export type ObjectValues<T extends object> = T[keyof T];

/** @hidden */
export const TestMutationTypes = Object.freeze({
    ...MutationTypes,
    DELETE_SINGLE_FIELD: 'deleteSingleField' as const,
    DELETE_SINGLE_VIEW: 'deleteSingleView' as const,
});

/** @hidden */
export type TestMutationType = ObjectValues<typeof TestMutationTypes>;

/** @hidden */
interface TestDeleteSingleFieldMutation {
    readonly type: typeof TestMutationTypes.DELETE_SINGLE_FIELD;
    readonly tableId: TableId;
    readonly id: FieldId;
}

/** @hidden */
interface TestDeleteSingleViewMutation {
    readonly type: typeof TestMutationTypes.DELETE_SINGLE_VIEW;
    readonly tableId: TableId;
    readonly id: ViewId;
}

/** @hidden */
export type TestMutation = Mutation | TestDeleteSingleFieldMutation | TestDeleteSingleViewMutation;
