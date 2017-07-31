// @flow
const utils = require('client/blocks/sdk/utils');
const BlockMessageTypes = require('client/blocks/block_message_types');
const blockMessageParser = require('client/blocks/block_message_parser');
const invariant = require('invariant');

import type {RecordDataForBlocks} from 'client/blocks/blocks_model_bridge';
import type {BlockToHostMessageType, HostToBlockMessageType, HostMethodName} from 'client/blocks/block_message_types';
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'client/blocks/sdk/models/record';

// TODO(kasra): update this once blocks are running on a separate domain,
// since window.parent.window.location won't be available.
const hostOrigin = window.parent.window.location.origin;

type HostMethodCallback = (error: mixed, result: mixed) => void;

const BatchUpdateTypes = {
    SET_CELL_VALUES: 'SET_CELL_VALUES',
    CREATE_RECORDS: 'CREATE_RECORDS',
    DELETE_RECORDS: 'DELETE_RECORDS',
    SET_MULTIPLE_KV_PATHS: 'SET_MULTIPLE_KV_PATHS',
};
type BatchUpdateType = 'SET_CELL_VALUES' | 'CREATE_RECORDS' | 'DELETE_RECORDS' | 'SET_MULTIPLE_KV_PATHS';

type BatchUpdate =
    {updateType: 'SET_CELL_VALUES', args: {
        tableId: string,
        cellValuesByRecordIdThenFieldId: {[key: string]: RecordDef},
    }} |
    {updateType: 'CREATE_RECORDS', args: {
        tableId: string,
        records: Array<RecordDataForBlocks>,
    }} |
    {updateType: 'DELETE_RECORDS', args: {
        tableId: string,
        recordIds: Array<string>,
    }} |
    {updateType: 'SET_MULTIPLE_KV_PATHS', args: {
        updates: Array<BlockKvUpdate>,
        isDevelopmentMode: boolean,
    }};

