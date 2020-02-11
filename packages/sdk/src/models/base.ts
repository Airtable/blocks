/** @module @airtable/blocks/models: Base */ /** */
import {BaseData, ModelChange} from '../types/base';
import {CollaboratorData, UserId} from '../types/collaborator';
import {TableId} from '../types/table';
import {AirtableInterface} from '../injected/airtable_interface';
import {isEnumValue, entries, isDeepEqual, ObjectValues, ObjectMap, has} from '../private_utils';
import {spawnError, spawnInvariantViolationError} from '../error_utils';
import Table from './table';
import RecordStore from './record_store';
import AbstractModel from './abstract_model';


const WatchableBaseKeys = Object.freeze({
    name: 'name' as const,
    tables: 'tables' as const,
    collaborators: 'collaborators' as const,
    schema: 'schema' as const,
});

/**
 * Any key in base that can be watched:
 * - `name`: the name of the base
 * - `tables`: the order of tables in the base
 * - `collaborators`: all the collaborators in the base
 * - `schema`: the base schema (essentially everything except for record data)
 */
type WatchableBaseKey = ObjectValues<typeof WatchableBaseKeys>;

/** @internal */
type ChangedPathsForObject<T extends object> = {[K in keyof T]?: ChangedPathsForType<T[K]>} & {
    _isDirty?: true;
};
/** @internal */
export type ChangedPathsForType<T> = T extends {} ? ChangedPathsForObject<T> : {_isDirty?: true};

/**
 * Model class representing a base.
 *
 * If you want the base model to automatically recalculate whenever the base schema changes, try the
 * {@link useBase} hook. Alternatively, you can manually subscribe to changes with
 * {@link useWatchable} (recommended) or [Base#watch](/developers/blocks/api/models/Base#watch).
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks';
 *
 * console.log('The name of your base is', base.name);
 * ```
 * @docsPath models/Base
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

        this._tableModelsById = {}; 
        this._airtableInterface = airtableInterface;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): BaseData | null {
        return this._baseData;
    }
    /**
     * The name of the base.
     *
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
     * The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     *
     * @example
     * ```js
     * import {base} from '@airtable/blocks';
     * console.log(`You have ${base.tables.length} tables`);
     * ```
     */
    get tables(): Array<Table> {
        const tables: Array<Table> = [];
        this._data.tableOrder.forEach(tableId => {
            const table = this.getTableByIdIfExists(tableId);
            if (table) {
                tables.push(table);
            }
        });
        return tables;
    }
    /**
     * The users who have access to this base.
     *
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
     * The user matching the given ID, or `null` if that user does not exist or does not have access
     * to this base.
     *
     * @param collaboratorId The ID of the user.
     */
    getCollaboratorByIdIfExists(collaboratorId: UserId): CollaboratorData | null {
        const collaboratorsById = this._data.collaboratorsById;
        return has(collaboratorsById, collaboratorId) ? collaboratorsById[collaboratorId] : null;
    }
    /**
     * The user matching the given ID. Throws if that user does not exist
     * or does not have access to this base. Use {@link getCollaboratorByIdIfExists}
     * instead if you are unsure whether a collaborator with the given ID exists
     * and has access to this base.
     *
     * @param collaboratorId The ID of the user.
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
     * The table matching the given ID, or `null` if that table does not exist in this base.
     *
     * @param tableId The ID of the table.
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
     * The table matching the given ID. Throws if that table does not exist in this base. Use
     * {@link getTableByIdIfExists} instead if you are unsure whether a table exists with the given
     * ID.
     *
     * @param tableId The ID of the table.
     */
    getTableById(tableId: string): Table {
        const table = this.getTableByIdIfExists(tableId);
        if (!table) {
            throw spawnError('No table with ID %s in base %s', tableId, this.id);
        }
        return table;
    }
    /**
     * The table matching the given name, or `null` if no table exists with that name in this base.
     *
     * @param tableName The name of the table you're looking for.
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
     * The table matching the given name. Throws if no table exists with that name in this base. Use
     * {@link getTableByNameIfExists} instead if you are unsure whether a table exists with the
     * given name.
     *
     * @param tableName The name of the table you're looking for.
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

            for (const [tableId, tableModel] of entries(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }
        }
        const {tablesById} = changedPaths;
        if (tablesById) {
            for (const [tableId, dirtyTablePaths] of entries(tablesById)) {
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
