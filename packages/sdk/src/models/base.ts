/** @module @airtable/blocks/models: Base */ /** */
import {BaseData, ModelChange} from '../types/base';
import {CollaboratorData, UserId} from '../types/collaborator';
import {TableId} from '../types/table';
import {AirtableInterface} from '../injected/airtable_interface';
import {
    isEnumValue,
    entries,
    isDeepEqual,
    ObjectValues,
    ObjectMap,
    has,
} from '../private_utils';
import {spawnError, spawnInvariantViolationError} from '../error_utils';
import Table from './table';
import RecordStore from './record_store';
import AbstractModel from './abstract_model';

// How these model classes work:
//
// The single instance of the Base class maintains a reference to a plain JS
// object that contains all the data (baseData). All the other model classes
// receive a reference to baseData and traverse it to expose the data.
//
// As changes come in from liveapp, Base will apply them to the plain JS object.
// Since the other model classes have a reference to the same object, they'll
// always be accessing the most up-to-date values.
//
// Be careful not to return a reference to any non-primitive subtree of baseData,
// since the block developer could mutate it and we'll end up out of sync with
// liveapp.

const WatchableBaseKeys = Object.freeze({
    name: 'name' as const,
    tables: 'tables' as const,
    collaborators: 'collaborators' as const,
    schema: 'schema' as const,
});

type WatchableBaseKey = ObjectValues<typeof WatchableBaseKeys>;

type ChangedPathsForObject<T extends object> = {[K in keyof T]?: ChangedPathsForType<T[K]>} & {
    _isDirty?: true;
};
export type ChangedPathsForType<T> = T extends {} ? ChangedPathsForObject<T> : {_isDirty?: true};

/**
 * Model class representing a base.
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks';
 *
 * console.log('The name of your base is', base.name);
 * ```
 */
