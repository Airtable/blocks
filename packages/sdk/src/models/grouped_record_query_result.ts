/** @module @airtable/blocks/models: RecordQueryResult */ /** */
import {FieldId} from '../types/field';
import Sdk from '../sdk';
import {FlowAnyFunction, FlowAnyObject, ObjectMap} from '../private_utils';
import {invariant} from '../error_utils';
import {RecordId} from '../types/record';
import {GroupData} from '../types/view';
import {NormalizedGroupLevel} from '../types/airtable_interface';
import RecordQueryResult, {
    WatchableRecordQueryResultKey,
    NormalizedRecordQueryResultOpts,
} from './record_query_result';

import Table from './table';
import Field from './field';
import ObjectPool from './object_pool';
import TableOrViewQueryResult from './table_or_view_query_result';

/** @hidden */

interface GroupedRecordQueryResultData {
    groupData: GroupData;
    groupLevels: Array<NormalizedGroupLevel>;
}

/**
 * Represents a group of records returned from a group query. See {@link RecordQueryResult} for main
 * documentation.
 *
 * Do not instantiate. You can get instances of this class by calling
 * `recordQueryResult.groups`.
 *
 * @docsPath models/query results/GroupedRecordQueryResult
 * @hidden
 */
class GroupedRecordQueryResult extends RecordQueryResult<GroupedRecordQueryResultData> {
    /** @internal */
    static _className = 'GroupedRecordQueryResult';

    /** @internal */
    _parentQueryResult: TableOrViewQueryResult | GroupedRecordQueryResult;

    /** @internal */
    _groupData: GroupData;

    /**
     * This includes groupLevel for all children & parent grouped layers, the getter
     * returns only the groupLevels for this layer.
     *
     * @internal
     */
    _groupLevels: Array<NormalizedGroupLevel>;

    /** @internal */
    _orderedChildrenGroups: Array<GroupedRecordQueryResult> | null;

    /** @internal */
    _recordIdsSet: {[key: string]: true | void} | null = null;

    _orderedRecordIds: Array<RecordId> | null = null;

    /** @internal */
    __groupedRecordQueryResultPool: ObjectPool<
        GroupedRecordQueryResult,
        typeof GroupedRecordQueryResult
    >;

    /** @internal */
    constructor(
        parentQueryResult: TableOrViewQueryResult | GroupedRecordQueryResult,
        groupData: GroupData,
        groupLevel: Array<NormalizedGroupLevel>,
        normalizedOpts: NormalizedRecordQueryResultOpts,
        sdk: Sdk,
    ) {
        super(sdk, normalizedOpts);

        this.__groupedRecordQueryResultPool = new ObjectPool(GroupedRecordQueryResult);
        this._parentQueryResult = parentQueryResult;
        this._groupData = groupData;
        this._groupLevels = groupLevel;
        const groupLevelDataSlicedForChildren = this._groupLevels.slice(1);
        this._orderedChildrenGroups = groupData.groups
            ? groupData.groups.map(singleGroupData => {
                  const group = this.__groupedRecordQueryResultPool.getObjectForReuse(
                      this,
                      singleGroupData,
                      groupLevelDataSlicedForChildren,
                      normalizedOpts,
                      sdk,
                  );
                  group.loadDataAsync();
                  return group;
              })
            : null;
    }

    /**
     * Gets children groups of this group (if any exist)
     */
    get groups(): Array<GroupedRecordQueryResult> | null {
        return this._orderedChildrenGroups;
    }

    /** @internal */
    get groupLevel(): NormalizedGroupLevel {
        return this._data.groupLevels[0];
    }

    /**
     * Gets the fieldId that this group is grouped by
     */
    get fieldId(): FieldId {
        return this.groupLevel.fieldId;
    }

    /**
     * Gets the field that this group is grouped by
     */
    get field(): Field {
        return this.parentTable.getFieldById(this.fieldId);
    }



    /**
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * The table that records in this RecordQueryResult are part of
     */
    get parentTable(): Table {
        return this._parentQueryResult.parentTable;
    }

    /**
     * Recursively gets all recordIds in the children groups, keeping recordIds in group order
     *
     * @internal
     */
    _computeRecordIds(): Array<RecordId> {
        if (!this.groups) {
            return this._data.groupData.visibleRecordIds ?? [];
        }

        let recordIds: Array<RecordId> = [];
        for (const group of this.groups) {
            recordIds.push(...group.recordIds);
        }
        return recordIds;
    }

