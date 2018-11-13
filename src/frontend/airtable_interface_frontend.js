// @flow
const liveappInterface = require('block_sdk/frontend/liveapp_interface');
const {HostMethodNames} = require('client/blocks/block_message_types');
const utils = require('block_sdk/shared/private_utils');

import type {AbstractAirtableInterface} from 'block_sdk/shared/abstract_airtable_interface';
import type {HostToBlockMessageType} from 'client/blocks/block_message_types';
import type {BlockKvUpdate} from 'client_server_shared/blocks/block_kv_helpers';
import type {RecordDef} from 'block_sdk/shared/models/record';
import type {RecordDataForBlocks} from 'client_server_shared/blocks/block_sdk_init_data';
import type {ViewportSizeConstraint} from 'block_sdk/frontend/viewport';

class AirtableInterfaceFrontend implements AbstractAirtableInterface {
    async setMultipleKvPathsAsync(updates: Array<BlockKvUpdate>): Promise<void> {
        // TODO(jb): actually await the server response.
        liveappInterface.setMultipleKvPaths(updates);
    }
    async fetchAndSubscribeToTableDataAsync(tableId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_TABLE_DATA, {tableId});
    }
    unsubscribeFromTableData(tableId: string) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_TABLE_DATA, {tableId}));
    }
    async fetchAndSubscribeToCellValuesInFieldsAsync(tableId: string, fieldIds: Array<string>): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_CELL_VALUES_IN_FIELDS, {tableId, fieldIds});
    }
    unsubscribeFromCellValuesInFields(tableId: string, fieldIds: Array<string>) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_CELL_VALUES_IN_FIELDS, {tableId, fieldIds}));
    }
    async setCellValuesAsync(tableId: string, cellValuesByRecordIdThenFieldId: {[string]: RecordDef}): Promise<void> {
        // TODO(jb): actually await the server response.
        liveappInterface.setCellValues(tableId, cellValuesByRecordIdThenFieldId);
    }
    async deleteRecordsAsync(tableId: string, recordIds: Array<string>): Promise<void> {
        // TODO(jb): actually await the server response.
        liveappInterface.deleteRecords(tableId, recordIds);
    }
    async createRecordsAsync(tableId: string, recordDefs: Array<RecordDataForBlocks>): Promise<void> {
        // TODO(jb): actually await the server response.
        liveappInterface.createRecords(tableId, recordDefs);
    }
    async fetchAndSubscribeToViewDataAsync(tableId: string, viewId: string): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await liveappInterface.callHostMethodAsync(HostMethodNames.FETCH_AND_SUBSCRIBE_TO_VIEW_DATA, {tableId, viewId});
    }
    unsubscribeFromViewData(tableId: string, viewId: string) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(liveappInterface, HostMethodNames.UNSUBSCRIBE_FROM_VIEW_DATA, {tableId, viewId}));
    }

    /*
     * NOTE: the below methods are frontend-only.
     */
    registerHandler(type: HostToBlockMessageType, handlerFn: (data: Object) => void) {
        liveappInterface.registerHandler(type, handlerFn);
    }
    async fetchAndSubscribeToCursorDataAsync(): Promise<any> { // eslint-disable-line flowtype/no-weak-types
        return await liveappInterface.callHostMethodAsync(
            HostMethodNames.FETCH_AND_SUBSCRIBE_TO_CURSOR_DATA,
            {},
        );
    }
    unsubscribeFromCursorData() {
        utils.fireAndForgetPromise(
            liveappInterface.callHostMethodAsync.bind(
                liveappInterface,
                HostMethodNames.UNSUBSCRIBE_FROM_CURSOR_DATA,
                {},
            ),
        );
    }
    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
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
            liveappInterface.callHostMethodAsync.bind(
                liveappInterface,
                HostMethodNames.EXPAND_RECORD_LIST,
                {tableId, recordIds, fieldIds},
            ),
        );
    }
    async expandRecordPickerAsync(tableId: string, recordIds: Array<string>, fieldIds: Array<string> | null, shouldAllowCreatingRecord: boolean): Promise<string | null> {
        const chosenRecordId = await liveappInterface.callHostMethodAsync(
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
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            HostMethodNames.RELOAD_FRAME,
        ));
    }
    setSettingsButtonVisibility(isVisible: boolean) {
        utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
            liveappInterface,
            HostMethodNames.SET_SETTINGS_BUTTON_VISIBILITY,
            {isVisible},
        ));
    }
    setFullscreenMaxSize(maxFullscreenSize: ViewportSizeConstraint) {
        utils.fireAndForgetPromise(
            liveappInterface.callHostMethodAsync.bind(
                liveappInterface,
                HostMethodNames.SET_FULLSCREEN_MAX_SIZE,
                maxFullscreenSize,
            ),
        );
    }
    enterFullscreen() {
        utils.fireAndForgetPromise(
            liveappInterface.callHostMethodAsync.bind(
                liveappInterface,
                HostMethodNames.ENTER_FULLSCREEN,
            ),
        );
    }
    exitFullscreen() {
        utils.fireAndForgetPromise(
            liveappInterface.callHostMethodAsync.bind(
                liveappInterface,
                HostMethodNames.EXIT_FULLSCREEN,
            ),
        );
    }
}

module.exports = AirtableInterfaceFrontend;
