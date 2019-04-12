// @flow
const {h, u} = require('client_server_shared/hu');
const utils = require('block_sdk/shared/private_utils');
const AbstractModel = require('block_sdk/shared/models/abstract_model');
const Table = require('block_sdk/shared/models/table');
const permissionHelpers = require('client_server_shared/permissions/permission_helpers');
const appBlanketUserObjMethods = require('client_server_shared/column_types/helpers/app_blanket_user_obj_methods');
const getSdk = require('block_sdk/shared/get_sdk');
const UserScopedAppInterface = require('client_server_shared/user_scoped_app_interface');
const {PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID} = require('client_server_shared/client_server_shared_config_settings');
const invariant = require('invariant');

import type {AbstractAirtableInterface} from 'block_sdk/shared/abstract_airtable_interface';
import type {BaseDataForBlocks, Collaborator} from 'client_server_shared/blocks/block_sdk_init_data';
import type {AppBlanket} from 'client_server_shared/types/app_json/app_blanket';
import type {PermissionLevel} from 'client_server_shared/permissions/permission_levels';
import type FrontendBlockSdk from 'block_sdk/frontend/sdk';

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

const WatchableBaseKeys = {
    name: 'name',
    permissionLevel: 'permissionLevel',
    tables: 'tables',
    activeTable: 'activeTable',
    collaborators: 'collaborators',
};

/**
 * Model class representing a base.
 *
 * @example
 * import {base} from 'airtable-blocks';
 */