    /**
     * Anytime the recordIds to return could have changed, we clear this so that
     * the next time the user requests recordIds it recomputes
     *
     * @internal
     */
    _invalidateComputedRecordIds(): void {
        this._orderedRecordIds = null;
    }

    /**
     * Ordered array of all the record ids inside this group, in group order.
     * This returns all recordIds of all children groups (in grouped order).
     * Watchable.
     */
    get recordIds(): Array<RecordId> {
        invariant(this.isDataLoaded, 'GroupedRecordQueryResult data is not loaded');

        if (this._orderedRecordIds === null) {
            this._orderedRecordIds = this._computeRecordIds();
        }

        return this._orderedRecordIds;
    }

    /**
     * The fields that were used to create the parent RecordQueryResult that created this GroupedRecordQueryResult.
     * This is separate from the field/fieldId property - which is the field this grouping is based upon.
     * Null if fields were not specified, which means the RecordQueryResult
     * will load all fields in the table.
     */
    get fields(): Array<Field> | null {
        invariant(this.isDataLoaded, 'GroupedRecordQueryResult data is not loaded');
        return this._parentQueryResult.fields;
    }

    /** @inheritdoc */
    watch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        const validKeys = this._parentQueryResult.watch(keys, callback, context);

        return validKeys;
    }

    /** @inheritdoc */
    unwatch(
        keys: WatchableRecordQueryResultKey | ReadonlyArray<WatchableRecordQueryResultKey>,
        callback: FlowAnyFunction,
        context?: FlowAnyObject | null,
    ): Array<WatchableRecordQueryResultKey> {
        return this._parentQueryResult.unwatch(keys, callback, context);
    }

    /** @inheritdoc */
    async loadDataAsync(): Promise<void> {
        await super.loadDataAsync();
    }

    /** @internal */
    _getChangedKeysOnLoad(): Array<WatchableRecordQueryResultKey> {
        return this._parentQueryResult._getChangedKeysOnLoad();
    }

    /** @internal */
    async _loadDataAsync(): Promise<Array<WatchableRecordQueryResultKey>> {
        this._parentQueryResult.__groupedRecordQueryResultPool.registerObjectForReuseStrong(this);

        this.watch(['recordIds', 'groups', 'groupLevels'], this._invalidateComputedRecordIds, this);
        this.watch(['recordIds'], this._invalidateRecordIdsSet, this);

        return this._getChangedKeysOnLoad();
    }

    /** @internal */
    _unloadData() {
        this.unwatch(
            ['recordIds', 'groups', 'groupLevels'],
            this._invalidateComputedRecordIds,
            this,
        );
        this.unwatch(['recordIds'], this._invalidateRecordIdsSet, this);

        this._invalidateComputedRecordIds();
        this._invalidateRecordIdsSet();

        this._unloadChildrenGroupsIfNeeded();
        this._parentQueryResult.__groupedRecordQueryResultPool.unregisterObjectForReuseStrong(this);
    }

    /** @internal */
    get __poolKey() {
        return `${this._serializedOpts}::${this.id}`;
    }

    /**
     * This model doesn't actually load data, but it does use the `_data`
     * property so that checks for model deletion behave appropriately.
     *
     * This is considered deleted if the parent query result has been deleted.
     *
     * We return groupData, instead of precomputing all children groups because
     * we perform the computation+caching lazily on request
     *
     * @internal
     */
    get _dataOrNullIfDeleted(): GroupedRecordQueryResultData | null {
        if (this._parentQueryResult._dataOrNullIfDeleted === null) {
            return null;
        }
        return {
            groupData: this._groupData,
            groupLevels: this._groupLevels,
        };
    }

    /** @inheritdoc */
    get isDataLoaded(): boolean {
        return this._parentQueryResult.isDataLoaded;
    }

    /** @internal */
    _unloadChildrenGroupsIfNeeded() {
        if (this._orderedChildrenGroups) {
            for (const group of this._orderedChildrenGroups) {
                group.unloadData();
            }
        }
    }

    /** @internal */
    _invalidateRecordIdsSet() {
        this._recordIdsSet = null;
    }

    /** @internal */
    _getOrGenerateRecordIdsSet() {
        if (!this._recordIdsSet) {
            const recordIdsSet: ObjectMap<RecordId, true> = {};
            for (const recordId of this.recordIds) {
                recordIdsSet[recordId] = true;
            }
            this._recordIdsSet = recordIdsSet;
        }

        return this._recordIdsSet;
    }
}

export default GroupedRecordQueryResult;
