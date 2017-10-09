// @flow
const {h, u, _} = require('client_server_shared/hu_');
const utils = require('client/blocks/sdk/utils');
const AbstractModelWithAsyncData = require('client/blocks/sdk/models/abstract_model_with_async_data');
const GroupedRowVisList = require('client_server_shared/vis_lists/grouped_row_vis_list');
const GroupAssigner = require('client_server_shared/filter_and_sort/group_assigner');
const TableModel = require('client/blocks/sdk/models/table');
const ViewModel = require('client/blocks/sdk/models/view');
const getSdk = require('client/blocks/sdk/get_sdk');
const invariant = require('invariant');

const WatchableRecordListKeys = {
    records: 'records',
    recordIds: 'recordIds',
    cellValues: 'cellValues',
};
const WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';
// The string case is to accomodate cellValuesInField:$FieldId.
type WatchableRecordListKey = $Keys<typeof WatchableRecordListKeys> | string;
type RecordListData = {
    recordIds: Array<string> | null, // null if data isn't loaded (or if it hasn't been lazily initialized).
};

type SortConfig = {field: string, direction?: 'asc' | 'desc'};

import type {GroupLevelObj} from 'client_server_shared/types/view_config/group_level_obj';
import type {WatchableTableKey} from 'client/blocks/sdk/models/table';
import type {WatchableViewKey} from 'client/blocks/sdk/models/view';
import type FieldModel from 'client/blocks/sdk/models/field';
import type RecordModel from 'client/blocks/sdk/models/record';

