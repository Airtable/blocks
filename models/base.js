// @flow
const u = require('client_server_shared/u');
const utils = require('client/blocks/sdk/utils');
const AbstractModel = require('client/blocks/sdk/models/abstract_model');
const Table = require('client/blocks/sdk/models/table');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const BlockMessageTypes = require('client/blocks/block_message_types');
const permissions = require('client_server_shared/permissions');
const userObjMethods = require('client_server_shared/column_types/helpers/user_obj_methods');
const getSdk = require('client/blocks/sdk/get_sdk');

import type {BaseDataForBlocks, Collaborator} from 'client/blocks/blocks_model_bridge/blocks_model_bridge';
import type {AppBlanket} from 'client_server_shared/types/app_json/app_blanket';
import type {PermissionLevel} from 'client_server_shared/permissions';

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

class Base extends AbstractModel<BaseDataForBlocks, $Keys<typeof WatchableBaseKeys>> {
    static _className = 'Base';
    static _isWatchableKey(key: string): boolean {
        return utils.isEnumValue(WatchableBaseKeys, key);
    }
    _tableModelsById: {[string]: Table};
    constructor(baseData: BaseDataForBlocks) {
        super(baseData, baseData.id);

        this._tableModelsById = {}; // Table instances are lazily created by getTableById.

        liveappInterface.registerHandler(BlockMessageTypes.HostToBlock.UPDATE_MODELS, data => {
            this.__applyChanges(data.changes);
        });

        Object.freeze(this);
    }
    get _dataOrNullIfDeleted(): BaseDataForBlocks | null {
        return this._baseData;
    }
    get name(): string {
        return this._data.name;
    }
    /**
     * This will be `null` if the block is running in a publicly shared base.
     */
    get currentUser(): Collaborator | null {
        const userId = this._data.currentUserId;
        if (!userId) {
            return null;
        } else {
            return this.getCollaboratorById(userId);
        }
    }
    get __rawPermissionLevel(): PermissionLevel {
        return this._data.permissionLevel;
    }
    get permissionLevel(): string {
        return permissions.getPublicApiNameForPermissionLevel(this._data.permissionLevel);
    }
    get activeTable(): Table | null {
        const {activeTableId} = this._data;
        return activeTableId ? this.getTableById(activeTableId) : null;
    }
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
    get collaborators(): Array<Collaborator> {
        const collaborators = [];
        const appBlanket = this.__appBlanket;
        if (appBlanket) {
            const {userInfoById} = appBlanket;
            if (userInfoById) {
                for (const userObj of utils.iterateValues(userInfoById)) {
                    collaborators.push(userObjMethods.formatUserObjForPublicApiV2(userObj));
                }
            }
        }
        return collaborators;
    }
    getCollaboratorById(collaboratorId: string): Collaborator | null {
        const appBlanket = this.__appBlanket;
        if (!appBlanket || !appBlanket.userInfoById) {
            return null;
        }
        const userObj = appBlanket.userInfoById[collaboratorId];
        if (!userObj) {
            return null;
        }
        return userObjMethods.formatUserObjForPublicApiV2(userObj);
    }
    get __appBlanket(): AppBlanket {
        return this._data.appBlanket;
    }
    getTableById(tableId: string): Table | null {
        if (!this._data.tablesById[tableId]) {
            return null;
        } else {
            if (!this._tableModelsById[tableId]) {
                this._tableModelsById[tableId] = new Table(this._data, this, tableId);
            }
            return this._tableModelsById[tableId];
        }
    }
    getTableByName(tableName: string): Table | null {
        for (const [tableData, tableId] of utils.iterate(this._data.tablesById)) {
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
            for (const [tableModel, tableId] of utils.iterate(this._tableModelsById)) {
                if (tableModel.isDeleted) {
                    delete this._tableModelsById[tableId];
                }
            }
        }
        if (dirtyPaths.activeTableId) {
            this._onChange(WatchableBaseKeys.activeTable);
        }
        if (dirtyPaths.tablesById) {
            for (const [dirtyTablePaths, tableId] of utils.iterate(dirtyPaths.tablesById)) {
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
        if (dirtyPaths.cursorData) {
            getSdk().cursor.__triggerOnChangeForDirtyPaths(dirtyPaths.cursorData);
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
