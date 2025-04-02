import {InterfaceSdkMode} from '../../sdk_mode';
import {MutationsCore} from '../../shared/models/mutations_core';
import {ModelChange} from '../../shared/types/base_core';
import {spawnError} from '../../shared/error_utils';

/** @hidden */
class Mutations extends MutationsCore<InterfaceSdkMode> {
    /** @internal */
    _doesMutationExceedBatchSizeLimit(mutation: InterfaceSdkMode['MutationT']): boolean {
        throw spawnError('Method not implemented.');
    }
    /** @internal */
    _assertMutationIsValid(mutation: InterfaceSdkMode['MutationT']): void {
        throw spawnError('Method not implemented.');
    }
    /** @internal */
    _getOptimisticModelChangesForMutation(
        mutation: InterfaceSdkMode['MutationT'],
    ): Array<ModelChange> {
        throw spawnError('Method not implemented.');
    }
}

export default Mutations;