class Base extends AbstractModel<BaseData, WatchableBaseKey> {
    /** @internal */
    static _className = 'Base';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableBaseKeys, key);
    }
    /** @internal */
    _tableModelsById: {[key: string]: Table};
    /** @internal */
    _tableRecordStoresByTableId: ObjectMap<TableId, RecordStore> = {};
    /** @internal */
    _airtableInterface: AirtableInterface;
    /**
     * @internal
     */
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, baseData.id);

        this._tableModelsById = {}; // Table instances are lazily created by getTableById.
        this._airtableInterface = airtableInterface;
    }

    /**
     * @function id
     * @memberof Base
     * @instance
     * @returns {string} This base's ID.
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(base.id);
     * // => 'appxxxxxxxxxxxxxx'
     * ```
     */

    /**
     * Get notified of changes to the base.
     *
     * Watchable keys are:
     * - `'name'`
     * - `'tables'`
     * - `'collaborators'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof Base
     * @instance
     * @param {(WatchableBaseKey|Array<WatchableBaseKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {object?} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableBaseKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof Base
     * @instance
     * @param {(WatchableBaseKey|Array<WatchableBaseKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableBaseKey>} the array of keys that were unwatched
     */

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): BaseData | null {
        return this._baseData;
    }
    /**
     * @function
     * @returns The name of the base.
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log('The name of your base is', base.name);
     * ```
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * @function
     * @returns The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(`You have ${base.tables.length} tables`);
     * ```
     */
    get tables(): Array<Table> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const tables: Array<Table> = [];
        this._data.tableOrder.forEach(tableId => {
            const table = this.getTableByIdIfExists(tableId);
            // NOTE: A table's ID may be in tableOrder without the table appearing
            // in tablesById, in which case getTableById will return null. This
            // happens if table was just created by the user, since we
            // wait for the push payload to deliver the table schema.
            if (table) {
                tables.push(table);
            }
        });
        return tables;
    }
    /**
     * @function
     * @returns The users who have access to this base.
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(base.activeCollaborators[0].email);
     * ```
     */
    get activeCollaborators(): Array<CollaboratorData> {
        return this._data.activeCollaboratorIds.map(collaboratorId =>
            this.getCollaboratorById(collaboratorId),
        );
    }
    /**
     * @param collaboratorId The ID of the user.
     * @returns The user matching the given ID, or `null` if that user does not exist or does not have access to this base.
     */
    getCollaboratorByIdIfExists(collaboratorId: UserId): CollaboratorData | null {
        const collaboratorsById = this._data.collaboratorsById;
        return has(collaboratorsById, collaboratorId) ? collaboratorsById[collaboratorId] : null;
    }
    /**
     * @param collaboratorId The ID of the user.
     * @returns The user matching the given ID. Throws if that user does not exist
     * or does not have access to this base. Use {@link getCollaboratorByIdIfExists}
     * instead if you are unsure whether a collaborator with the given ID exists
     * and has access to this base.
     */
    getCollaboratorById(collaboratorId: UserId): CollaboratorData {
        const collaborator = this.getCollaboratorByIdIfExists(collaboratorId);
        if (!collaborator) {
            throw spawnError(
                'No collaborator with ID %s has access to base %s',
                collaboratorId,
                this.id,
            );
        }
        return collaborator;
    }
    /**
     * @internal
     */
    __getRecordStore(tableId: TableId): RecordStore {
        if (has(this._tableRecordStoresByTableId, tableId)) {
            return this._tableRecordStoresByTableId[tableId];
        }
        if (!this._data.tablesById[tableId]) {
            throw spawnInvariantViolationError('table must exist');
        }
        const newRecordStore = new RecordStore(this._baseData, this._airtableInterface, tableId);
        this._tableRecordStoresByTableId[tableId] = newRecordStore;
        return newRecordStore;
    }
    /**
     * @internal
     */
    __getBaseData(): BaseData {
        return this._data;
    }
    /**
     * @param tableId The ID of the table.
     * @returns The table matching the given ID, or `null` if that table does not exist in this base.
     */
    getTableByIdIfExists(tableId: string): Table | null {
        if (!this._data.tablesById[tableId]) {
            return null;
        } else {
            if (!this._tableModelsById[tableId]) {
                this._tableModelsById[tableId] = new Table(
                    this._data,
                    this,
                    this.__getRecordStore(tableId),
                    tableId,
                    this._airtableInterface,
                );
            }
            return this._tableModelsById[tableId];
        }
    }
    /**
     * @param tableId The ID of the table.
     * @returns The table matching the given ID. Throws if that table does not exist in this base. Use {@link getTableByIdIfExists} instead if you are unsure whether a table exists with the given ID.
     */
    getTableById(tableId: string): Table {
        const table = this.getTableByIdIfExists(tableId);
        if (!table) {
            throw spawnError('No table with ID %s in base %s', tableId, this.id);
        }
        return table;
    }
    /**
     * @param tableName The name of the table you're looking for.
     * @returns The table matching the given name, or `null` if no table exists with that name in this base.
     */
    getTableByNameIfExists(tableName: string): Table | null {
        for (const [tableId, tableData] of entries(this._data.tablesById)) {
            if (tableData.name === tableName) {
                return this.getTableByIdIfExists(tableId);
            }
        }
        return null;
    }
    /**
     * @param tableName The name of the table you're looking for.
     * @returns The table matching the given name. Throws if no table exists with that name in this base. Use {@link getTableByNameIfExists} instead if you are unsure whether a table exists with the given name.
     */
    getTableByName(tableName: string): Table {
        const table = this.getTableByNameIfExists(tableName);
        if (!table) {
            throw spawnError('No table named %s in base %s', tableName, this.id);
        }
        return table;
    }
    /**
     * @internal
     */
    __triggerOnChangeForChangedPaths(changedPaths: ChangedPathsForType<BaseData>) {
        let didSchemaChange = false;
        if (changedPaths.name) {
            this._onChange(WatchableBaseKeys.name);
            didSchemaChange = true;
        }
        if (changedPaths.tableOrder) {
            this._onChange(WatchableBaseKeys.tables);
            didSchemaChange = true;

            // Clean up deleted tables
            for (const [tableId, tableModel] of entries(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }
        }
        const {tablesById} = changedPaths;
        if (tablesById) {
            for (const [tableId, dirtyTablePaths] of entries(tablesById)) {
                // Directly access from _tableModelsById to avoid creating
                // a table model if it doesn't already exist. If it doesn't exist,
                // nothing can be subscribed to any events on it.
                const table = this._tableModelsById[tableId];
                if (table && dirtyTablePaths) {
                    const didTableSchemaChange = table.__triggerOnChangeForDirtyPaths(
                        dirtyTablePaths,
                    );
                    if (didTableSchemaChange) {
                        didSchemaChange = true;
                    }
                }
            }
        }
        if (changedPaths.collaboratorsById || changedPaths.activeCollaboratorIds) {
            this._onChange(WatchableBaseKeys.collaborators);
        }
        if (changedPaths.appInterface) {
            didSchemaChange = true;
        }
        if (didSchemaChange) {
            this._onChange(WatchableBaseKeys.schema);
        }
    }
    /**
     * @internal
     */
    __applyChangesWithoutTriggeringEvents(
        changes: ReadonlyArray<ModelChange>,
    ): ChangedPathsForType<BaseData> {
        // Internal method.
        // After applying all changes, changedPaths will have the same shape as
        // the subset of this._data that changed. For example, if some table's
        // name changes, changedPaths will be {tablesById: {tbl123: name: {_isDirty: true}}}.
        // Use it to call __triggerOnChangeForChangedPaths to trigger change events for
        // effected models
        const changedPaths = {};
        for (const change of changes) {
            this._applyChange(change.path, change.value, changedPaths);
        }
        return changedPaths;
    }
    /**
     * @internal
     */
    _applyChange(
        path: Array<string>,
        value: unknown,
        changedPathsByRef: ChangedPathsForType<BaseData>,
    ) {
        let dataSubtree = this._data as any;
        let dirtySubtree = changedPathsByRef as any;
        for (let i = 0; i < path.length - 1; i++) {
            const part = path[i];

            if (!dataSubtree[part]) {
                // Certain fields are stored sparsely (e.g. cellValuesByFieldId),
                // so create an object on demand if needed.
                dataSubtree[part] = {};
            }
            dataSubtree = dataSubtree[part];

            if (!dirtySubtree[part]) {
                dirtySubtree[part] = {};
            }
            if (!dirtySubtree[part]) {
                throw spawnInvariantViolationError('dirtySubtree');
            }
            dirtySubtree = dirtySubtree[part];
        }
        const lastPathPart = path[path.length - 1];
        const didChange = !isDeepEqual(dataSubtree[lastPathPart], value);
        if (value === undefined) {
            delete dataSubtree[lastPathPart];
        } else {
            dataSubtree[lastPathPart] = value;
        }

        if (didChange) {
            if (!dirtySubtree[lastPathPart]) {
                dirtySubtree[lastPathPart] = {};
            }
            if (!dirtySubtree[lastPathPart]) {
                throw spawnInvariantViolationError('dirtySubtree');
            }
            dirtySubtree[lastPathPart]._isDirty = true;
        }
    }
}

export default Base;
