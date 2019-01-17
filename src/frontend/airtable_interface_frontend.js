// @flow
const {HostMethodNames} = require('client/blocks/block_message_types');
const utils = require('block_sdk/shared/private_utils');

import type LiveappInterface from 'block_sdk/frontend/liveapp_interface';
import type {AbstractAirtableInterface} from 'block_sdk/shared/abstract_airtable_interface';
import type {HostToBlockMessageType} from 'client/blocks/block_message_types';
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'block_sdk/shared/models/record';
import type {RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';
import type {ViewportSizeConstraint} from 'block_sdk/frontend/viewport';
import type {BlockUndoRedoMode} from 'client/blocks/block_undo_redo_modes';

class AirtableInterfaceFrontend implements AbstractAirtableInterface {
    _liveappInterface: LiveappInterface;
    constructor(liveappInterface: LiveappInterface) {
        this._liveappInterface = liveappInterface;
    }
    async setMultipleKvPathsAsync(updates: Array<BlockKvUpdate>): Promise<void> {
        // TODO(jb): actually await the server response.
        this._liveappInterface.setMultipleKvPaths(updates);
    }
    async fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_TABLE_DATA, {tableId});
    }
    unsubscribeFromTableData(tableId: string) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(this._liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_TABLE_DATA, {tableId}));
    }
    async fetchAndSubscribeToCellValuesInFieldsAsync(tableId: string, fieldIds: Array<string>): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_CELL_VALUES_IN_FIELDS, {tableId, fieldIds});
    }
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(this._liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_CELL_VALUES_IN_FIELDS, {tableId, fieldIds}));
    }
    async setCellValuesAsync(tableId: string, cellValuesByRecordIdThenFieldId: {[string]: RecordDef}): Promise<void> {
        // TODO(jb): actually await the server response.
        this._liveappInterface.setCellValues(tableId, cellValuesByRecordIdThenFieldId);
    }
    async deleteRecordsAsync(tableId: string, recordIds: Array<string>): Promise<void> {
        // TODO(jb): actually await the server response.
        this._liveappInterface.deleteRecords(tableId, recordIds);
    }
    async createRecordsAsync(tableId: string, recordDefs: Array<RecordDataForBlocks>): Promise<void> {
        // TODO(jb): actually await the server response.
        this._liveappInterface.createRecords(tableId, recordDefs);
    }
    async fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_VIEW_DATA, {tableId, viewId});
    }
    unsubscribeFromViewData(tableId: string, viewId: string) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(this._liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_VIEW_DATA, {tableId, viewId}));
    }

    /*
     * NOTE: the below methods are frontend-only.
     */
    registerHandler(type: HostToBlockMessageType, handlerFn: (data: Object) => void) {
        this._liveappInterface.registerHandler(type, handlerFn);
    }
    async fetchAndSubscribeToCursorDataAsync(): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await this._liveappInterface.callHostMethodAsync(
            HostMethodNames.FETCH_AND_SUBSCRIBE_TO_CURSOR_DATA,
            {},
        );
    }
    unsubscribeFromCursorData() {
        utils.fireAndForgetPromise(
            this._liveappInterface.callHostMethodAsync.bind(
                this._liveappInterface,
                HostMethodNames.UNSUBSCRIBE_FROM_CURSOR_DATA,
                {},
            ),
        );
    }
    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(
            this._liveappInterface,
            HostMethodNames.EXPAND_RECORD,
            {
                tableId,
                recordId,
                opts: {
                    recordIds,
                },
            },
        ));
    }
    expandRecordList(tableId: string, recordIds: Array<string>, fieldIds: Array<string> | null) {
        utils.fireAndForgetPromise(
            this._liveappInterface.callHostMethodAsync.bind(
                this._liveappInterface,
                HostMethodNames.EXPAND_RECORD_LIST,
                {tableId, recordIds, fieldIds},
            ),
        );
    }
    async expandRecordPickerAsync(tableId: string, recordIds: Array<string>, fieldIds: Array<string> | null, shouldAllowCreatingRecord: boolean): Promise<string | null> {
        const chosenRecordId = await this._liveappInterface.callHostMethodAsync(
            HostMethodNames.EXPAND_RECORD_PICKER,
            {
                tableId,
                recordIds,
                fieldIds,
                shouldAllowCreatingRecord,
            },
        );
        return chosenRecordId;
    }
    reloadFrame() {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(
            this._liveappInterface,
            HostMethodNames.RELOAD_FRAME,
        ));
    }
    setSettingsButtonVisibility(isVisible: boolean) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(
            this._liveappInterface,
            HostMethodNames.SET_SETTINGS_BUTTON_VISIBILITY,
            {isVisible},
        ));
    }
    setUndoRedoMode(mode: BlockUndoRedoMode) {
        utils.fireAndForgetPromise(this._liveappInterface.callHostMethodAsync.bind(
            this._liveappInterface,
            HostMethodNames.SET_UNDO_REDO_MODE,
            {mode},
        ));
    }
    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint) {
        utils.fireAndForgetPromise(
            this._liveappInterface.callHostMethodAsync.bind(
                this._liveappInterface,
                HostMethodNames.SET_FULLSCREEN_MAX_SIZE,
                maxFullscreenSize,
            ),
        );
    }
    enterFullscreen() {
        utils.fireAndForgetPromise(
            this._liveappInterface.callHostMethodAsync.bind(
                this._liveappInterface,
                HostMethodNames.ENTER_FULLSCREEN,
            ),
        );
    }
    exitFullscreen() {
        utils.fireAndForgetPromise(
            this._liveappInterface.callHostMethodAsync.bind(
                this._liveappInterface,
                HostMethodNames.EXIT_FULLSCREEN,
            ),
        );
    }
}

module.exports = AirtableInterfaceFrontend;
