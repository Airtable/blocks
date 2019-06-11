// @flow
import invariant from 'invariant';
import {type BaseData, type AppBlanketData, type ModelChange} from '../types/base';
import {type CollaboratorData, type UserId} from '../types/collaborator';
import {type TableId} from '../types/table';
import {type PermissionLevel} from '../types/permission_levels';
import {type AirtableInterface} from '../injected/airtable_interface';
import {isEnumValue, values, entries} from '../private_utils';
import Table from './table';
import RecordStore from './record_store';
import AbstractModel from './abstract_model';

const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const permissionHelpers = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/permissions/permission_helpers',
);
const appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/helpers/app_blanket_user_obj_methods',
);
const UserScopedAppInterface = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/user_scoped_app_interface',
);
const {PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);

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
    name: ('name': 'name'),
    permissionLevel: ('permissionLevel': 'permissionLevel'),
    tables: ('tables': 'tables'),
    collaborators: ('collaborators': 'collaborators'),
    __schema: ('__schema': '__schema'),
});

type WatchableBaseKey = $Values<typeof WatchableBaseKeys>;

type ChangedPaths = {_isDirty?: true, [string]: ?ChangedPaths};

/**
 * Model class representing a base.
 *
 * @example
 * import {base} from 'airtable-blocks';
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

        this._tableModelsById = {}; // Table instances are lazily created by getTableById.
        this._airtableInterface = airtableInterface;
    }
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
     * import {base} from 'airtable-blocks';
     * console.log('The name of your base is', base.name);
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * @function
     * @returns The current user, or `null` if the block is running in a publicly shared base.
     * @example
     * import {base} from 'airtable-blocks';
     * if (base.currentUser) {
     *     console.log(base.currentUser.id);
     *     console.log(base.currentUser.email);
     *     console.log(base.currentUser.name);
     * }
     */
    get currentUser(): CollaboratorData | null {
        const userId = this._data.currentUserId;
        if (!userId) {
            return null;
        } else {
            return this.getCollaboratorByIdIfExists(userId);
        }
    }
    /**
     * @private
     */
    _isFeatureEnabled(featureName: string): boolean {
        return this._data.enabledFeatureNames.includes(featureName);
    }
    /**
     * @private
     */
    get __rawPermissionLevel(): PermissionLevel {
        return this._data.permissionLevel;
    }
    /**
     * @private
     * The current user's permission level.
     *
     * The value of this should not be consumed and will be deprecated.
     * To know whether a user can perform an action, use the more specific
     * `can` method.
     *
     * Can be watched to know when the user's permission level changes. Usually,
     * you'll want to watch this in your root component and re-render your whole
     * block when the permission level changes.
     *
     * @example
     * if (globalConfig.canSet('foo')) {
     *     globalConfig.set('foo', 'bar');
     * }
     *
     * @example
     * if (record.canSetCellValue('Name', 'Chair')) {
     *     record.setCellValue('Name', 'Chair');
     * }
     */
    get permissionLevel(): string {
        return permissionHelpers.getPublicApiNameForPermissionLevel(this._data.permissionLevel);
    }
    /**
     * @function
     * @returns The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     * @example
     * import {base} from 'airtable-blocks';
     * console.log(`You have ${base.tables.length} tables`);
     */
    get tables(): Array<Table> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const tables = [];
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
     * import {base} from 'airtable-blocks';
     * console.log(base.activeCollaborators[0].email);
     */
    get activeCollaborators(): Array<CollaboratorData> {
        const collaborators = [];
        const appBlanket = this.__appBlanket;
        if (appBlanket) {
            const {userInfoById} = appBlanket;
            // Exclude invites and former collaborators.
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
     * or does not have access to this base. Use {@link getCollaboratorByIdIfExists}
     * instead if you are unsure whether a collaborator with the given ID exists
     * and has access to this base.
     */
    getCollaboratorById(collaboratorId: UserId): CollaboratorData {
        const collaborator = this.getCollaboratorByIdIfExists(collaboratorId);
        if (!collaborator) {
            throw new Error(
                `No collaborator with ID ${collaboratorId} has access to base ${this.id}`,
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
    get __appInterface(): UserScopedAppInterface {
        return new UserScopedAppInterface({
            applicationId: this.id,
            appBlanket: this._data.appBlanket,
            sortTiebreakerKey: this._data.sortTiebreakerKey,
            currentSessionUserId:
                this._data.currentUserId || PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID,
            isFeatureEnabled: featureName => this._isFeatureEnabled(featureName),
        });
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
            throw new Error(`No table with ID ${tableId} in base ${this.id}`);
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
            throw new Error(`No table named ${tableName} in base ${this.id}`);
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
        if (changedPaths.permissionLevel) {
            this._onChange(WatchableBaseKeys.permissionLevel);
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
            this._onChange(WatchableBaseKeys.__schema);
        }
    }
    /**
     * @private
     */
    __applyChangesWithoutTriggeringEvents(changes: Array<ModelChange>): ChangedPaths {
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
     * @private
     */
    _applyChange(path: Array<string>, value: mixed, changedPathsByRef: ChangedPaths) {
        let dataSubtree = this._data;
        let dirtySubtree = changedPathsByRef;
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
            invariant(dirtySubtree[part], 'dirtySubtree');
            dirtySubtree = dirtySubtree[part];
        }
        const lastPathPart = path[path.length - 1];
        const didChange = !u.isEqual(dataSubtree[lastPathPart], value);
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
