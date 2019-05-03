// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const GroupedRowVisList = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/vis_lists/grouped_row_vis_list',
);
const GroupAssigner = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/filter_and_sort/group_assigner',
);
import TableModel from './table';
import ViewModel from './view';
import invariant from 'invariant';
import QueryResult from './query_result';
import ObjectPool from './object_pool';
import {ModeTypes as RecordColorModeTypes} from './record_coloring';

import type {GroupLevelObj} from 'client_server_shared/types/view_config/group_level_obj';
import type {WatchableTableKey} from './table';
import type {WatchableViewKey} from './view';
import type FieldModel from './field';
import type RecordModel from './record';
import type {
    WatchableQueryResultKey,
    QueryResultOpts,
    NormalizedQueryResultOpts,
} from './query_result';

type TableOrViewQueryResultData = {
    recordIds: Array<string> | null, // null if data isn't loaded (or if it hasn't been lazily initialized).
};

// eslint-disable-next-line no-use-before-define
const tableOrViewQueryResultPool: ObjectPool<
    TableOrViewQueryResult,
    {
        sourceModel: TableModel | ViewModel,
        normalizedOpts: NormalizedQueryResultOpts,
    },
> = new ObjectPool({
    getKeyFromObject: queryResult => queryResult.__sourceModelId,
    getKeyFromObjectOptions: ({sourceModel}) => sourceModel.id,
    canObjectBeReusedForOptions: (queryResult, {normalizedOpts}) => {
        return queryResult.__canBeReusedForNormalizedOpts(normalizedOpts);
    },
});

/**
 * Represents a set of records directly from a view or table.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `table.select` or `view.select`.
 */
class TableOrViewQueryResult extends QueryResult<TableOrViewQueryResultData> {
    static _className = 'TableOrViewQueryResult';

    static __createOrReuseQueryResult(sourceModel: TableModel | ViewModel, opts: QueryResultOpts) {
        const tableModel = sourceModel instanceof ViewModel ? sourceModel.parentTable : sourceModel;
        const normalizedOpts = QueryResult._normalizeOpts(tableModel, opts);
        const queryResult = tableOrViewQueryResultPool.getObjectForReuse({
            sourceModel,
            normalizedOpts,
        });
        if (queryResult) {
            return queryResult;
        } else {
            return new TableOrViewQueryResult(sourceModel, opts);
        }
    }
    _sourceModel: TableModel | ViewModel;
    _mostRecentSourceModelLoadPromise: Promise<*> | null;
    _table: TableModel;

    _fieldIdsSetToLoadOrNullIfAllFields: {[string]: true} | null;

    // If custom sorts are specified, we'll use a vis list to handle sorting. If no sorts
    // are specified, we'll use the underlying row order of the source model.
    _visList: GroupedRowVisList | null;
    _groupLevels: Array<GroupLevelObj> | null;

    // This is the ordered list of record ids (before any filters are applied).
    _orderedRecordIds: Array<string> | null;

    // lazily generated set of record ids
    _recordIdsSet: {[string]: true | void} | null = null;