class LiveappInterface {
    _nextHostMethodCallId: number;
    _pendingHostMethodCallbacksById: {[key: number]: HostMethodCallback};
    _handlersByMessageType: {[key: string]: Array<(data: Object) => void>};
    _batchUpdatesTimeoutId: null | number;
    _batchUpdateQueue: Array<BatchUpdate>;
    constructor() {
        this._nextHostMethodCallId = 0;
        this._pendingHostMethodCallbacksById = {};
        this._handlersByMessageType = {};
        this._batchUpdatesTimeoutId = null;
        this._batchUpdateQueue = [];

        window.addEventListener('message', event => {
            const result = blockMessageParser.parseMessageFromEvent(event, hostOrigin);
            if (result.error) {
                // TODO(kasra): maybe disable the block or prompt the user to
                // reload the page, since this may be happening due to a version
                // mismatch between the liveapp page and run_block_frame (e.g. user
                // loaded liveapp, we deployed, then they loaded a block).
                console.log('Bad message from host page:', event.data); // eslint-disable-line
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
        window.parent.postMessage({
            blockFrameMessage: {type, data},
        }, hostOrigin);
    }
    // Use `callHostMethodAsync` when you need a response from liveapp.
    async callHostMethodAsync(methodName: HostMethodName, args: Object): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return new Promise((resolve, reject) => {
            this._nextHostMethodCallId++;
            const callId = this._nextHostMethodCallId;

            this._pendingHostMethodCallbacksById[callId] = (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            };

            this.sendMessageToHost(BlockMessageTypes.BlockToHost.CALL_HOST_METHOD,
                {callId, methodName, args});
        });
    }
    // This enqueues a host method call to be batched at the end of the current run loop.
    _enqueueBatchUpdate(batchUpdate: BatchUpdate) {
        if (!this._batchUpdatesTimeoutId) {
            this._batchUpdatesTimeoutId = setTimeout(this._processBatchUpdateQueue.bind(this), 0);
        }

        const lastBatchUpdate = this._batchUpdateQueue.length > 0 ? this._batchUpdateQueue[this._batchUpdateQueue.length - 1] : null;
        const mergedBatchUpdate = lastBatchUpdate ? this._mergeBatchUpdatesIfPossible(lastBatchUpdate, batchUpdate) : null;
        if (mergedBatchUpdate) {
            this._batchUpdateQueue[this._batchUpdateQueue.length - 1] = mergedBatchUpdate;
        } else {
            this._batchUpdateQueue.push(batchUpdate);
        }
    }
    _processBatchUpdateQueue() {
        utils.fireAndForgetPromise(this._processBatchUpdateQueueAsync.bind(this));
    }
    async _processBatchUpdateQueueAsync() {
        // Clear out the timeout id now that it has fired.
        this._batchUpdatesTimeoutId = null;

        if (this._batchUpdateQueue.length === 0) {
            return;
        }

        // Clear the batchUpdateQueue before we hit the async gap below.
        // If we wait until after the for loop to clear the queue, we can end up
        // processing the same batchUpdate twice
        const batchUpdateQueue = this._batchUpdateQueue;
        this._batchUpdateQueue = [];

        for (const batchUpdate of batchUpdateQueue) {
            const hostMethodName = this._getHostMethodNameFromBatchUpdateType(batchUpdate.updateType);
            await this.callHostMethodAsync(hostMethodName, batchUpdate.args);
        }
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
                invariant(originalBatchUpdate.updateType === newBatchUpdate.updateType, 'Incorrect updateType');
                return newBatchUpdate.args.tableId === originalBatchUpdate.args.tableId;

            case BatchUpdateTypes.SET_MULTIPLE_KV_PATHS:
                // Can merge as long as they're in the same run environment.
                invariant(originalBatchUpdate.updateType === newBatchUpdate.updateType, 'Incorrect updateType');
                return originalBatchUpdate.args.isDevelopmentMode === newBatchUpdate.args.isDevelopmentMode;

            default:
                throw new Error('Unrecognized batch update type: ', newBatchUpdate.updateType);
        }
    }
    _mergeBatchUpdatesIfPossible(originalBatchUpdate: BatchUpdate, newBatchUpdate: BatchUpdate): BatchUpdate | null {
        if (!this._canMergeBatchUpdates(originalBatchUpdate, newBatchUpdate)) {
            return null;
        }

        const mergedBatchUpdate = originalBatchUpdate;
        switch (newBatchUpdate.updateType) {
            case BatchUpdateTypes.SET_CELL_VALUES: {
                invariant(mergedBatchUpdate.updateType === BatchUpdateTypes.SET_CELL_VALUES, 'Incorrect updateType');
                const {cellValuesByRecordIdThenFieldId} = newBatchUpdate.args;

                for (const [cellValuesByFieldId, recordId] of utils.iterate(cellValuesByRecordIdThenFieldId)) {
                    for (const [value, fieldId] of utils.iterate(cellValuesByFieldId)) {
                        if (!mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId]) {
                            mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId] = {};
                        }
                        mergedBatchUpdate.args.cellValuesByRecordIdThenFieldId[recordId][fieldId] = value;
                    }
                }
                break;
            }

            case BatchUpdateTypes.CREATE_RECORDS: {
                invariant(mergedBatchUpdate.updateType === BatchUpdateTypes.CREATE_RECORDS, 'Incorrect updateType');
                const {records} = newBatchUpdate.args;
                mergedBatchUpdate.args.records.push(...records);
                break;
            }

            case BatchUpdateTypes.DELETE_RECORDS: {
                invariant(mergedBatchUpdate.updateType === BatchUpdateTypes.DELETE_RECORDS, 'Incorrect updateType');
                const {recordIds} = newBatchUpdate.args;
                mergedBatchUpdate.args.recordIds.push(...recordIds);
                break;
            }

            case BatchUpdateTypes.SET_MULTIPLE_KV_PATHS: {
                // TODO(jb): filter out any redundant updates before sending to liveapp.
                invariant(mergedBatchUpdate.updateType === BatchUpdateTypes.SET_MULTIPLE_KV_PATHS, 'Incorrect updateType');
                const {updates} = newBatchUpdate.args;
                mergedBatchUpdate.args.updates.push(...updates);
                break;
            }

            default:
                throw new Error('Unrecognized batch update type: ', newBatchUpdate.updateType);
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
                throw new Error('Unrecognized batch update type: ', batchUpdateType);
        }
    }
    async fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return this.callHostMethodAsync(BlockMessageTypes.HostMethodNames.FETCH_AND_SUBSCRIBE_TO_TABLE_DATA, {tableId});
    }
    unsubscribeFromTableData(tableId: string) {
        utils.fireAndForgetPromise(this.callHostMethodAsync.bind(this, BlockMessageTypes.HostMethodNames.UNSUBSCRIBE_FROM_TABLE_DATA, {tableId}));
    }
    async fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return this.callHostMethodAsync(BlockMessageTypes.HostMethodNames.FETCH_AND_SUBSCRIBE_TO_VIEW_DATA, {tableId, viewId});
    }
    unsubscribeFromViewData(tableId: string, viewId: string) {
        utils.fireAndForgetPromise(this.callHostMethodAsync.bind(this, BlockMessageTypes.HostMethodNames.UNSUBSCRIBE_FROM_VIEW_DATA, {tableId, viewId}));
    }
    async fetchAndSubscribeToCursorDataAsync(): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return this.callHostMethodAsync(BlockMessageTypes.HostMethodNames.FETCH_AND_SUBSCRIBE_TO_CURSOR_DATA, {});
    }
    unsubscribeFromCursorData() {
        utils.fireAndForgetPromise(this.callHostMethodAsync.bind(this, BlockMessageTypes.HostMethodNames.UNSUBSCRIBE_FROM_CURSOR_DATA, {}));
    }
    setMultipleKvPaths(updates: Array<BlockKvUpdate>, isDevelopmentMode: boolean) {
        this._enqueueBatchUpdate({
            updateType: BatchUpdateTypes.SET_MULTIPLE_KV_PATHS,
            args: {
                updates,
                isDevelopmentMode,
            },
        });
    }
    setCellValues(tableId: string, cellValuesByRecordIdThenFieldId: {[key: string]: {[key: string]: any}}) { // eslint-disable-line flowtype/no-weak-types
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

module.exports = new LiveappInterface();
