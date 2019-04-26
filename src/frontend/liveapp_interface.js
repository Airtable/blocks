// @flow
const utils = require('block_sdk/shared/private_utils');
const BlockMessageTypes = window.__requirePrivateModuleFromAirtable(
    'client/blocks/block_message_types',
);
const blockMessageParser = window.__requirePrivateModuleFromAirtable(
    'client/blocks/block_message_parser',
);
const invariant = require('invariant');
const getBaseUrl = window.__requirePrivateModuleFromAirtable('client_server_shared/get_base_url');

import type {RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';
import type {
    BlockToHostMessageType,
    HostToBlockMessageType,
    HostMethodName,
} from 'client/blocks/block_message_types';
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'block_sdk/shared/models/record';

// The origin of the host page. We'll reject all messages that do not come from this origin.
const hostOrigin = getBaseUrl();

type HostMethodCallback = (error: mixed, result: mixed) => void;

const BatchUpdateTypes = {
    SET_CELL_VALUES: ('SET_CELL_VALUES': 'SET_CELL_VALUES'),
    CREATE_RECORDS: ('CREATE_RECORDS': 'CREATE_RECORDS'),
    DELETE_RECORDS: ('DELETE_RECORDS': 'DELETE_RECORDS'),
    SET_MULTIPLE_KV_PATHS: ('SET_MULTIPLE_KV_PATHS': 'SET_MULTIPLE_KV_PATHS'),
};
type BatchUpdateType = $Values<typeof BatchUpdateTypes>;

type BatchUpdate =
    | {
          updateType: 'SET_CELL_VALUES',
          args: {
              tableId: string,
              cellValuesByRecordIdThenFieldId: {[string]: RecordDef},
          },
      }
    | {
          updateType: 'CREATE_RECORDS',
          args: {
              tableId: string,
              records: Array<RecordDataForBlocks>,
          },
      }
    | {
          updateType: 'DELETE_RECORDS',
          args: {
              tableId: string,
              recordIds: Array<string>,
          },
      }
    | {
          updateType: 'SET_MULTIPLE_KV_PATHS',
          args: {
              updates: Array<BlockKvUpdate>,
          },
      };

const HostCallType = {
    STANDARD: ('standard': 'standard'),
    BATCHED_UPDATE: ('batchedUpdate': 'batchedUpdate'),
};

type HostCall =
    | {
          type: typeof HostCallType.STANDARD,
          call: {
              callId: number,
              methodName: HostMethodName,
              args: Object,
          },
      }
    | {
          type: typeof HostCallType.BATCHED_UPDATE,
          update: BatchUpdate,
      };

class LiveappInterface {
    _nextHostMethodCallId: number;
    _pendingHostMethodCallbacksById: {[number]: HostMethodCallback};
    _handlersByMessageType: {[string]: Array<(data: Object) => void>};
    _hostCallQueueTimeoutId: null | TimeoutID;
    _isHostCallQueueBeingProcessed: boolean;
    _hostCallQueue: Array<HostCall>;
    constructor() {
        this._nextHostMethodCallId = 0;
        this._pendingHostMethodCallbacksById = {};
        this._handlersByMessageType = {};
        this._hostCallQueueTimeoutId = null;
        this._isHostCallQueueBeingProcessed = false;
        this._hostCallQueue = [];

        window.addEventListener('message', event => {
            const result = blockMessageParser.parseMessageFromEvent(event, hostOrigin);
            if (result.error) {
                switch (result.error) {
                    case blockMessageParser.ErrorTypes.UNEXPECTED_ORIGIN:
                        // Other frames may be sending messages (e.g. FB login button),
                        // so no-op those messages.
                        break;
                    default:
                        // TODO(kasra): maybe disable the block or prompt the user to
                        // reload the page, since this may be happening due to a version
                        // mismatch between the liveapp page and run_block_frame (e.g. user
                        // loaded liveapp, we deployed, then they loaded a block).
                        console.log('Bad message from host page:', event.data); // eslint-disable-line
                        break;
                }
            } else {
                const handlers = this._handlersByMessageType[result.message.type];
                if (handlers) {
                    for (const handler of handlers) {
                        handler(result.message.data);
                    }
                }
            }
        });

        window.addEventListener('beforeunload', () => {
            this.sendMessageToHost(BlockMessageTypes.BlockToHost.WILL_UNLOAD, {});
        });

        this.registerHandler(BlockMessageTypes.HostToBlock.HOST_METHOD_RESPONSE, data => {
            const callback = this._pendingHostMethodCallbacksById[data.callId];
            if (callback) {
                delete this._pendingHostMethodCallbacksById[data.callId];
                if (data.error) {
                    callback(new Error(data.error), null);
                } else {
                    callback(null, data.result);
                }
            }
        });
    }
    registerHandler(type: HostToBlockMessageType, handlerFn: (data: Object) => void) {
        if (!this._handlersByMessageType[type]) {
            this._handlersByMessageType[type] = [];
        }
        this._handlersByMessageType[type].push(handlerFn);
    }
    // Use `sendMessageToHost` when you don't need a response from liveapp.
    sendMessageToHost(type: BlockToHostMessageType, data: Object = {}) {
        window.parent.postMessage(
            {
                blockFrameMessage: {type, data},
            },
            hostOrigin,
        );
    }
    // Use `callHostMethodAsync` when you need a response from liveapp.
    async callHostMethodAsync(methodName: HostMethodName, args: Object): Promise<any> {
        // eslint-disable-line flowtype/no-weak-types
        return new Promise((resolve, reject) => {
            const callId = this._registerHostMethodCallback((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });

            this._enqueueHostMethodCall({
                type: HostCallType.STANDARD,
                call: {
                    methodName,
                    args,
                    callId,
                },
            });
        });
    }
    _registerHostMethodCallback(callback: Function): number {
        this._nextHostMethodCallId++;
        const callId = this._nextHostMethodCallId;

        this._pendingHostMethodCallbacksById[callId] = callback;
        return callId;
    }
    _enqueueHostMethodCall(hostCall: HostCall) {
        this._hostCallQueue.push(hostCall);

        if (this._isHostCallQueueBeingProcessed || this._hostCallQueueTimeoutId !== null) {
            return;
        }

        this._hostCallQueueTimeoutId = setTimeout(this._processHostCallQueue.bind(this), 0);
    }
    _processHostCallQueue() {
        invariant(
            !this._isHostCallQueueBeingProcessed,
            'host call queue must not be being processed',
        );
        this._hostCallQueueTimeoutId = null;
        this._isHostCallQueueBeingProcessed = true;
        utils.fireAndForgetPromise(async () => {
            try {
                while (this._hostCallQueue.length > 0) {
                    const nextCall = this._hostCallQueue.shift();
                    if (nextCall.type === HostCallType.BATCHED_UPDATE) {
                        // wait for batched updates to be processed before moving on
                        await this._processBatchedUpdateCallAsync(nextCall);
                    } else {
                        // send standard updates instantly, without waiting. where batched updates
                        // (writes) get acknowledged instantly by the host, other methods might
                        // require user input before they return - we don't want all other updates
                        // to get blocked on that.
                        this._processStandardCall(nextCall);
                    }
                }
            } finally {
                this._isHostCallQueueBeingProcessed = false;
            }
        });
    }
    _processBatchedUpdateCallAsync(hostCall: HostCall): Promise<void> {
        invariant(
            hostCall.type === HostCallType.BATCHED_UPDATE,
            'host call type must be batched update',
        );
        const batchUpdate = hostCall.update;
        return new Promise((resolve, reject) => {
            const callId = this._registerHostMethodCallback(error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
            this.sendMessageToHost(BlockMessageTypes.BlockToHost.CALL_HOST_METHOD, {
                callId,
                methodName: this._getHostMethodNameFromBatchUpdateType(batchUpdate.updateType),
                args: batchUpdate.args,
            });
        });
    }
    _processStandardCall(hostCall: HostCall) {
        invariant(hostCall.type === HostCallType.STANDARD, 'host call type must be standard');
        this.sendMessageToHost(BlockMessageTypes.BlockToHost.CALL_HOST_METHOD, hostCall.call);
    }
    _enqueueBatchUpdate(batchUpdate: BatchUpdate) {
        const lastQueuedHostCall =
            this._hostCallQueue.length > 0
                ? this._hostCallQueue[this._hostCallQueue.length - 1]
                : null;

        if (lastQueuedHostCall && lastQueuedHostCall.type === HostCallType.BATCHED_UPDATE) {
            const lastBatchUpdate = lastQueuedHostCall.update;
            const mergedBatchUpdate = this._mergeBatchUpdatesIfPossible(
                lastBatchUpdate,
                batchUpdate,
            );
            if (mergedBatchUpdate) {
                lastQueuedHostCall.update = mergedBatchUpdate;
                return;
            }
        }

        this._enqueueHostMethodCall({
            type: HostCallType.BATCHED_UPDATE,
            update: batchUpdate,
        });
    }
    _canMergeBatchUpdates(originalBatchUpdate: BatchUpdate, newBatchUpdate: BatchUpdate) {
        if (originalBatchUpdate.updateType !== newBatchUpdate.updateType) {
            // Cannot merge two batch updates with different types.
            return false;
        }

        switch (newBatchUpdate.updateType) {
            case BatchUpdateTypes.SET_CELL_VALUES:
            case BatchUpdateTypes.CREATE_RECORDS:
            case BatchUpdateTypes.DELETE_RECORDS:
                // Can merge these update types together as long as they are scoped to the same table.
                invariant(
                    originalBatchUpdate.updateType === newBatchUpdate.updateType,
                    'Incorrect updateType',
                );
                return newBatchUpdate.args.tableId === originalBatchUpdate.args.tableId;

            case BatchUpdateTypes.SET_MULTIPLE_KV_PATHS:
                return true;

            default:
                throw new Error('Unrecognized batch update type: ' + newBatchUpdate.updateType);
        }
    }
    _mergeBatchUpdatesIfPossible(
        originalBatchUpdate: BatchUpdate,
        newBatchUpdate: BatchUpdate,
    ): BatchUpdate | null {
        if (!this._canMergeBatchUpdates(originalBatchUpdate, newBatchUpdate)) {
            return null;
        }

        const mergedBatchUpdate = originalBatchUpdate;
        switch (newBatchUpdate.updateType) {
            case BatchUpdateTypes.SET_CELL_VALUES: {
                invariant(
                    mergedBatchUpdate.updateType === BatchUpdateTypes.SET_CELL_VALUES,
                    'Incorrect updateType',
                );
                const {cellValuesByRecordIdThenFieldId} = newBatchUpdate.args;

                for (const [recordId, cellValuesByFieldId] of utils.entries(
                    cellValuesByRecordIdThenFieldId,
                )) {
                    for (const [fieldId, value] of utils.entries(cellValuesByFieldId)) {
                        if (!mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId]) {
                            mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId] = {};
                        }
                        mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId][
                            fieldId
                        ] = value;
                    }
                }
                break;
            }

            case BatchUpdateTypes.CREATE_RECORDS: {
                invariant(
                    mergedBatchUpdate.updateType === BatchUpdateTypes.CREATE_RECORDS,
                    'Incorrect updateType',
                );
                const {records} = newBatchUpdate.args;
                mergedBatchUpdate.args.records.push(...records);
                break;
            }

            case BatchUpdateTypes.DELETE_RECORDS: {
                invariant(
                    mergedBatchUpdate.updateType === BatchUpdateTypes.DELETE_RECORDS,
                    'Incorrect updateType',
                );
                const {recordIds} = newBatchUpdate.args;
                mergedBatchUpdate.args.recordIds.push(...recordIds);
                break;
            }

            case BatchUpdateTypes.SET_MULTIPLE_KV_PATHS: {
                // TODO(jb): filter out any redundant updates before sending to liveapp.
                invariant(
                    mergedBatchUpdate.updateType === BatchUpdateTypes.SET_MULTIPLE_KV_PATHS,
                    'Incorrect updateType',
                );
                const {updates} = newBatchUpdate.args;
                mergedBatchUpdate.args.updates.push(...updates);
                break;
            }

            default:
                throw new Error('Unrecognized batch update type: ' + newBatchUpdate.updateType);
        }

        return mergedBatchUpdate;
    }
    _getHostMethodNameFromBatchUpdateType(batchUpdateType: BatchUpdateType): HostMethodName {
        switch (batchUpdateType) {
            case BatchUpdateTypes.SET_CELL_VALUES:
                return BlockMessageTypes.HostMethodNames.SET_CELL_VALUES;

            case BatchUpdateTypes.CREATE_RECORDS:
                return BlockMessageTypes.HostMethodNames.CREATE_RECORDS;

            case BatchUpdateTypes.DELETE_RECORDS:
                return BlockMessageTypes.HostMethodNames.DELETE_RECORDS;

            case BatchUpdateTypes.SET_MULTIPLE_KV_PATHS:
                return BlockMessageTypes.HostMethodNames.SET_MULTIPLE_KV_PATHS;

            default:
                throw new Error('Unrecognized batch update type: ' + batchUpdateType);
        }
    }
    setMultipleKvPaths(updates: Array<BlockKvUpdate>) {
        this._enqueueBatchUpdate({
            updateType: BatchUpdateTypes.SET_MULTIPLE_KV_PATHS,
            args: {
                updates,
            },
        });
    }
    setCellValues(tableId: string, cellValuesByRecordIdThenFieldId: {[string]: {[string]: any}}) {
        // eslint-disable-line flowtype/no-weak-types
        this._enqueueBatchUpdate({
            updateType: BatchUpdateTypes.SET_CELL_VALUES,
            args: {
                tableId,
                cellValuesByRecordIdThenFieldId,
            },
        });
    }
    createRecords(tableId: string, recordDefs: Array<RecordDataForBlocks>) {
        this._enqueueBatchUpdate({
            updateType: BatchUpdateTypes.CREATE_RECORDS,
            args: {
                tableId,
                records: recordDefs,
            },
        });
    }
    deleteRecords(tableId: string, recordIds: Array<string>) {
        this._enqueueBatchUpdate({
            updateType: BatchUpdateTypes.DELETE_RECORDS,
            args: {
                tableId,
                recordIds,
            },
        });
    }
}

module.exports = LiveappInterface;