class Base extends AbstractModel<BaseDataForBlocks, $Keys<typeof WatchableBaseKeys>> {
    static _className = 'Base';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableBaseKeys, key);
    }
    _tableModelsById: {[string]: Table};
    _airtableInterface: AbstractAirtableInterface;
    constructor(baseData: BaseDataForBlocks, airtableInterface: AbstractAirtableInterface) {
        super(baseData, baseData.id);

        this._tableModelsById = {}; // Table instances are lazily created by getTableById.
        this._airtableInterface = airtableInterface;
    }
    get _dataOrNullIfDeleted(): BaseDataForBlocks | null {
        return this._baseData;
    }
    /** The name of the base. */
    get name(): string {
        return this._data.name;
    }
    /**
     * The current user, or `null` if the block is running in a publicly shared base.
     */
    get currentUser(): Collaborator | null {
        const userId = this._data.currentUserId;
        if (!userId) {
            return null;
        } else {
            return this.getCollaboratorById(userId);
        }
    }
    _isFeatureEnabled(featureName: string): boolean {
        return u.includes(this._data.enabledFeatureNames, featureName);
    }
    get __rawPermissionLevel(): PermissionLevel {
        return this._data.permissionLevel;
    }
    /**
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
     * The table model corresponding to the table the user is currently
     * viewing in Airtable. May be `null` if the user is switching between
     * tables. Can be watched.
     */
    get activeTable(): Table | null {
        const {activeTableId} = this._data;
        return activeTableId ? this.getTableById(activeTableId) : null;
    }
    /**
     * The tables in this base. Can be watched to know when tables are created,
     * deleted, or reordered in the base.
     */
    get tables(): Array<Table> {
        // TODO(kasra): cache and freeze this so it isn't O(n)
        const tables = [];
        this._data.tableOrder.forEach(tableId => {
            const table = this.getTableById(tableId);
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
     * The users who have access to this base.
     */
    get activeCollaborators(): Array<Collaborator> {
        const collaborators = [];
        const appBlanket = this.__appBlanket;
        if (appBlanket) {
            const {userInfoById} = appBlanket;
            // Exclude invites and former collaborators.
            if (userInfoById) {
                for (const userObj of u.values(userInfoById)) {
                    if (appBlanketUserObjMethods.isActive(userObj) && !h.id.isInviteId(userObj.id)) {
                        collaborators.push(appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj));
                    }
                }
            }
        }
        return collaborators;
    }
    /**
     * Returns the user matching the given ID, or `null` if that
     * user does not exist or does not have access to this base.
     */
    getCollaboratorById(collaboratorId: string): Collaborator | null {
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
    get __appBlanket(): AppBlanket {
        return this._data.appBlanket;
    }
    get __appInterface(): UserScopedAppInterface {
        return new UserScopedAppInterface({
            applicationId: this.id,
            appBlanket: this._data.appBlanket,
            sortTiebreakerKey: this._data.sortTiebreakerKey,
            currentSessionUserId: this._data.currentUserId || PUBLIC_READ_ONLY_SHARE_OR_PRINT_USER_ID,
            isFeatureEnabled: featureName => this._isFeatureEnabled(featureName),
        });
    }
    /**
     * Returns the table matching the given ID, or `null` if that
     * table does not exist in this base.
     */
    getTableById(tableId: string): Table | null {
        if (!this._data.tablesById[tableId]) {
            return null;
        } else {
            if (!this._tableModelsById[tableId]) {
                this._tableModelsById[tableId] = new Table(this._data, this, tableId, this._airtableInterface);
            }
            return this._tableModelsById[tableId];
        }
    }
    /**
     * Returns the table matching the given name, or `null` if no table
     * exists with that name in this base.
     */
    getTableByName(tableName: string): Table | null {
        for (const [tableId, tableData] of u.entries(this._data.tablesById)) {
            if (tableData.name === tableName) {
                return this.getTableById(tableId);
            }
        }
        return null;
    }
    _triggerOnChangeForDirtyPaths(dirtyPaths: Object) {
        if (dirtyPaths.name) {
            this._onChange(WatchableBaseKeys.name);
        }
        if (dirtyPaths.permissionLevel) {
            this._onChange(WatchableBaseKeys.permissionLevel);
        }
        if (dirtyPaths.tableOrder) {
            this._onChange(WatchableBaseKeys.tables);

            // Clean up deleted tables
            for (const [tableId, tableModel] of u.entries(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }
        }
        if (dirtyPaths.activeTableId) {
            this._onChange(WatchableBaseKeys.activeTable);
        }
        if (dirtyPaths.tablesById) {
            for (const [tableId, dirtyTablePaths] of u.entries(dirtyPaths.tablesById)) {
                // Directly access from _tableModelsById to avoid creating
                // a table model if it doesn't already exist. If it doesn't exist,
                // nothing can be subscribed to any events on it.
                const table = this._tableModelsById[tableId];
                if (table) {
                    table.__triggerOnChangeForDirtyPaths(dirtyTablePaths);
                }
            }
        }
        if (dirtyPaths.appBlanket) {
            this._onChange(WatchableBaseKeys.collaborators);
        }

        // HACK: it's an anti-pattern that the Base model manages cursorData at all,
        // since the Base model is shared, but Cursor exists only on the frontend.
        // TODO: change how cursor data is handled and remove this.
        if (dirtyPaths.cursorData) {
            invariant(typeof window !== 'undefined', 'Should only update cursor data in frontend SDK');
            const sdk = ((getSdk(): any): FrontendBlockSdk); // eslint-disable-line flowtype/no-weak-types
            sdk.cursor.__triggerOnChangeForDirtyPaths(dirtyPaths.cursorData);
        }
    }
    __applyChanges(changes: Array<{path: Array<string>, value: mixed}>) { // Internal method.
        // After applying all changes, dirtyPaths will have the same shape as
        // the subset of this._data that changed. For example, if some table's
        // name changes, dirtyPaths will be {tablesById: {tbl123: name: {_isDirty: true}}}.
        // It is used to trigger change events for affected models.
        const dirtyPaths = {};
        for (const change of changes) {
            this._applyChange(change.path, change.value, dirtyPaths);
        }
        this._triggerOnChangeForDirtyPaths(dirtyPaths);
    }
    _applyChange(path: Array<string>, value: mixed, dirtyPathsByRef: Object) {
        let dataSubtree = this._data;
        let dirtySubtree = dirtyPathsByRef;
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
            dirtySubtree[lastPathPart]._isDirty = true;
        }
    }
}

module.exports = Base;