class RecordList extends AbstractModelWithAsyncData<RecordListData, WatchableRecordListKey> {
    static _className = 'RecordList';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableRecordListKeys, key) ||
            utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix);
    }
    static _shouldLoadDataForKey(key: WatchableRecordListKey): boolean {
        return key === WatchableRecordListKeys.records ||
            key === WatchableRecordListKeys.recordIds ||
            key === WatchableRecordListKeys.cellValues ||
            utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix);
    }
    _sourceModel: TableModel | ViewModel;
    _sourceModelLoadPromises: Array<Promise<*>>;

    // If custom sorts are specified, we'll use a vis list to handle sorting. If no sorts
    // are specified, we'll use the underlying row order of the source model.
    _visList: GroupedRowVisList | null;
    _groupLevels: Array<GroupLevelObj> | null;

    // This is the ordered list of record ids (before any filters are applied).
    _orderedRecordIds: Array<string> | null;

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
    constructor(
        sourceModel: TableModel | ViewModel,
        opts?: {
            sorts?: Array<SortConfig>,
            // TODO(jb): filters
        },
    ) {
        super(sourceModel.__baseData, getSdk().models.generateGuid());

        opts = h.utils.setAndEnforceDefaultOpts({
            sorts: null,
        }, opts);

        this._sourceModel = sourceModel;
        this._sourceModelLoadPromises = [];

        if (opts.sorts) {
            this._groupLevels = opts.sorts.map(sort => {
                const field = this._table.__getFieldMatching(sort.field);
                if (!field) {
                    throw new Error(`No field found for sort: ${sort.field}`);
                }
                if (sort.direction !== undefined && sort.direction !== 'asc' && sort.direction !== 'desc') {
                    throw new Error(`Invalid sort direction: ${sort.direction}`);
                }
                return {
                    columnId: field.id,
                    order: sort.direction === 'desc' ? 'descending' : 'ascending',
                    groupingOptions: {
                        // Always use the raw cell value (rather than normalizing for grouping) so
                        // that group behavior matches sort rather than group by.
                        shouldUseRawCellValue: true,
                    },
                };
            });

            // Tie-break using record created time.
            this._groupLevels.push({
                isCreatedTime: true,
                order: 'ascending',
                groupingOptions: {
                    shouldUseRawCellValue: true,
                },
            });
        } else {
            this._groupLevels = null;
        }

        this._visList = null;
        this._orderedRecordIds = null;

        this._cellValueKeyWatchCounts = {};

        Object.seal(this);
    }
    get _dataOrNullIfDeleted(): RecordListData | null {
        if (this._sourceModel.isDeleted) {
            return null;
        }

        return {
            recordIds: this._orderedRecordIds,
        };
    }
    get recordIds(): Array<string> {
        invariant(this.isDataLoaded, 'RecordList data is not loaded');
        invariant(this._data.recordIds, 'No recordIds');
        return this._data.recordIds;
    }
    get records(): Array<RecordModel> {
        return this.recordIds.map(recordId => {
            const record = this._table.getRecordById(recordId);
            invariant(record, `No record for id: ${recordId}`);
            return record;
        });
    }
    get _cellValuesForSortWatchKeys(): Array<string> {
        return this._groupLevels ? _.compact(this._groupLevels.map(groupLevel => {
            if (groupLevel.isCreatedTime) {
                return null;
            }
            return `cellValuesInField:${groupLevel.columnId}`;
        })) : [];
    }
    get _recordsWatchKey(): WatchableTableKey | WatchableViewKey {
        return this._sourceModel instanceof TableModel ? 'records' : 'visibleRecords';
    }
    get _fieldsWatchKey(): WatchableTableKey {
        return 'fields';
    }
    get _sourceModelRecordIds(): Array<string> {
        return this._sourceModel instanceof TableModel ? this._sourceModel.recordIds : this._sourceModel.visibleRecordIds;
    }
    get _sourceModelRecords(): Array<RecordModel> {
        return this._sourceModel instanceof TableModel ? this._sourceModel.records : this._sourceModel.visibleRecords;
    }
    get _table(): TableModel {
        return this._sourceModel instanceof TableModel ? this._sourceModel : this._sourceModel.parentTable;
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
    watch(keys: WatchableRecordListKey | Array<WatchableRecordListKey>, callback: Function, context?: any): Array<WatchableRecordListKey> { // eslint-disable-line flowtype/no-weak-types
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.watch(keys, callback, context);

        for (const key of validKeys) {
            if (utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix)) {
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesInFieldChanged);
            }

            if (key === WatchableRecordListKeys.cellValues) {
                this._incrementCellValueKeyWatchCountAndWatchIfNecessary(key, this._onCellValuesChanged);
            }
        }

        return validKeys;
    }
    unwatch(keys: WatchableRecordListKey | Array<WatchableRecordListKey>, callback: Function, context?: any): Array<WatchableRecordListKey> { // eslint-disable-line flowtype/no-weak-types
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        const validKeys = super.unwatch(keys, callback, context);

        for (const key of validKeys) {
            if (utils.startsWith(key, WatchableCellValuesInFieldKeyPrefix)) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesInFieldChanged);
            }

            if (key === WatchableRecordListKeys.cellValues) {
                this._decrementCellValueKeyWatchCountAndUnwatchIfPossible(key, this._onCellValuesChanged);
            }
        }

        return validKeys;
    }
    async loadDataAsync() {
        const sourceModelLoadPromise = this._sourceModel.loadDataAsync();
        this._sourceModelLoadPromises.push(sourceModelLoadPromise);

        await super.loadDataAsync();
    }
    async _loadDataAsync(): Promise<Array<WatchableRecordListKey>> {
        invariant(this._sourceModelLoadPromises.length > 0, 'No source model load promises');
        const sourceModelLoadPromise = this._sourceModelLoadPromises.pop();
        await sourceModelLoadPromise;

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

        this._table.watch(
            this._cellValuesForSortWatchKeys,
            this._onCellValuesForSortChanged,
            this,
        );

        this._table.watch(
            this._fieldsWatchKey,
            this._onTableFieldsChanged,
            this,
        );

        if (this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldById(groupLevel.columnId);
                if (field) {
                    field.watch(
                        'config',
                        this._onFieldConfigChanged,
                        this,
                    );
                }
            }
        }

        const changedKeys = [
            WatchableRecordListKeys.records,
            WatchableRecordListKeys.recordIds,
            WatchableRecordListKeys.cellValues,
        ];

        for (const field of this._table.fields) {
            changedKeys.push(WatchableCellValuesInFieldKeyPrefix + field.id);
        }

        return changedKeys;
    }
    unloadData() {
        super.unloadData();
        this._sourceModel.unloadData();
    }
    _unloadData() {
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

        this._table.unwatch(
            this._fieldsWatchKey,
            this._onTableFieldsChanged,
            this,
        );

        // If the table is deleted, can't call getFieldById on it below.
        if (!this._table.isDeleted && this._groupLevels) {
            for (const groupLevel of this._groupLevels) {
                if (groupLevel.isCreatedTime) {
                    continue;
                }
                const field = this._table.getFieldById(groupLevel.columnId);
                if (field) {
                    field.unwatch(
                        'config',
                        this._onFieldConfigChanged,
                        this,
                    );
                }
            }
        }

        this._visList = null;
        this._orderedRecordIds = null;
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
            invariant(record, `No record for id: ${recordId}`);
            const rowJson = record.__getRawRow();
            const groupPath = GroupAssigner.getGroupPathForRow(
                this._table.parentBase.__appBlanket,
                this._getGroupLevelsWithDeletedFieldsFiltered(),
                columnsById,
                rowJson,
            );
            visList.addIdToGroupAtEnd(recordId, true, groupPath);
        }
    }
    _onRecordsChanged(model: TableModel | ViewModel, key: string, updates: ?{addedRecordIds: Array<string>, removedRecordIds: Array<string>}) {
        if (model instanceof ViewModel) {
            // For a view model, we don't get updates sent with the onChange event,
            // so we need to manually generate updates based on the old and new
            // recordIds.
            if (this._orderedRecordIds) {
                const addedRecordIds = _.difference(model.visibleRecordIds, this._orderedRecordIds);
                const removedRecordIds = _.difference(this._orderedRecordIds, model.visibleRecordIds);
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

        // Now that we've applied our changes (if applicable), let's regenerate our recordIds.
        this._orderedRecordIds = this._generateOrderedRecordIds();

        this._onChange(WatchableRecordListKeys.records, updates);
        this._onChange(WatchableRecordListKeys.recordIds, updates);
    }
    _onCellValuesForSortChanged(table: TableModel, key: string, recordIds: ?Array<string>, fieldId: ?string) {
        if (!recordIds || !fieldId) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a records change twice with no data).
            return;
        }

        // NOTE: this will only ever be called if we have sorts, so it's safe to asser that we have
        // a vis list here.
        const visList = this._visList;
        invariant(visList, 'No vis list');

        if (recordIds.length === 0) {
            // Nothing actually changed, so just break out early.
            return;
        }

        // Move the record ids in the vis list.
        visList.removeMultipleIds(recordIds);
        this._addRecordIdsToVisList(recordIds);
        this._orderedRecordIds = this._generateOrderedRecordIds();

        const changeData = {addedRecordIds: [], removedRecordIds: []};
        this._onChange(WatchableRecordListKeys.records, changeData);
        this._onChange(WatchableRecordListKeys.recordIds, changeData);
    }
    _onFieldConfigChanged(field: FieldModel, key: string) {
        // Field config changed for a field we rely on, so we need to replace our vis list.
        // NOTE: this will only ever be called if we have sorts, so it's safe to assume we
        // are using a vis list here.
        this._replaceVisList();
        this._orderedRecordIds = this._generateOrderedRecordIds();
    }
    _onTableFieldsChanged(table: TableModel, key: string, updates: {addedFieldIds: Array<string>, removedFieldIds: Array<string>}) {
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
            if (fieldIdsSet.hasOwnProperty(fieldId)) {
                wereAnyFieldsCreatedOrDeleted = true;
                const field = this._table.getFieldById(fieldId);
                invariant(field, 'Created field does not exist');
                field.watch(
                    'config',
                    this._onFieldConfigChanged,
                    this,
                );
            }
        }

        if (!wereAnyFieldsCreatedOrDeleted) {
            wereAnyFieldsCreatedOrDeleted = u.some(removedFieldIds, fieldId => fieldIdsSet.hasOwnProperty(fieldId));
        }

        if (wereAnyFieldsCreatedOrDeleted) {
            // One of the fields we're relying on was deleted,
            this._replaceVisList();
            this._orderedRecordIds = this._generateOrderedRecordIds();

            // Make sure we fire onChange events since the order may have changed
            // as a result.
            const changeData = {addedRecordIds: [], removedRecordIds: []};
            this._onChange(WatchableRecordListKeys.records, changeData);
            this._onChange(WatchableRecordListKeys.recordIds, changeData);
        }
    }
    _onCellValuesChanged(table: TableModel, key: string, updates: ?Object) {
        if (!updates) {
            // If there are no updates, do nothing, since we'll handle the initial
            // callback when the record set is loaded (and we don't want to fire
            // a cellValues change twice with no data).
            return;
        }
        this._onChange(WatchableRecordListKeys.cellValues, updates);
    }
    _onCellValuesInFieldChanged(table: TableModel, key: string, recordIds: ?Array<string>, fieldId: ?string) {
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
            appBlanket: this._table.parentBase.__appBlanket,
            groupLevels,
            rowsById,
            columnsById,
        });

        const groupKeyComparators = groupAssigner.getGroupKeyComparators();
        const groupPathsByRowId = groupAssigner.getGroupPathsByRowId();
        this._visList = new GroupedRowVisList(groupKeyComparators, rowVisibilityObjArray, groupPathsByRowId);
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
        return `RecordList's underlying ${sourceModelName} has been deleted`;
    }
}

module.exports = RecordList;
