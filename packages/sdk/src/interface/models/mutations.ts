import {InterfaceSdkMode} from '../../sdk_mode';
import {MUTATIONS_MAX_BATCH_SIZE, MutationsCore} from '../../shared/models/mutations_core';
import {ModelChange} from '../../shared/types/base_core';
import {spawnError, spawnUnknownSwitchCaseError} from '../../shared/error_utils';
import {MutationTypes} from '../types/mutations';

/** @hidden */
export class Mutations extends MutationsCore<InterfaceSdkMode> {
    /** @internal */
    _doesMutationExceedBatchSizeLimit(mutation: InterfaceSdkMode['MutationT']): boolean {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
                return mutation.updates.length > MUTATIONS_MAX_BATCH_SIZE;
            default:
                throw spawnUnknownSwitchCaseError('mutation type', mutation.type, 'type');
        }
    }
    /** @internal */
    _assertMutationIsValid(mutation: InterfaceSdkMode['MutationT']): void {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
                return;
            default:
                throw spawnUnknownSwitchCaseError('mutation type', mutation.type, 'type');
        }
    }
    /** @internal */
    _getOptimisticModelChangesForMutation(
        mutation: InterfaceSdkMode['MutationT'],
    ): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS:
                throw spawnError(
                    'attempting to generate model updates for SET_MULTIPLE_GLOBAL_CONFIG_PATH',
                );
            default:
                throw spawnUnknownSwitchCaseError('mutation type', mutation.type, 'type');
        }
    }
}
