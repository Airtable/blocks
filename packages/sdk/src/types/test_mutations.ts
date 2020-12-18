import {ObjectValues} from '../private_utils';
import {Mutation, MutationTypes} from './mutations';
import {FieldId} from './field';
import {TableId} from './table';
import {ViewId} from './view';

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
