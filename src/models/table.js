// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const invariant = require('invariant');
const utils = require('../private_utils');
const hyperId = window.__requirePrivateModuleFromAirtable('client_server_shared/hyper_id');
const AbstractModelWithAsyncData = require('./abstract_model_with_async_data');
const View = require('./view');
const Field = require('./field');
const Record = require('./record');
const cellValueUtils = require('./cell_value_utils');
const getSdk = require('../get_sdk');
const PermissionLevels = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_levels',
);
const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const clientServerSharedConfigSettings = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);
const airtableUrls = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/airtable_urls',
);

import type {AirtableInterface, AirtableWriteAction} from '../injected/airtable_interface';
import type {RowId as RecordId} from 'client_server_shared/hyper_id';
import type {
    BaseDataForBlocks,
    TableDataForBlocks,
    RecordDataForBlocks,
} from 'client_server_shared/blocks/block_sdk_init_data';
import type Base from './base';
import type {ViewType} from '../types/view_types';
import type {RecordDef} from './record';
import type {QueryResultOpts} from './query_result';
import type TableOrViewQueryResultType from './table_or_view_query_result';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableTableKeys = {
    name: 'name',
    activeView: 'activeView',
    views: 'views',
    fields: 'fields',
    records: 'records',
    recordIds: 'recordIds',
    // TODO(kasra): these keys don't have matching getters (not that they should
    // it's just inconsistent...)
    cellValues: 'cellValues',
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';
// The string case is to accommodate cellValuesInField:$FieldId.
// It may also be useful to have cellValuesInView:$ViewId...
export type WatchableTableKey = $Keys<typeof WatchableTableKeys> | string;

/** Model class representing a table in the base. */
class Table extends AbstractModelWithAsyncData<TableDataForBlocks, WatchableTableKey> {
    // Once all blocks that current set this flag to true are migrated,
    // remove this flag.
    static shouldLoadAllCellValuesForRecords = false;

    static _className = 'Table';
    static _isWatchableKey(key: string): boolean {
        return (
            utils.isEnumValue(WatchableTableKeys, key) ||
            u.startsWith(key, WatchableCellValuesInFieldKeyPrefix)
        );
    }
    static _shouldLoadDataForKey(key: WatchableTableKey): boolean {
        // "Data" means *all* cell values in the table. If only watching records/recordIds,
        // we'll just load record metadata (id, createdTime, commentCount).
        // If only watching specific fields, we'll just load cell values in those
        // fields. Both of those scenarios are handled manually by this class,
        // instead of relying on AbstractModelWithAsyncData.
        if (Table.shouldLoadAllCellValuesForRecords) {
            return (
                key === WatchableTableKeys.records ||
                key === WatchableTableKeys.recordIds ||
                key === WatchableTableKeys.cellValues
            );
        } else {
            return key === WatchableTableKeys.cellValues;
        }
    }
    _parentBase: Base;
    _viewModelsById: {[string]: View};
    _fieldModelsById: {[string]: Field};
    _recordModelsById: {[string]: Record};
    _cachedFieldNamesById: {[string]: string} | null;
    _primaryFieldId: string;
    _airtableInterface: AirtableInterface;

    // TODO: try making Field models manage their own load state?
    // There is a lot of duplication here and in AbstractModelWithAsyncData.
    // Alternatively, phase out AbstractModelWithAsyncData as a superclass
    // and instead create a helper class for managing each part of the data
    // tree that is loaded.
    _areCellValuesLoadedByFieldId: {[string]: boolean | void};
    _pendingCellValuesLoadPromiseByFieldId: {[string]: Promise<Array<WatchableTableKey>> | void};
    _cellValuesRetainCountByFieldId: {[string]: number | void};

    constructor(
        baseData: BaseDataForBlocks,
        parentBase: Base,
        tableId: string,
        airtableInterface: AirtableInterface,
    ) {
        super(baseData, tableId);

        this._parentBase = parentBase;
        this._viewModelsById = {}; // View instances are lazily created by getViewById.
        this._fieldModelsById = {}; // Field instances are lazily created by getFieldById.
        this._recordModelsById = {}; // Record instances are lazily created by getRecordById.
        this._cachedFieldNamesById = null;

        // A bit of a hack, but we use the primary field ID to load record
        // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
        // ID here instead of calling this.primaryField.id since that would crash
        // when the table is getting unloaded after being deleted.
        this._primaryFieldId = this._data.primaryFieldId;

        this._airtableInterface = airtableInterface;

        this._areCellValuesLoadedByFieldId = {};
        this._pendingCellValuesLoadPromiseByFieldId = {};
        this._cellValuesRetainCountByFieldId = {};

        Object.seal(this);
    }
    watch(
        keys: WatchableTableKey | Array<WatchableTableKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableTableKey> {
        const validKeys = super.watch(keys, callback, context);
        const fieldIdsToLoad = this._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToLoad.length > 0) {
            utils.fireAndForgetPromise(
                this.loadCellValuesInFieldIdsAsync.bind(this, fieldIdsToLoad),
            );
        }
        return validKeys;
    }
    unwatch(
        keys: WatchableTableKey | Array<WatchableTableKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableTableKey> {
        const validKeys = super.unwatch(keys, callback, context);
        const fieldIdsToUnload = this._getFieldIdsToLoadFromWatchableKeys(validKeys);
        if (fieldIdsToUnload.length > 0) {
            this.unloadCellValuesInFieldIds(fieldIdsToUnload);
        }
        return validKeys;
    }
    _getFieldIdsToLoadFromWatchableKeys(keys: Array<WatchableTableKey>): Array<string> {
        const fieldIdsToLoad = [];
        for (const key of keys) {
            if (u.startsWith(key, WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(WatchableCellValuesInFieldKeyPrefix.length);
                fieldIdsToLoad.push(fieldId);
            } else if (!Table.shouldLoadAllCellValuesForRecords) {
                if (key === WatchableTableKeys.records || key === WatchableTableKeys.recordIds) {
                    fieldIdsToLoad.push(this._getFieldIdForCausingRecordMetadataToLoad());
                }
            }
        }
        return fieldIdsToLoad;
    }
    get _dataOrNullIfDeleted(): TableDataForBlocks | null {
        return this._baseData.tablesById[this._id] || null;
    }
    /** */
    get parentBase(): Base {
        return this._parentBase;
    }
    /** The table's name. Can be watched. */
    get name(): string {
        return this._data.name;
    }
    /** */
    get url(): string {
        return airtableUrls.getUrlForTable(this.id, {
            absolute: true,
        });
    }
    /**
     * Every table has exactly one primary field. The primary field of a table
     * will not change.
     */
    get primaryField(): Field {
        const primaryField = this.getFieldById(this._data.primaryFieldId);
        invariant(primaryField, 'no primary field');
        return primaryField;
    }
    /**
     * The fields in this table. The order is arbitrary, since fields are
     * only ordered in the context of a specific view.
     *
     * Can be watched to know when fields are created or deleted.
     */
    get fields(): Array<Field> {
        // TODO(kasra): is it confusing that this returns an array, since the order
        // is arbitrary?
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const fields = [];
        for (const fieldId of u.keys(this._data.fieldsById)) {
            const field = this.getFieldById(fieldId);
            invariant(field, 'no field model' + fieldId);
            fields.push(field);
        }
        return fields;
    }
    /** */
    getFieldById(fieldId: string): Field | null {
        if (!this._data.fieldsById[fieldId]) {
            return null;
        } else {
            if (!this._fieldModelsById[fieldId]) {
                this._fieldModelsById[fieldId] = new Field(this._baseData, this, fieldId);
            }
            return this._fieldModelsById[fieldId];
        }
    }
    /** */
    getFieldByName(fieldName: string): Field | null {
        for (const [fieldId, fieldData] of u.entries(this._data.fieldsById)) {
            if (fieldData.name === fieldName) {
                return this.getFieldById(fieldId);
            }
        }
        return null;
    }
    /**
     * The view model corresponding to the view the user is currently viewing
     * in Airtable. May be `null` if the user is switching between
     * tables or views. Can be watched.
     */
    get activeView(): View | null {
        const {activeViewId} = this._data;
        return activeViewId ? this.getViewById(activeViewId) : null;
    }
    /**
     * The views in the table. Can be watched to know when views are created,
     * deleted, or reordered.
     */
    get views(): Array<View> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const views = [];
        this._data.viewOrder.forEach(viewId => {
            const view = this.getViewById(viewId);
            invariant(view, 'no view matching id in view order');
            views.push(view);
        });
        return views;
    }
    /** */
    getViewById(viewId: string): View | null {
        if (!this._data.viewsById[viewId]) {
            return null;
        } else {
            if (!this._viewModelsById[viewId]) {
                this._viewModelsById[viewId] = new View(
                    this._baseData,
                    this,
                    viewId,
                    this._airtableInterface,
                );
            }
            return this._viewModelsById[viewId];
        }
    }
    /** */
    getViewByName(viewName: string): View | null {
        for (const [viewId, viewData] of u.entries(this._data.viewsById)) {
            if (viewData.name === viewName) {
                return this.getViewById(viewId);
            }
        }
        return null;
    }
    /** */
    select(opts?: QueryResultOpts): TableOrViewQueryResultType {
        // require here to avoid circular import
        const TableOrViewQueryResult = require('./table_or_view_query_result');
        return TableOrViewQueryResult.__createOrReuseQueryResult(this, opts || {});
    }
    /**
     * The records in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */
    get records(): Array<Record> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        const records = Object.keys(recordsById).map(recordId => {
            const record = this.getRecordById(recordId);
            invariant(record, 'record');
            return record;
        });
        return records;
    }
    /**
     * The record IDs in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */
    get recordIds(): Array<string> {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        return Object.keys(recordsById);
    }
    /** Number of records in the table */
    get recordCount(): number {
        return this.recordIds.length;
    }
    /** Maximum number of records that the table can contain */
    get recordLimit(): number {
        return clientServerSharedConfigSettings.MAX_NUM_ROWS_PER_TABLE;
    }
    /** Maximum number of additional records that can be created in the table */
    get remainingRecordLimit(): number {
        return this.recordLimit - this.recordCount;
    }
    /** */
    getRecordById(recordId: string): Record | null {
        const recordsById = this._data.recordsById;
        invariant(recordsById, 'Record metadata is not loaded');
        invariant(typeof recordId === 'string', 'getRecordById expects a string');

        if (!recordsById[recordId]) {
            return null;
        } else {
            if (!this._recordModelsById[recordId]) {
                this._recordModelsById[recordId] = new Record(this._baseData, this, recordId);
            }
            return this._recordModelsById[recordId];
        }
    }
    /** */
    canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {[string]: RecordDef}): boolean {
        // This takes the field and record IDs to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    setCellValues(cellValuesByRecordIdThenFieldIdOrFieldName: {
        [string]: RecordDef,
    }): AirtableWriteAction<void, {}> {
        if (this.isDeleted) {
            throw new Error('Table does not exist');
        }
        if (!this.canSetCellValues(cellValuesByRecordIdThenFieldIdOrFieldName)) {
            throw new Error('Your permission level does not allow editing cell values');
        }

        const changes = [];
        const cellValuesByRecordIdThenFieldId = {};
        for (const [recordId, cellValuesByFieldIdOrFieldName] of u.entries(
            cellValuesByRecordIdThenFieldIdOrFieldName,
        )) {
            const record = this.getRecordById(recordId);
            if (!record) {
                throw new Error('Record does not exist');
            }

            cellValuesByRecordIdThenFieldId[recordId] = {};

            for (const [fieldIdOrFieldName, publicCellValue] of u.entries(
                cellValuesByFieldIdOrFieldName,
            )) {
                const field = this.__getFieldMatching(fieldIdOrFieldName);
                invariant(field, 'Field does not exist');
                invariant(!field.isDeleted, 'Field has been deleted');

                const currentPublicCellValue = record.getCellValue(field);
                const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                    publicCellValue,
                    currentPublicCellValue,
                    field,
                );
                if (!validationResult.isValid) {
                    throw new Error(validationResult.reason);
                }

                const normalizedCellValue = cellValueUtils.normalizePublicCellValueForUpdate(
                    publicCellValue,
                    field,
                );
                changes.push({
                    path: [
                        'tablesById',
                        this.id,
                        'recordsById',
                        recordId,
                        'cellValuesByFieldId',
                        field.id,
                    ],
                    value: normalizedCellValue,
                });

                cellValuesByRecordIdThenFieldId[recordId][field.id] = normalizedCellValue;
            }
        }

        this.parentBase.__applyChanges(changes);

        // Now send the update to Airtable.
        const completionPromise = this._airtableInterface.setCellValuesAsync(
            this.id,
            cellValuesByRecordIdThenFieldId,
        );
        return {
            completion: completionPromise,
        };
    }
    /** */
    canCreateRecord(cellValuesByFieldIdOrFieldName: ?RecordDef): boolean {
        return this.canCreateRecords(
            cellValuesByFieldIdOrFieldName ? [cellValuesByFieldIdOrFieldName] : 1,
        );
    }
    /** */
    createRecord(
        cellValuesByFieldIdOrFieldName: ?RecordDef,
    ): AirtableWriteAction<
        void,
        {
            record: Record,
        },
    > {
        const recordDef = cellValuesByFieldIdOrFieldName || {};
        const writeAction = this.createRecords([recordDef]);
        const records = writeAction.records;
        return {
            completion: writeAction.completion,
            record: records[0],
        };
    }
    /** */
    canCreateRecords(recordDefsOrNumberOfRecords: Array<RecordDef> | number): boolean {
        // This takes the field IDs to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    createRecords(
        recordDefsOrNumberOfRecords: Array<RecordDef> | number,
    ): AirtableWriteAction<
        void,
        {
            records: Array<Record>,
        },
    > {
        if (!this.canCreateRecords(recordDefsOrNumberOfRecords)) {
            throw new Error('Your permission level does not allow creating records');
        }

        // TODO: support creating records when only a record metadata or a
        // subset of fields are loaded.
        if (!this.isDataLoaded) {
            throw new Error('Table data is not loaded');
        }

        let recordDefs;
        if (typeof recordDefsOrNumberOfRecords === 'number') {
            const numEmptyRecordsToCreate = recordDefsOrNumberOfRecords;
            recordDefs = [];
            for (let i = 0; i < numEmptyRecordsToCreate; i++) {
                recordDefs.push({});
            }
        } else {
            recordDefs = recordDefsOrNumberOfRecords;
        }

        if (this.remainingRecordLimit < recordDefs.length) {
            throw new Error(
                'Table over record limit. Check remainingRecordLimit before creating records.',
            );
        }

        const parsedRecordDefs = [];
        const recordIds = [];
        const changes = [];
        for (const recordDef of recordDefs) {
            const cellValuesByFieldId = {};
            for (const [fieldIdOrFieldName, cellValue] of u.entries(recordDef)) {
                const field = this.__getFieldMatching(fieldIdOrFieldName);
                invariant(field, `Field does not exist: ${fieldIdOrFieldName}`);
                invariant(!field.isDeleted, `Field has been deleted: ${fieldIdOrFieldName}`);

                // Current cell value is null since the record doesn't exist.
                const validationResult = cellValueUtils.validatePublicCellValueForUpdate(
                    cellValue,
                    null,
                    field,
                );
                if (!validationResult.isValid) {
                    throw new Error(validationResult.reason);
                }

                cellValuesByFieldId[field.id] = cellValueUtils.normalizePublicCellValueForUpdate(
                    cellValue,
                    field,
                );
            }
            const recordId = hyperId.generateRowId();
            const parsedRecordDef = {
                id: recordId,
                cellValuesByFieldId,
                commentCount: 0,
                createdTime: new Date().toJSON(),
            };
            parsedRecordDefs.push(parsedRecordDef);
            recordIds.push(recordId);

            changes.push({
                path: ['tablesById', this.id, 'recordsById', recordId],
                value: parsedRecordDef,
            });
        }

        for (const view of this.views) {
            if (view.isDataLoaded) {
                changes.push(...view.__generateChangesForParentTableAddMultipleRecords(recordIds));
            }
        }

        this.parentBase.__applyChanges(changes);

        const completionPromise = this._airtableInterface.createRecordsAsync(
            this.id,
            parsedRecordDefs,
        );

        const recordModels = recordIds.map(recordId => {
            const recordModel = this.getRecordById(recordId);
            invariant(recordModel, 'Newly created record does not exist');
            return recordModel;
        });

        return {
            completion: completionPromise,
            records: recordModels,
        };
    }
    /** */
    canDeleteRecord(record: Record) {
        return this.canDeleteRecords([record]);
    }
    /** */
    deleteRecord(record: Record): AirtableWriteAction<void, {}> {
        return this.deleteRecords([record]);
    }
    /** */
    canDeleteRecords(records: Array<Record>) {
        // This takes the records to future-proof against granular permissions.
        // For now, just need at least edit permissions.
        const {base} = getSdk();
        return permissionHelpers.can(base.__rawPermissionLevel, PermissionLevels.EDIT);
    }
    /** */
    deleteRecords(records: Array<Record>): AirtableWriteAction<void, {}> {
        if (!this.canDeleteRecords(records)) {
            throw new Error('Your permission level does not allow deleting records');
        }

        // TODO: support deleting records when only a record metadata or a
        // subset of fields are loaded.
        if (!this.isDataLoaded) {
            throw new Error('Table data is not loaded');
        }

        const recordIds = records.map(record => record.id);

        const changes = recordIds.map(recordId => {
            return {path: ['tablesById', this.id, 'recordsById', recordId], value: undefined};
        });

        for (const view of this.views) {
            if (view.isDataLoaded) {
                changes.push(
                    ...view.__generateChangesForParentTableDeleteMultipleRecords(recordIds),
                );
            }
        }

        this.parentBase.__applyChanges(changes);

        const completionPromise = this._airtableInterface.deleteRecordsAsync(this.id, recordIds);
        return {
            completion: completionPromise,
        };
    }
    /** */
    getFirstViewOfType(allowedViewTypes: Array<ViewType> | ViewType): View | null {
        if (!Array.isArray(allowedViewTypes)) {
            allowedViewTypes = ([allowedViewTypes]: Array<ViewType>);
        }

        return (
            u.find(this.views, view => {
                return u.includes(allowedViewTypes, view.type);
            }) || null
        );
    }
    /**
     * If the activeView's type is in allowedViewTypes, then the activeView
     * is returned. Otherwise, the first view whose type is in allowedViewTypes
     * will be returned. Returns null if no view satisfying allowedViewTypes
     * exists.
     */
    getDefaultViewOfType(allowedViewTypes: Array<ViewType> | ViewType): View | null {
        if (!Array.isArray(allowedViewTypes)) {
            allowedViewTypes = ([allowedViewTypes]: Array<ViewType>);
        }

        const activeView = this.activeView;
        if (activeView && u.includes(allowedViewTypes, activeView.type)) {
            return activeView;
        } else {
            return this.getFirstViewOfType(allowedViewTypes);
        }
    }
    /**
     * Record metadata means record IDs, createdTime, and commentCount are loaded.
     * Record metadata must be loaded before creating, deleting, or updating records.
     */
    get isRecordMetadataLoaded(): boolean {
        return !!this._data.recordsById;
    }
    /**
     * Loads record metadata. Returns a Promise that resolves when record
     * metadata is loaded.
     */
    async loadRecordMetadataAsync() {
        return await this.loadCellValuesInFieldIdsAsync([
            this._getFieldIdForCausingRecordMetadataToLoad(),
        ]);
    }
    /** Unloads record metadata. */
    unloadRecordMetadata() {
        this.unloadCellValuesInFieldIds([this._getFieldIdForCausingRecordMetadataToLoad()]);
    }
    _getFieldIdForCausingRecordMetadataToLoad(): string {
        // As a shortcut, we'll load the primary field cell values to
        // cause record metadata (id, createdTime, commentCount) to be loaded
        // and subscribed to. In the future, we could add an explicit model
        // bridge to fetch and subscribe to row metadata.
        return this._primaryFieldId;
    }
    /** */
    areCellValuesLoadedForFieldId(fieldId: string): boolean {
        return this.isDataLoaded || this._areCellValuesLoadedByFieldId[fieldId] || false;
    }
    /**
     * This is a low-level API. In most cases, using a `QueryResult` obtained by
     * calling `table.select` or `view.select` is preferred.
     */
    async loadCellValuesInFieldIdsAsync(fieldIds: Array<string>) {
        const fieldIdsWhichAreNotAlreadyLoadedOrLoading: Array<string> = [];
        const pendingLoadPromises: Array<Promise<Array<WatchableTableKey>>> = [];
        for (const fieldId of fieldIds) {
            if (this._cellValuesRetainCountByFieldId[fieldId] !== undefined) {
                this._cellValuesRetainCountByFieldId[fieldId]++;
            } else {
                this._cellValuesRetainCountByFieldId[fieldId] = 1;
            }

            // NOTE: we don't use this.areCellValuesLoadedForFieldId() here because
            // that will return true if the cell values are loaded as a result
            // of the entire table being loaded. In that scenario, we still
            // want to separately load the cell values for the field so there
            // is a separate subscription. Otherwise, when the table data unloads,
            // the field data would unload as well. This can be improved by just
            // subscribing to the field data without fetching it, since the cell
            // values are already in the block frame.
            if (!this._areCellValuesLoadedByFieldId[fieldId]) {
                const pendingLoadPromise = this._pendingCellValuesLoadPromiseByFieldId[fieldId];
                if (pendingLoadPromise) {
                    pendingLoadPromises.push(pendingLoadPromise);
                } else {
                    fieldIdsWhichAreNotAlreadyLoadedOrLoading.push(fieldId);
                }
            }
        }
        if (fieldIdsWhichAreNotAlreadyLoadedOrLoading.length > 0) {
            // Could inline _loadCellValuesInFieldIdsAsync, but following the
            // pattern from AbstractModelWithAsyncData where the public method
            // is responsible for updating retain counts and the private method
            // actually fetches data.
            const loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = this._loadCellValuesInFieldIdsAsync(
                fieldIdsWhichAreNotAlreadyLoadedOrLoading,
            );
            pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);
            for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
                this._pendingCellValuesLoadPromiseByFieldId[
                    fieldId
                ] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
            }
            // Doing `.then` instead of performing these actions directly in
            // _loadCellValuesInFieldIdsAsync so this is similar to
            // AbstractModelWithAsyncData. The idea is to refactor to avoid code
            // duplication, so keeping them similar for now hopefully will make the
            // refactor simpler.
            loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise.then(changedKeys => {
                for (const fieldId of fieldIdsWhichAreNotAlreadyLoadedOrLoading) {
                    this._areCellValuesLoadedByFieldId[fieldId] = true;
                    this._pendingCellValuesLoadPromiseByFieldId[fieldId] = undefined;
                }

                for (const key of changedKeys) {
                    this._onChange(key);
                }
            });
        }
        await Promise.all(pendingLoadPromises);
    }
    async _loadCellValuesInFieldIdsAsync(
        fieldIds: Array<string>,
    ): Promise<Array<WatchableTableKey>> {
        const {
            recordsById: newRecordsById,
        } = await this._airtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync(
            this._id,
            fieldIds,
        );

        // Merge with existing data.
        if (!this._data.recordsById) {
            this._data.recordsById = {};
        }
        const {recordsById: existingRecordsById} = this._data;
        u.unsafeEach(
            (newRecordsById: {[RecordId]: RecordDataForBlocks}),
            (newRecordObj, recordId) => {
                if (!u.has(existingRecordsById, recordId)) {
                    existingRecordsById[recordId] = newRecordObj;
                } else {
                    const existingRecordObj = existingRecordsById[recordId];
                    // Metadata (createdTime, commentCount) should already be up to date,
                    // but just verify for sanity. If this doesn't catch anything, can
                    // remove it for perf.
                    invariant(
                        existingRecordObj.commentCount === newRecordObj.commentCount,
                        'comment count out of sync',
                    );
                    invariant(
                        existingRecordObj.createdTime === newRecordObj.createdTime,
                        'created time out of sync',
                    );
                    if (!existingRecordObj.cellValuesByFieldId) {
                        existingRecordObj.cellValuesByFieldId = {};
                    }
                    const existingCellValuesByFieldId = existingRecordObj.cellValuesByFieldId;
                    for (let i = 0; i < fieldIds.length; i++) {
                        const fieldId = fieldIds[i];
                        existingCellValuesByFieldId[fieldId] = newRecordObj.cellValuesByFieldId
                            ? newRecordObj.cellValuesByFieldId[fieldId]
                            : undefined;
                    }
                }
            },
        );

        const changedKeys = fieldIds.map(fieldId => WatchableCellValuesInFieldKeyPrefix + fieldId);
        // Need to trigger onChange for records and recordIds since watching either
        // of those causes record metadata to be loaded (via _getFieldIdForCausingRecordMetadataToLoad)
        // and by convention we trigger a change event when data loads.
        changedKeys.push(WatchableTableKeys.records);
        changedKeys.push(WatchableTableKeys.recordIds);
        // Also trigger cellValues changes since the cell values in the fields
        // are now loaded.
        changedKeys.push(WatchableTableKeys.cellValues);
        return changedKeys;
    }
    /** */
    unloadCellValuesInFieldIds(fieldIds: Array<string>) {
        const fieldIdsWithZeroRetainCount: Array<string> = [];
        for (const fieldId of fieldIds) {
            let fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
            fieldRetainCount--;

            if (fieldRetainCount < 0) {
                console.log('Field data over-released'); // eslint-disable-line no-console
                fieldRetainCount = 0;
            }
            this._cellValuesRetainCountByFieldId[fieldId] = fieldRetainCount;

            if (fieldRetainCount === 0) {
                fieldIdsWithZeroRetainCount.push(fieldId);
            }
        }
        if (fieldIdsWithZeroRetainCount.length > 0) {
            // Don't unload immediately. Wait a while in case something else
            // requests the data, so we can avoid going back to liveapp or
            // the network.
            setTimeout(() => {
                // Make sure the retain count is still zero, since it may
                // have been incremented before the timeout fired.
                const fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
                    return this._cellValuesRetainCountByFieldId[fieldId] === 0;
                });
                if (fieldIdsToUnload.length > 0) {
                    // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
                    // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
                    for (const fieldId of fieldIdsToUnload) {
                        this._areCellValuesLoadedByFieldId[fieldId] = false;
                    }
                    this._unloadCellValuesInFieldIds(fieldIdsToUnload);
                }
            }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
        }
    }
    _unloadCellValuesInFieldIds(fieldIds: Array<string>) {
        this._airtableInterface.unsubscribeFromCellValuesInFields(this._id, fieldIds);
        this._afterUnloadDataOrUnloadCellValuesInFieldIds(fieldIds);
    }
    async _loadDataAsync(): Promise<Array<WatchableTableKey>> {
        const tableData = await this._airtableInterface.fetchAndSubscribeToTableDataAsync(this._id);
        this._data.recordsById = tableData.recordsById;

        const changedKeys = [
            WatchableTableKeys.records,
            WatchableTableKeys.recordIds,
            WatchableTableKeys.cellValues,
        ];

        for (const fieldId of Object.keys(this._data.fieldsById)) {
            changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
    _unloadData() {
        this._airtableInterface.unsubscribeFromTableData(this._id);
        this._afterUnloadDataOrUnloadCellValuesInFieldIds();
    }
    _afterUnloadDataOrUnloadCellValuesInFieldIds(unloadedFieldIds?: Array<string>) {
        const areAnyFieldsLoaded =
            this.isDataLoaded ||
            u.some(u.values(this._areCellValuesLoadedByFieldId), isLoaded => isLoaded);
        if (!this.isDeleted) {
            if (!areAnyFieldsLoaded) {
                this._data.recordsById = undefined;
            } else if (!this.isDataLoaded) {
                let fieldIdsToClear;
                if (unloadedFieldIds) {
                    // Specific fields were unloaded, so clear out the cell values for those fields.
                    fieldIdsToClear = unloadedFieldIds;
                } else {
                    // The entire table was unloaded, but some individual fields are still loaded.
                    // We need to clear out the cell values of every field that was unloaded.
                    // This is kind of slow, but hopefully uncommon.
                    const fieldIds = Object.keys(this._data.fieldsById);
                    fieldIdsToClear = fieldIds.filter(
                        fieldId => !this._areCellValuesLoadedByFieldId[fieldId],
                    );
                }
                u.unsafeEach(this._data.recordsById, recordObj => {
                    for (let i = 0; i < fieldIdsToClear.length; i++) {
                        const fieldId = fieldIdsToClear[i];
                        if (recordObj.cellValuesByFieldId) {
                            recordObj.cellValuesByFieldId[fieldId] = undefined;
                        }
                    }
                });
            }
        }
        if (!areAnyFieldsLoaded) {
            this._recordModelsById = {};
        }
    }
    __getFieldMatching(fieldOrFieldIdOrFieldName: Field | string): Field | null {
        let field: Field | null;
        if (fieldOrFieldIdOrFieldName instanceof Field) {
            field = fieldOrFieldIdOrFieldName;
        } else {
            field =
                this.getFieldById(fieldOrFieldIdOrFieldName) ||
                this.getFieldByName(fieldOrFieldIdOrFieldName);
        }
        return field;
    }
    __getViewMatching(viewOrViewIdOrViewName: View | string): View | null {
        let view: View | null;
        if (viewOrViewIdOrViewName instanceof View) {
            view = viewOrViewIdOrViewName;
        } else {
            view =
                this.getViewById(viewOrViewIdOrViewName) ||
                this.getViewByName(viewOrViewIdOrViewName);
        }
        return view;
    }
    __triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (dirtyPaths.name) {
            this._onChange(WatchableTableKeys.name);
        }
        if (dirtyPaths.activeViewId) {
            this._onChange(WatchableTableKeys.activeView);
        }
        if (dirtyPaths.viewOrder) {
            this._onChange(WatchableTableKeys.views);

            // Clean up deleted views
            for (const [viewId, viewModel] of u.entries(this._viewModelsById)) {
                if (viewModel.isDeleted) {
                    delete this._viewModelsById[viewId];
                }
            }
        }
        if (dirtyPaths.viewsById) {
            for (const [viewId, dirtyViewPaths] of u.entries(dirtyPaths.viewsById)) {
                // Directly access from _viewModelsById to avoid creating
                // a view model if it doesn't already exist. If it doesn't exist,
                // nothing can be subscribed to any events on it.
                const view = this._viewModelsById[viewId];
                if (view) {
                    view.__triggerOnChangeForDirtyPaths(dirtyViewPaths);
                }
            }
        }
        if (dirtyPaths.fieldsById) {
            // Since tables don't have a field order, need to detect if a field
            // was created or deleted and trigger onChange for fields.
            const addedFieldIds = [];
            const removedFieldIds = [];
            for (const [fieldId, dirtyFieldPaths] of u.entries(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths._isDirty) {
                    // If the entire field is dirty, it was either created or deleted.
                    if (u.has(this._data.fieldsById, fieldId)) {
                        addedFieldIds.push(fieldId);
                    } else {
                        removedFieldIds.push(fieldId);

                        const fieldModel = this._fieldModelsById[fieldId];
                        if (fieldModel) {
                            // Remove the Field model if it was deleted.
                            delete this._fieldModelsById[fieldId];
                        }
                    }
                } else {
                    // Directly access from _fieldModelsById to avoid creating
                    // a field model if it doesn't already exist. If it doesn't exist,
                    // nothing can be subscribed to any events on it.
                    const field = this._fieldModelsById[fieldId];
                    if (field) {
                        field.__triggerOnChangeForDirtyPaths(dirtyFieldPaths);
                    }
                }
            }

            if (addedFieldIds.length > 0 || removedFieldIds.length > 0) {
                this._onChange(WatchableTableKeys.fields, {
                    addedFieldIds,
                    removedFieldIds,
                });
            }

            // Clear out cached field names in case a field was added/removed/renamed.
            this._cachedFieldNamesById = null;
        }
        if (this.isRecordMetadataLoaded && dirtyPaths.recordsById) {
            // Since tables don't have a record order, need to detect if a record
            // was created or deleted and trigger onChange for records.
            const dirtyFieldIdsSet = {};
            const addedRecordIds = [];
            const removedRecordIds = [];
            for (const [recordId, dirtyRecordPaths] of u.entries(dirtyPaths.recordsById)) {
                if (dirtyRecordPaths._isDirty) {
                    // If the entire record is dirty, it was either created or deleted.

                    invariant(this._data.recordsById, 'No recordsById');
                    if (u.has(this._data.recordsById, recordId)) {
                        addedRecordIds.push(recordId);
                    } else {
                        removedRecordIds.push(recordId);

                        const recordModel = this._recordModelsById[recordId];
                        if (recordModel) {
                            // Remove the Record model if it was deleted.
                            delete this._recordModelsById[recordId];
                        }
                    }
                } else {
                    const recordModel = this._recordModelsById[recordId];
                    if (recordModel) {
                        recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
                    }
                }

                const {cellValuesByFieldId} = dirtyRecordPaths;
                if (cellValuesByFieldId) {
                    for (const fieldId of u.keys(cellValuesByFieldId)) {
                        dirtyFieldIdsSet[fieldId] = true;
                    }
                }
            }

            // Now that we've composed our created/deleted record ids arrays, let's fire
            // the records onChange event if any records were created or deleted.
            if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
                this._onChange(WatchableTableKeys.records, {
                    addedRecordIds,
                    removedRecordIds,
                });

                this._onChange(WatchableTableKeys.recordIds, {
                    addedRecordIds,
                    removedRecordIds,
                });
            }

            // NOTE: this is an experimental (and somewhat messy) way to watch
            // for changes to cells in a table, as an alternative to implementing
            // full event bubbling. For now, it unblocks the things we want to
            // build, but we may replace it.
            // If we keep it, could be more efficient by not calling _onChange
            // if there are no subscribers.
            // TODO: don't trigger changes for fields that aren't supposed to be loaded
            // (in some cases, e.g. record created, liveapp will send cell values
            // that we're not subscribed to).
            const fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
            const recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));
            if (fieldIds.length > 0 && recordIds.length > 0) {
                this._onChange(WatchableTableKeys.cellValues, {
                    recordIds,
                    fieldIds,
                });
            }
            for (const fieldId of fieldIds) {
                this._onChange(WatchableCellValuesInFieldKeyPrefix + fieldId, recordIds, fieldId);
            }
        }
    }
    __getFieldNamesById(): {[string]: string} {
        if (!this._cachedFieldNamesById) {
            const fieldNamesById = {};
            for (const [fieldId, fieldData] of u.entries(this._data.fieldsById)) {
                fieldNamesById[fieldId] = fieldData.name;
            }
            this._cachedFieldNamesById = fieldNamesById;
        }
        return this._cachedFieldNamesById;
    }
}

module.exports = Table;
