import {ObjectValues} from '../../shared/private_utils';
import {
    MutationCore,
    MutationTypesCore,
    PartialMutationCore,
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
