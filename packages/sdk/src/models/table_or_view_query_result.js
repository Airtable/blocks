// @flow
import getSdk from '../get_sdk';
import {type FieldId} from '../types/field';
import {has} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import Table, {WatchableTableKeys} from './table';
import View from './view';
import RecordQueryResult, {
    type WatchableRecordQueryResultKey,
    type RecordQueryResultOpts,
    type NormalizedRecordQueryResultOpts,
} from './record_query_result';
import ObjectPool from './object_pool';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';
import type Field from './field';
import type Record from './record';
import RecordStore, {WatchableRecordStoreKeys} from './record_store';
import ViewDataStore, {WatchableViewDataStoreKeys} from './view_data_store';

const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const GroupedRowVisList = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/vis_lists/grouped_row_vis_list',
);
const GroupAssigner = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/filter_and_sort/group_assigner',
);

type GroupLevelOrderType = 'ascending' | 'descending';
type GroupLevelId = string;
type GroupLevelObj =
    | {|
          id: GroupLevelId,
          columnId: FieldId,
          order: GroupLevelOrderType,
          groupingOptions?: Object,
      |}
    | {|
          id: GroupLevelId,
          isCreatedTime: true,
          order: GroupLevelOrderType,
          groupingOptions?: Object,
      |};

type TableOrViewQueryResultData = {
    recordIds: Array<string> | null, 
};

// eslint-disable-next-line no-use-before-define
const tableOrViewQueryResultPool: ObjectPool<
    TableOrViewQueryResult,
    {|
        sourceModel: Table | View,
        normalizedOpts: NormalizedRecordQueryResultOpts,
    |},
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.__sourceModelId,
    getKeyFromObjectOptions: ({sourceModel}) => sourceModel.id,
    canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
        return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
    },
});

/**
 * Represents a set of records directly from a view or table. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.selectRecords` or `view.selectRecords`.
 */
class TableOrViewQueryResult extends RecordQueryResult<TableOrViewQueryResultData> {
    static _className = 'TableOrViewQueryResult';

    static __createOrReuseQueryResult(
        sourceModel: Table | View,
        recordStore: RecordStore,
        opts: RecordQueryResultOpts,
    ) {
        const tableModel = sourceModel instanceof View ? sourceModel.parentTable : sourceModel;
        const normalizedOpts = RecordQueryResult._normalizeOpts(tableModel, opts);
        const queryResult = tableOrViewQueryResultPool.getObjectForReuse({
            sourceModel,
            normalizedOpts,
        });
        if (queryResult) {
            return queryResult;
        } else {
            return new TableOrViewQueryResult(sourceModel, recordStore, opts);
        }
    }
    _sourceModel: Table | View;
    _mostRecentSourceModelLoadPromise: Promise<*> | null;
    _table: Table;

    _fieldIdsSetToLoadOrNullIfAllFields: {[string]: true} | null;

    _visList: GroupedRowVisList | null;
    _groupLevels: Array<GroupLevelObj> | null;

    _orderedRecordIds: Array<string> | null;

    _recordIdsSet: {[string]: true | void} | null = null;