    // NOTE: when a cellValue key (cellValues or cellValuesInField:) is watched, we want
    // to make sure we watch the associated key on the table. However, we need to make
    // sure that we only watch the table once for each key. Otherwise, the callbacks
    // for each key will get called more than once for each change event. This is because
    // Watchable stores references to callbacks for each key, and on each _onChange event
    // calls each callback for that key. If we watch the table more than once, then we'll
    // call _onChange more than once, and each callback will be called more than once, which
    // is undesirable. Instead, we'll store watch counts for each key to make sure we only
    // watch the table once.
    _cellValueKeyWatchCounts: {[string]: number};
    constructor(sourceModel: TableModel | ViewModel, opts?: QueryResultOpts) {
        const table = sourceModel instanceof ViewModel ? sourceModel.parentTable : sourceModel;
        const normalizedOpts = QueryResult._normalizeOpts(table, opts);
        super(normalizedOpts, sourceModel.__baseData);

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
                        // Always use the raw cell value (rather than normalizing for grouping) so
                        // that group behavior matches sort rather than group by.
                        shouldUseRawCellValue: true,
                    },
                };
            });

            // Tie-break using record created time.
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
            // Need to load data for fields we're sorting by, even if
            // they're not explicitly requested in the `fields` opt.
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
    /** */
    get parentTable(): TableModel {
        return this._table;
    }
    /**
     * The view that was used to obtain this QueryResult by calling
     * `view.select`. Null if the QueryResult was obtained by calling
     * `table.select`.
     */
    get parentView(): ViewModel | null {
        return this._sourceModel instanceof TableModel ? null : this._sourceModel;
    }
    /**
     * The record IDs in this QueryResult.
     * Throws if data is not loaded yet.
     */
    get recordIds(): Array<string> {
        invariant(this.isDataLoaded, 'QueryResult data is not loaded');
        invariant(this._data.recordIds, 'No recordIds');
        return this._data.recordIds;
    }
    /**
     * The set of record IDs in this QueryResult.
     * Throws if data is not loaded yet.
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
     * The fields that were used to create this QueryResult.
     * Null if fields were not specified, which means the QueryResult
     * will load all fields in the table.
     */
    get fields(): Array<FieldModel> | null {
        const {fieldIdsOrNullIfAllFields} = this._normalizedOpts;
        if (fieldIdsOrNullIfAllFields) {
            const fields = [];
            // Filter out any deleted fields, since QueryResult is "live".
            // It would be too cumbersome (and defeat part of the purpose of
            // using QueryResult) if the user had to manually watch for deletion
            // on all the fields and recreate the QueryResult.
            for (const fieldId of fieldIdsOrNullIfAllFields) {
                const field = this._table.getFieldById(fieldId);
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
    get _recordsWatchKey(): WatchableTableKey | WatchableViewKey {
        return this._sourceModel instanceof TableModel ? 'records' : 'visibleRecords';
    }
    get _fieldsWatchKey(): WatchableTableKey {
        return 'fields';
    }
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof TableModel
            ? this._sourceModel.recordIds
            : this._sourceModel.visibleRecordIds;
    }
    get _sourceModelRecords(): Array<RecordModel> {
        return this._sourceModel instanceof TableModel
            ? this._sourceModel.records
            : this._sourceModel.visibleRecords;
    }
    _incrementCellValueKeyWatchCountAndWatchIfNecessary(key: string, watchCallback: Function) {
        if (!this._cellValueKeyWatchCounts[key]) {
            this._cellValueKeyWatchCounts[key] = 0;

            this._table.watch(key, watchCallback, this);
        }

        this._cellValueKeyWatchCounts[key]++;
    }
    _decrementCellValueKeyWatchCountAndUnwatchIfPossible(key: string, watchCallback: Function) {
        if (!this._cellValueKeyWatchCounts[key]) {
            // Key isn't watched, so just skip it. This matches behavior of Watchable,
            // where calling unwatch on a key that isn't watched just no-ops.
            return;
        }

        this._cellValueKeyWatchCounts[key]--;

        if (this._cellValueKeyWatchCounts[key] === 0) {
            // We're down to zero watches for this key, so we can actually unwatch it now.
            this._table.unwatch(key, watchCallback, this);
            delete this._cellValueKeyWatchCounts[key];
        }
    }
    watch(
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.watch(keys, callback, context);

        for (const key of validKeys) {
            if (u.startsWith(key, QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                const fieldId = key.substring(
                    QueryResult.WatchableCellValuesInFieldKeyPrefix.length,
                );
                if (
                    this._fieldIdsSetToLoadOrNullIfAllFields &&
                    !u.has(this._fieldIdsSetToLoadOrNullIfAllFields, fieldId)
                ) {
                    throw new Error(
                        `Can't watch field because it wasn't included in QueryResult fields: ${fieldId}`,
                    );
                }
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === QueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._incrementCellValueKeyWatchCountAndWatchIfNecessary(
                            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
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
        keys: WatchableQueryResultKey | Array<WatchableQueryResultKey>,
        callback: Function,
        context?: ?Object,
    ): Array<WatchableQueryResultKey> {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            if (u.startsWith(key, QueryResult.WatchableCellValuesInFieldKeyPrefix)) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                    key,
                    this._onCellValuesInFieldChanged,
                );
            }

            if (key === QueryResult.WatchableKeys.cellValues) {
                if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                    for (const fieldId of Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields)) {
                        this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(
                            QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId,
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
            cellValuesInFieldsLoadPromise = this._table.loadCellValuesInFieldIdsAsync(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        } else {
            // Load all fields.
            cellValuesInFieldsLoadPromise = this._table.loadDataAsync();
        }

        if (this._sourceModel instanceof TableModel) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                sourceModelLoadPromise = this._table.loadRecordMetadataAsync();
            } else {
                // table.loadDataAsync is a superset of loadRecordMetadataAsync,
                // so no need to load record metadata again.
                sourceModelLoadPromise = null;
            }
        } else {
            sourceModelLoadPromise = this._sourceModel.loadDataAsync();
        }

        this._mostRecentSourceModelLoadPromise = Promise.all([
            sourceModelLoadPromise,
            cellValuesInFieldsLoadPromise,
            this._loadRecordColorsAsync(),
        ]);

        await super.loadDataAsync();
    }
    async _loadDataAsync(): Promise<Array<WatchableQueryResultKey>> {
        tableOrViewQueryResultPool.registerObjectForReuse(this);

        invariant(this._mostRecentSourceModelLoadPromise, 'No source model load promises');
        await this._mostRecentSourceModelLoadPromise;

        if (this._groupLevels) {
            this._replaceVisList();
        }
        this._orderedRecordIds = this._generateOrderedRecordIds();

        this._sourceModel.watch(
            // flow-disable-next-line since we know this watch key is valid.
            this._recordsWatchKey,
            this._onRecordsChanged,
            this,
        );

        this._table.watch(this._cellValuesForSortWatchKeys, this._onCellValuesForSortChanged, this);

        this._table.watch(this._fieldsWatchKey, this._onTableFieldsChanged, this);

        if (this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldById(groupLevel.columnId);
                if (field) {
                    field.watch('config', this._onFieldConfigChanged, this);
                }
            }
        }

        const changedKeys = [
            QueryResult.WatchableKeys.records,
            QueryResult.WatchableKeys.recordIds,
            QueryResult.WatchableKeys.cellValues,
        ];

        const fieldIds =
            this._normalizedOpts.fieldIdsOrNullIfAllFields ||
            this._table.fields.map(field => field.id);

        for (const fieldId of fieldIds) {
            changedKeys.push(QueryResult.WatchableCellValuesInFieldKeyPrefix + fieldId);
        }

        return changedKeys;
    }
    unloadData() {
        super.unloadData();

        if (this._sourceModel instanceof TableModel) {
            if (this._fieldIdsSetToLoadOrNullIfAllFields) {
                this._sourceModel.unloadRecordMetadata();
            } else {
                this._sourceModel.unloadData();
            }
        } else {
            this._sourceModel.unloadData();
        }

        if (this._fieldIdsSetToLoadOrNullIfAllFields) {
            this._table.unloadCellValuesInFieldIds(
                Object.keys(this._fieldIdsSetToLoadOrNullIfAllFields),
            );
        }

        this._unloadRecordColors();
    }
    _unloadData() {
        this._mostRecentSourceModelLoadPromise = null;

        this._sourceModel.unwatch(
            // flow-disable-next-line since we know this watch key is valid.
            this._recordsWatchKey,
            this._onRecordsChanged,
            this,
        );

        this._table.unwatch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.unwatch(this._fieldsWatchKey, this._onTableFieldsChanged, this);

        // If the table is deleted, can't call getFieldById on it below.
        if (!this._table.isDeleted && this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldById(groupLevel.columnId);
                if (field) {
                    field.unwatch('config', this._onFieldConfigChanged, this);
                }
            }
        }

        this._visList = null;
        this._orderedRecordIds = null;
        this._recordIdsSet = null;

        tableOrViewQueryResultPool.unregisterObjectForReuse(this);
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
            const record = this._table.getRecordById(recordId);
            invariant(record, 'Record missing in table');
            const rowJson = record.__getRawRow();
            const groupPath = GroupAssigner.getGroupPathForRow(
                this._table.parentBase.__appInterface,
                this._getGroupLevelsWithDeletedFieldsFiltered(),
                columnsById,
                rowJson,
            );
            visList.addIdToGroupAtEnd(recordId, true, groupPath);
        }
    }
    _onRecordsChanged(
        model: TableModel | ViewModel,
        key: string,
        updates: ?{addedRecordIds: Array<string>, removedRecordIds: Array<string>},
    ) {
        if (model instanceof ViewModel) {
            // For a view model, we don't get updates sent with the onChange event,
            // so we need to manually generate updates based on the old and new
            // recordIds.
            if (this._orderedRecordIds) {
                const addedRecordIds = u.difference(model.visibleRecordIds, this._orderedRecordIds);
                const removedRecordIds = u.difference(
                    this._orderedRecordIds,
                    model.visibleRecordIds,
                );
                updates = {addedRecordIds, removedRecordIds};
            } else {
                updates = null;
            }
        }

        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a records change twice with no data).
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

        // Now that we've applied our changes (if applicable), let's regenerate our recordIds.
        this._orderedRecordIds = this._generateOrderedRecordIds();

        this._onChange(QueryResult.WatchableKeys.records, updates);
        this._onChange(QueryResult.WatchableKeys.recordIds, updates);
    }
    _onCellValuesForSortChanged(
        table: TableModel,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
    ) {
        if (!recordIds || !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a records change twice with no data).
            return;
        }

        // NOTE: this will only ever be called if we have sorts, so it's safe to assert that we have
        // a vis list here.
        const visList = this._visList;
        invariant(visList, 'No vis list');

        if (recordIds.length === 0) {
            // Nothing actually changed, so just break out early.
            return;
        }

        // Move the record ids in the vis list.
        // Note: the cell value changes may have resulted in the records
        // being filtered out. So don't try to remove and re-add them if
        // they're no longer visible.
        const visibleRecordIds = recordIds.filter(recordId => visList.isIdVisible(recordId));
        visList.removeMultipleIds(visibleRecordIds);
        this._addRecordIdsToVisList(visibleRecordIds);
        this._orderedRecordIds = this._generateOrderedRecordIds();

        const changeData = {addedRecordIds: [], removedRecordIds: []};
        this._onChange(QueryResult.WatchableKeys.records, changeData);
        this._onChange(QueryResult.WatchableKeys.recordIds, changeData);
    }
    _onFieldConfigChanged(field: FieldModel, key: string) {
        // Field config changed for a field we rely on, so we need to replace our vis list.
        // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
        // are using a vis list here.
        this._replaceVisList();
        this._orderedRecordIds = this._generateOrderedRecordIds();
    }
    _onTableFieldsChanged(
        table: TableModel,
        key: string,
        updates: {addedFieldIds: Array<string>, removedFieldIds: Array<string>},
    ) {
        if (!this._groupLevels) {
            // If we don't have any sorts, we don't have to do anything in response to field changes.
            return;
        }

        const {addedFieldIds, removedFieldIds} = updates;
        const fieldIdsSet = this._groupLevels.reduce((result, groupLevel) => {
            if (!groupLevel.isCreatedTime) {
                result[groupLevel.columnId] = true;
            }
            return result;
        }, {});

        // Check if any fields that we rely on were created or deleted. If they were,
        // replace our vis list.
        // NOTE: we need to check for created, since a field that we rely on can be
        // deleted and then undeleted.
        let wereAnyFieldsCreatedOrDeleted = false;
        for (const fieldId of addedFieldIds) {
            // If a field that we rely on was created (i.e. it was undeleted), we need to
            // make sure we're watching it's config.
            if (u.has(fieldIdsSet, fieldId)) {
                wereAnyFieldsCreatedOrDeleted = true;
                const field = this._table.getFieldById(fieldId);
                invariant(field, 'Created field does not exist');
                field.watch('config', this._onFieldConfigChanged, this);
            }
        }

        if (!wereAnyFieldsCreatedOrDeleted) {
            wereAnyFieldsCreatedOrDeleted = u.some(removedFieldIds, fieldId =>
                u.has(fieldIdsSet, fieldId),
            );
        }

        if (wereAnyFieldsCreatedOrDeleted) {
            // One of the fields we're relying on was deleted,
            this._replaceVisList();
            this._orderedRecordIds = this._generateOrderedRecordIds();

            // Make sure we fire onChange events since the order may have changed
            // as a result.
            const changeData = {addedRecordIds: [], removedRecordIds: []};
            this._onChange(QueryResult.WatchableKeys.records, changeData);
            this._onChange(QueryResult.WatchableKeys.recordIds, changeData);
        }
    }
    _onCellValuesChanged(table: TableModel, key: string, updates: ?Object) {
        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValues change twice with no data).
            return;
        }
        this._onChange(QueryResult.WatchableKeys.cellValues, updates);
    }
    _onCellValuesInFieldChanged(
        table: TableModel,
        key: string,
        recordIds: ?Array<string>,
        fieldId: ?string,
    ) {
        if (!recordIds && !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValuesInField change twice with no data).
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
            appInterface: this._table.parentBase.__appInterface,
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

        // Filter out any group levels that rely on deleted fields.
        // NOTE: we keep deleted fields around (rather than filtering them out
        // in realtime) in case a field gets undeleted, in which case we want to
        // keep using it.
        return this._groupLevels.filter(groupLevel => {
            if (groupLevel.isCreatedTime) {
                return true;
            }
            const field = this._table.getFieldById(groupLevel.columnId);
            return !!field;
        });
    }
    _getErrorMessageForDeletion(): string {
        const sourceModelName = this._sourceModel instanceof TableModel ? 'table' : 'view';
        return `QueryResult's underlying ${sourceModelName} has been deleted`;
    }
}

export default TableOrViewQueryResult;
