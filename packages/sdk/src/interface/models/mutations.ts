import {InterfaceSdkMode} from '../../sdk_mode';
import {MutationsCore} from '../../shared/models/mutations_core';
import {ModelChange} from '../../shared/types/base_core';
import {Mutation, MutationTypes} from '../types/mutations';
import {RecordData} from '../types/record';

/** @hidden */
export class Mutations extends MutationsCore<InterfaceSdkMode> {
    /** @internal */
    _isRecordStoreReadyForMutations(): boolean {
        return true;
    }

    /** @internal */
    _isFieldAvailableForMutation(): boolean {
        return true;
    }

    /** @internal */
    _getDefaultRecordProperties(): Partial<RecordData> {
        return {
            createdTime: new Date().toJSON(),
        };
    }

    /** @internal */
    _getOptimisticModelChangesForMutation(mutation: Mutation): Array<ModelChange> {
        switch (mutation.type) {
            case MutationTypes.CREATE_MULTIPLE_RECORDS: {
                return super._getOptimisticModelChangesForMutation(mutation);
            }
            case MutationTypes.DELETE_MULTIPLE_RECORDS: {
                const {tableId, recordIds: deletedRecordIds} = mutation;
                const recordStore = this._base.__getRecordStore(tableId);
                const deletedRecordIdsSet = new Set(deletedRecordIds);
                return [
                    {
                        path: ['tablesById', tableId, 'recordOrder'],
                        value: recordStore.recordIds.filter(
                            recordId => !deletedRecordIdsSet.has(recordId),
                        ),
                    },
                    ...super._getOptimisticModelChangesForMutation(mutation),
                ];
            }
            default: {
                return super._getOptimisticModelChangesForMutation(mutation);
            }
        }
    }
}
