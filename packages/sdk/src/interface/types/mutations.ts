import {type ObjectValues} from '../../shared/private_utils';
import {
    type MutationCore,
    MutationTypesCore,
    type PartialMutationCore,
} from '../../shared/types/mutations_core';

/** @hidden */
export const MutationTypes = Object.freeze({
    ...MutationTypesCore,
});

/** @hidden */
export type MutationType = ObjectValues<typeof MutationTypes>;

/** @hidden */
export type Mutation = MutationCore;

/** @hidden */
export type PartialMutation = PartialMutationCore;