    _cellValueKeyWatchCounts: {[string]: number};
    constructor(sourceModel: Table | View, recordStore: RecordStore, opts?: RecordQueryResultOpts) {
        const table = sourceModel instanceof View ? sourceModel.parentTable : sourceModel;
        invariant(
            table.id === recordStore.tableId,
            'record store must belong to RecordQueryResult table',
        );
        const normalizedOpts = RecordQueryResult._normalizeOpts(table, opts);
        super(recordStore, normalizedOpts, sourceModel.__baseData);

        this._sourceModel = sourceModel;
        this._mostRecentSourceModelLoadPromise = null;
        this._table = table;

        const {sorts} = this._normalizedOpts;
        if (sorts) {
            const groupLevels: Array<GroupLevelObj> = sorts.map(sort => {
                return {
                    id: h.id.generateGroupLevelId(),
                    columnId: sort.fieldId,
                    order: sort.direction === 'desc' ? 'descending' : 'ascending',
                    groupingOptions: {
                        shouldUseRawCellValue: true,
                    },
                };
            });

            groupLevels.push({
                id: h.id.generateGroupLevelId(),
                isCreatedTime: true,
                order: 'ascending',
                groupingOptions: {
                    shouldUseRawCellValue: true,
                },
            });

            this._groupLevels = groupLevels;
        } else {
            this._groupLevels = null;
        }

        this._visList = null;
        this._orderedRecordIds = null;

        this._cellValueKeyWatchCounts = {};

        let fieldIdsSetToLoadOrNullIfAllFields = null;
        if (this._normalizedOpts.fieldIdsOrNullIfAllFields) {
            fieldIdsSetToLoadOrNullIfAllFields = {};
            for (const fieldId of this._normalizedOpts.fieldIdsOrNullIfAllFields) {
                fieldIdsSetToLoadOrNullIfAllFields[fieldId] = true;
            }
            if (this._groupLevels) {
                for (const groupLevel of this._groupLevels) {
                    if (!groupLevel.isCreatedTime) {
                        fieldIdsSetToLoadOrNullIfAllFields[groupLevel.columnId] = true;
                    }
                }
            }

            const recordColorMode = this._normalizedOpts.recordColorMode;
            if (recordColorMode && recordColorMode.type === RecordColorModeTypes.BY_SELECT_FIELD) {
                fieldIdsSetToLoadOrNullIfAllFields[recordColorMode.selectField.id] = true;
            }
        }
        this._fieldIdsSetToLoadOrNullIfAllFields = fieldIdsSetToLoadOrNullIfAllFields;

        tableOrViewQueryResultPool.registerObjectForReuseWeak(this);
        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): TableOrViewQueryResultData | null {
        if (this._sourceModel.isDeleted) {
            return null;
        }

        return {
            recordIds: this._orderedRecordIds,
        };
    }
    get __sourceModelId(): string {
        return this._sourceModel.id;
    }

    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this RecordQueryResult are part of
     */
    get parentTable(): Table {
        return this._table;
    }
    /**
     * @private (since we may not be able to return parent model instances in the immutable models world)
     * The view that was used to obtain this RecordQueryResult by calling
     * `view.selectRecords`. Null if the RecordQueryResult was obtained by calling
     * `table.selectRecords`.
     */
    get parentView(): View | null {
        return this._sourceModel instanceof Table ? null : this._sourceModel;
    }
    /**
     * The record IDs in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * Can be watched.
     */
    get recordIds(): Array<string> {
        invariant(this.isDataLoaded, 'RecordQueryResult data is not loaded');
        invariant(this._data.recordIds, 'No recordIds');
        return this._data.recordIds;
    }
    /**
     * The set of record IDs in this RecordQueryResult.
     * Throws if data is not loaded yet.
     * @private
     */
    _getOrGenerateRecordIdsSet(): {[string]: true | void} {
        if (!this._recordIdsSet) {
            const recordIdsSet = {};
            for (const recordId of this.recordIds) {
                recordIdsSet[recordId] = true;
            }
            this._recordIdsSet = recordIdsSet;
        }

        return this._recordIdsSet;
    }
    /**
     * The fields that were used to create this RecordQueryResult.
     * Null if fields were not specified, which means the RecordQueryResult
     * will load all fields in the table.
     */
    get fields(): Array<Field> | null {
        const {fieldIdsOrNullIfAllFields} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields) {
            const fields = [];
            for (const fieldId of fieldIdsOrNullIfAllFields) {
                const field = this._table.getFieldByIdIfExists(fieldId);
                if (field !== null) {
                    fields.push(field);
                }
            }
            return fields;
        } else {
            return null;
        }
    }
    get _cellValuesForSortWatchKeys(): Array<string> {
        return this._groupLevels
            ? u.compact(
                  this._groupLevels.map(groupLevel => {
                      if (groupLevel.isCreatedTime) {
                          return null;
                      }
                      return `cellValuesInField:${groupLevel.columnId}`;
                  }),
              )
            : [];
    }
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof Table
            ? this._recordStore.recordIds
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecordIds;
    }
    get _sourceModelRecords(): Array<Record> {
        return this._sourceModel instanceof Table
            ? this._recordStore.records
            : this._recordStore.getViewDataStore(this._sourceModel.id).visibleRecords;
    }
    _incrementCellValueKeyWatchCountAndWatchIfNecessary(key: string, watchCallback: Function) {
        if (!this._cellValueKeyWatchCounts[key]) {
            this._cellValueKeyWatchCounts[key] = 0;

            this._recordStore.watch(key, watchCallback, this);
        }

        this._cellValueKeyWatchCounts[key]++;
    }
    _decrementCellValueKeyWatchCountAndUnwatchIfPossible(key: string, watchCallback: Function) {
        if (!this._cellValueKeyWatchCounts[key]) {
            return;
        }

        this._cellValueKeyWatchCounts[key]--;

        if (this._cellValueKeyWatchCounts[key] === 0) {
            this._recordStore.unwatch(key, watchCallback, this);
            delete this._cellValueKeyWatchCounts[key];
        }
    }
    watch(
        keys: WatchableRecordQueryResultKey | Array<WatchableRecordQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableRecordQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.watch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    RecordQueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                if (
                    this._fieldIdsSetToLoadOrNullIfAllFields &&
                    !has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)
                ) {
                    throw spawnError(
                        "Can't watch field because it wasn't included in RecordQueryResult fields: %s",
                        fieldId,
                    );
                }
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            this._onCellValuesChanged,
                        );
                    }
                } else {
                    this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                        key,
                        this._onCellValuesChanged,
                    );
                }
            }
        }

        return validKeys;
    }
    unwatch(
        keys: WatchableRecordQueryResultKey | Array<WatchableRecordQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableRecordQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            if (key.startsWith(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === RecordQueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                            RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
                            this._onCellValuesChanged,
                        );
                    }
                } else {
                    this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                        key,
                        this._onCellValuesChanged,
                    );
                }
            }
        }

        return validKeys;
    }
    async loadDataAsync() {
        let sourceModelLoadPromise;
        let cellValuesInFieldsLoadPromise;

        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
            cellValuesInFieldsLoadPromise = this._recordStore.loadCellValuesInFieldIdsAsync(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        } else {
            cellValuesInFieldsLoadPromise = this._recordStore.loadDataAsync();
        }

        if (this._sourceModel instanceof Table) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                sourceModelLoadPromise = this._recordStore.loadRecordMetadataAsync();
            } else {
                sourceModelLoadPromise = null;
            }
        } else {
            sourceModelLoadPromise = this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .loadDataAsync();
        }

        this._mostRecentSourceModelLoadPromise = Promise.all([
            sourceModelLoadPromise,
            cellValuesInFieldsLoadPromise,
            this._loadRecordColorsAsync(),
        ]);

        await super.loadDataAsync();
    }
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        tableOrViewQueryResultPool.registerObjectForReuseStrong(this);

        invariant(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
        await this._mostRecentSourceModelLoadPromise;

        if (this._groupLevels) {
            this._replaceVisList();
        }
        this._orderedRecordIds = this._generateOrderedRecordIds();

        if (this._sourceModel instanceof Table) {
            this._recordStore.watch(WatchableRecordStoreKeys.records, this._onRecordsChanged, this);
        } else {
            this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .watch(WatchableViewDataStoreKeys.visibleRecords, this._onRecordsChanged, this);
        }

        this._recordStore.watch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.watch(WatchableTableKeys.fields, this._onTableFieldsChanged, this);

        if (this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
                if (field) {
                    field.watch('type', this._onFieldConfigChanged, this);
                    field.watch('options', this._onFieldConfigChanged, this);
                }
            }
        }

        const changedKeys = [
            RecordQueryResult.WatchableKeys.records,
            RecordQueryResult.WatchableKeys.recordIds,
            RecordQueryResult.WatchableKeys.cellValues,
        ];

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this._table.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(RecordQueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
    unloadData() {
        super.unloadData();

        if (this._sourceModel instanceof Table) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                this._recordStore.unloadRecordMetadata();
            } else {
                this._recordStore.unloadData();
            }
        } else {
            this._recordStore.getViewDataStore(this._sourceModel.id).unloadData();
        }

        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
            this._recordStore.unloadCellValuesInFieldIds(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        }

        this._unloadRecordColors();
    }
    _unloadData() {
        this._mostRecentSourceModelLoadPromise = null;

        if (this._sourceModel instanceof Table) {
            this._recordStore.unwatch(
                WatchableRecordStoreKeys.records,
                this._onRecordsChanged,
                this,
            );
        } else {
            this._recordStore
                .getViewDataStore(this._sourceModel.id)
                .unwatch(WatchableViewDataStoreKeys.visibleRecords, this._onRecordsChanged, this);
        }

        this._recordStore.unwatch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.unwatch(WatchableTableKeys.fields, this._onTableFieldsChanged, this);

        if (!this._table.isDeleted && this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
                if (field) {
                    field.unwatch('type', this._onFieldConfigChanged, this);
                    field.unwatch('options', this._onFieldConfigChanged, this);
                }
            }
        }

        this._visList = null;
        this._orderedRecordIds = null;
        this._recordIdsSet = null;

        tableOrViewQueryResultPool.unregisterObjectForReuseStrong(this);
    }
    _getColumnsById(): {[string]: Object} {
        return this._table.fields.reduce((result, field) => {
            result[field.id] = field.__getRawColumn();
            return result;
        }, {});
    }
    _addRecordIdsToVisList(recordIds: Array<string>) {
        const columnsById = this._getColumnsById();
        const visList = this._visList;
        invariant(visList, 'No vis list');
        for (const recordId of recordIds) {
            const record = this._recordStore.getRecordByIdIfExists(recordId);
            invariant(record, 'Record missing in table');
            const rowJson = record.__getRawRow();
            const groupPath = GroupAssigner.getGroupPathForRow(
                getSdk().__appInterface,
                this._getGroupLevelsWithDeletedFieldsFiltered(),
                columnsById,
                rowJson,
            );
            visList.addIdToGroupAtEnd(recordId, true, groupPath);
        }
    }
    _onRecordsChanged(
        model: RecordStore | ViewDataStore,
        key: string,
        updates: ?{addedRecordIds: Array<string>, removedRecordIds: Array<string>},
    ) {
        if (model instanceof ViewDataStore) {
            if (this._orderedRecordIds) {
                const visibleRecordIds = this._recordStore.getViewDataStore(model.viewId)
                    .visibleRecordIds;
                const addedRecordIds = u.difference(visibleRecordIds, this._orderedRecordIds);
                const removedRecordIds = u.difference(this._orderedRecordIds, visibleRecordIds);
                updates = {addedRecordIds, removedRecordIds};
            } else {
                updates = null;
            }
        }

        if (!updates) {
            return;
        }

        const {addedRecordIds, removedRecordIds} = updates;

        if (this._groupLevels) {
            const visList = this._visList;
            invariant(visList, 'No vis list');

            if (removedRecordIds.length > 0) {
                visList.removeMultipleIds(removedRecordIds);
            }

            if (addedRecordIds.length > 0) {
                this._addRecordIdsToVisList(addedRecordIds);
            }
        }

        if (this._recordIdsSet) {
            for (const recordId of addedRecordIds) {
                this._recordIdsSet[recordId] = true;
            }
            for (const recordId of removedRecordIds) {
                this._recordIdsSet[recordId] = undefined;
            }
        }

        this._orderedRecordIds = this._generateOrderedRecordIds();

        this._onChange(RecordQueryResult.WatchableKeys.records, updates);
        this._onChange(RecordQueryResult.WatchableKeys.recordIds, updates);
    }
    _onCellValuesForSortChanged(
        recordStore: RecordStore,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
    ) {
        if (!recordIds || !fieldId) {
            return;
        }

        const visList = this._visList;
        invariant(visList, 'No vis list');

        if (recordIds.length === 0) {
            return;
        }

        const visibleRecordIds = recordIds.filter(recordId => visList.isIdVisible(recordId));
        visList.removeMultipleIds(visibleRecordIds);
        this._addRecordIdsToVisList(visibleRecordIds);
        this._orderedRecordIds = this._generateOrderedRecordIds();

        const changeData = {addedRecordIds: [], removedRecordIds: []};
        this._onChange(RecordQueryResult.WatchableKeys.records, changeData);
        this._onChange(RecordQueryResult.WatchableKeys.recordIds, changeData);
    }
    _onFieldConfigChanged(field: Field, key: string) {
        this._replaceVisList();
        this._orderedRecordIds = this._generateOrderedRecordIds();
    }
    _onTableFieldsChanged(
        table: Table,
        key: string,
        updates: {addedFieldIds: Array<string>, removedFieldIds: Array<string>},
    ) {
        if (!this._groupLevels) {
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = this._groupLevels.reduce((result, groupLevel) => {
            if (!groupLevel.isCreatedTime) {
                result[groupLevel.columnId] = true;
            }
            return result;
        }, {});

        let wereAnyFieldsCreatedOrDeleted = false;
        for (const fieldId of addedFieldIds) {
            if (has(fieldIdsSet, fieldId)) {
                wereAnyFieldsCreatedOrDeleted = true;
                const field = this._table.getFieldByIdIfExists(fieldId);
                invariant(field, 'Created field does not exist');
                field.watch('type', this._onFieldConfigChanged, this);
                field.watch('options', this._onFieldConfigChanged, this);
            }
        }

        if (!wereAnyFieldsCreatedOrDeleted) {
            wereAnyFieldsCreatedOrDeleted = removedFieldIds.some(fieldId =>
                has(fieldIdsSet, fieldId),
            );
        }

        if (wereAnyFieldsCreatedOrDeleted) {
            this._replaceVisList();
            this._orderedRecordIds = this._generateOrderedRecordIds();

            const changeData = {addedRecordIds: [], removedRecordIds: []};
            this._onChange(RecordQueryResult.WatchableKeys.records, changeData);
            this._onChange(RecordQueryResult.WatchableKeys.recordIds, changeData);
        }
    }
    _onCellValuesChanged(table: Table, key: string, updates: ?Object) {
        if (!updates) {
            return;
        }
        this._onChange(RecordQueryResult.WatchableKeys.cellValues, updates);
    }
    _onCellValuesInFieldChanged(
        table: Table,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
    ) {
        if (!recordIds && !fieldId) {
            return;
        }
        this._onChange(key, recordIds, fieldId);
    }
    _generateOrderedRecordIds(): Array<string> {
        if (this._groupLevels) {
            invariant(this._visList, 'Cannot generate record ids without a vis list');
            const recordIds = [];
            this._visList.eachVisibleIdInGroupedOrder(recordId => recordIds.push(recordId));
            return recordIds;
        } else {
            return this._sourceModelRecordIds;
        }
    }
    _replaceVisList() {
        const rowsById = {};
        const rowVisibilityObjArray = [];

        for (const record of this._sourceModelRecords) {
            rowsById[record.id] = record.__getRawRow();
            rowVisibilityObjArray.push({rowId: record.id, visibility: true});
        }

        const columnsById = this._getColumnsById();

        const groupLevels = this._getGroupLevelsWithDeletedFieldsFiltered();

        const groupAssigner = new GroupAssigner({
            appInterface: getSdk().__appInterface,
            groupLevels,
            rowsById,
            columnsById,
        });

        const groupKeyComparators = groupAssigner.getGroupKeyComparators();
        const groupPathsByRowId = groupAssigner.getGroupPathsByRowId();
        this._visList = new GroupedRowVisList(
            groupKeyComparators,
            rowVisibilityObjArray,
            groupPathsByRowId,
        );
    }
    _getGroupLevelsWithDeletedFieldsFiltered(): Array<GroupLevelObj> {
        invariant(this._groupLevels, 'No group levels');

        return this._groupLevels.filter(groupLevel => {
            if (groupLevel.isCreatedTime) {
                return true;
            }
            const field = this._table.getFieldByIdIfExists(groupLevel.columnId);
            return !!field;
        });
    }
    _spawnErrorForDeletion(): Error {
        const sourceModelName = this._sourceModel instanceof Table ? 'table' : 'view';
        return spawnError("RecordQueryResult's underlying %s has been deleted", sourceModelName);
    }
}

export default TableOrViewQueryResult;
