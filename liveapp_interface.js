// @flow
const utils = require('client/blocks/sdk/utils');
const BlockMessageTypes = require('client/blocks/block_message_types');
const blockMessageParser = require('client/blocks/block_message_parser');

import type {BlockToHostMessageType, HostToBlockMessageType, HostMethodName} from 'client/blocks/block_message_types';

// TODO(kasra): update this once blocks are running on a separate domain,
// since window.parent.window.location won't be available.
const hostOrigin = window.parent.window.location.origin;

type HostMethodCallback = (error: mixed, result: mixed) => void;

class LiveappInterface {
    _nextHostMethodCallId: number;
    _pendingHostMethodCallbacksById: {[key: number]: HostMethodCallback};
    _handlersByMessageType: {[key: string]: Array<(data: Object) => void>};
    constructor() {
        this._nextHostMethodCallId = 0;
        this._pendingHostMethodCallbacksById = {};
        this._handlersByMessageType = {};

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
    setKvValue(key: string, value: ?string, isDevelopmentMode: boolean) {
        utils.fireAndForgetPromise(this.callHostMethodAsync.bind(this, BlockMessageTypes.HostMethodNames.SET_KV_VALUE, {key, value, isDevelopmentMode}));
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
    async setCellValueAsync(tableId: string, recordId: string, fieldId: string, value: any) { // eslint-disable-line flowtype/no-weak-types
        return this.callHostMethodAsync(BlockMessageTypes.HostMethodNames.SET_CELL_VALUE, {
            tableId,
            recordId,
            fieldId,
            value,
        });
    }
}

module.exports = new LiveappInterface();
