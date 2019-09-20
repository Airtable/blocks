// @flow
import {type BaseData, type AppBlanketData, type ModelChange, type ObjectId} from '../types/base';
import {type CollaboratorData, type UserId} from '../types/collaborator';
import {type TableId} from '../types/table';
import {type AirtableInterface} from '../injected/airtable_interface';
import {isEnumValue, values, entries, isDeepEqual} from '../private_utils';
import {spawnError, invariant} from '../error_utils';
import Table from './table';
import RecordStore from './record_store';
import AbstractModel from './abstract_model';

const {h} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/helpers/app_blanket_user_obj_methods',
);


const WatchableBaseKeys = Object.freeze({
    name: ('name': 'name'),
    tables: ('tables': 'tables'),
    collaborators: ('collaborators': 'collaborators'),
    schema: ('schema': 'schema'),
});

type WatchableBaseKey = $Values<typeof WatchableBaseKeys>;

type ChangedPaths = {_isDirty?: true, [string]: ?ChangedPaths};

/**
 * Model class representing a base.
 *
 * @example
 * import {base} from '@airtable/blocks';
 *
 * console.log('The name of your base is', base.name);
 */
class Base extends AbstractModel<BaseData, WatchableBaseKey> {
    static _className = 'Base';
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableBaseKeys, key);
    }
    _tableModelsById: {[string]: Table};
    _tableRecordStoresByTableId: {[TableId]: RecordStore | void} = {};
    _airtableInterface: AirtableInterface;
    /**
     * @hideconstructor
     */
    constructor(baseData: BaseData, airtableInterface: AirtableInterface) {
        super(baseData, baseData.id);

        this._tableModelsById = {}; 
        this._airtableInterface = airtableInterface;
    }

    /**
     * @function id
     * @memberof Base
     * @instance
     * @returns {string} This base's ID.
     * @example
     * import {base} from '@airtable/blocks';
     * console.log(base.id);
     * // => 'appxxxxxxxxxxxxxx'
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
     * @param {Object?} [context] an optional context for `this` in `callback`.
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
     * @param {Object?} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableBaseKey>} the array of keys that were unwatched
     */

    /**
     * @private
     */
    get _dataOrNullIfDeleted(): BaseData | null {
        return this._baseData;
    }
    /**
     * @function
     * @returns The name of the base.
     * @example
     * import {base} from '@airtable/blocks';
     * console.log('The name of your base is', base.name);
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * @function
     * @returns The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     * @example
     * import {base} from '@airtable/blocks';
     * console.log(`You have ${base.tables.length} tables`);
     */
    get tables(): Array<Table> {
        const tables = [];
        this._data.tableOrder.forEach(tableId => {
            const table = this.getTableByIdIfExists(tableId);
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
     * import {base} from '@airtable/blocks';
     * console.log(base.activeCollaborators[0].email);
     */
    get activeCollaborators(): Array<CollaboratorData> {
        const collaborators = [];
        const appBlanket = this.__appBlanket;
        if (appBlanket) {
            const {userInfoById} = appBlanket;
            if (userInfoById) {
                for (const userObj of values(userInfoById)) {
                    if (
                        appBlanketUserObjMethods.isActive(userObj) &&
                        !h.id.isInviteId(userObj.id)
                    ) {
                        collaborators.push(
                            appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj),
                        );
                    }
                }
            }
        }
        return collaborators;
    }
    /**
     * @param collaboratorId The ID of the user.
     * @returns The user matching the given ID, or `null` if that user does not exist or does not have access to this base.
     */
    getCollaboratorByIdIfExists(collaboratorId: UserId): CollaboratorData | null {
        const appBlanket = this.__appBlanket;
        if (!appBlanket || !appBlanket.userInfoById) {
            return null;
        }
        const userObj = appBlanket.userInfoById[collaboratorId];
        if (!userObj) {
            return null;
        }
        return appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj);
    }
    /**
     * @param collaboratorId The ID of the user.
     * @returns The user matching the given ID. Throws if that user does not exist
     * or does not have access to this base. Use [getCollaboratorByIdIfExists](#getcollaboratorbyidifexists)
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
     * @private
     */
    get __appBlanket(): AppBlanketData {
        return this._data.appBlanket;
    }
    /**
     * @private
     */
    get __sortTiebreakerKey(): ObjectId | null {
        return this._data.sortTiebreakerKey;
    }
    /**
     * @private
     */
    __getRecordStore(tableId: TableId): RecordStore {
        if (this._tableRecordStoresByTableId[tableId]) {
            return this._tableRecordStoresByTableId[tableId];
        }
        invariant(this._data.tablesById[tableId], 'table must exist');
        const newRecordStore = new RecordStore(this._baseData, this._airtableInterface, tableId);
        this._tableRecordStoresByTableId[tableId] = newRecordStore;
        return newRecordStore;
    }
    /**
     * @private
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
     * @returns The table matching the given ID. Throws if that table does not exist in this base. Use [getTableByIdIfExists](#gettablebyidifexists) instead if you are unsure whether a table exists with the given ID.
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
     * @returns The table matching the given name. Throws if no table exists with that name in this base. Use [getTableByNameIfExists](#gettablebynameifexists) instead if you are unsure whether a table exists with the given name.
     */
    getTableByName(tableName: string): Table {
        const table = this.getTableByNameIfExists(tableName);
        if (!table) {
            throw spawnError('No table named %s in base %s', tableName, this.id);
        }
        return table;
    }
    /**
     * @private
     */
    __triggerOnChangeForChangedPaths(changedPaths: ChangedPaths) {
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
                if (table) {
                    const didTableSchemaChange = table.__triggerOnChangeForDirtyPaths(
                        dirtyTablePaths,
                    );
                    if (didTableSchemaChange) {
                        didSchemaChange = true;
                    }
                }
            }
        }
        if (changedPaths.appBlanket) {
            this._onChange(WatchableBaseKeys.collaborators);
            didSchemaChange = true;
        }
        if (didSchemaChange) {
            this._onChange(WatchableBaseKeys.schema);
        }
    }
    /**
     * @private
     */
    __applyChangesWithoutTriggeringEvents(changes: $ReadOnlyArray<ModelChange>): ChangedPaths {
        const changedPaths = {};
        for (const change of changes) {
            this._applyChange(change.path, change.value, changedPaths);
        }
        return changedPaths;
    }
    /**
     * @private
     */
    _applyChange(path: Array<string>, value: mixed, changedPathsByRef: ChangedPaths) {
        let dataSubtree = this._data;
        let dirtySubtree = changedPathsByRef;
        for (let i = 0; i < path.length - 1; i++) {
            const part = path[i];

            if (!dataSubtree[part]) {
                dataSubtree[part] = {};
            }
            dataSubtree = dataSubtree[part];

            if (!dirtySubtree[part]) {
                dirtySubtree[part] = {};
            }
            invariant(dirtySubtree[part], 'dirtySubtree');
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
            invariant(dirtySubtree[lastPathPart], 'dirtySubtree');
            dirtySubtree[lastPathPart]._isDirty = true;
        }
    }
}

export default Base;
