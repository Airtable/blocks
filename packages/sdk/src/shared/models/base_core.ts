import {ModelChange} from '../types/base_core';
import {CollaboratorData} from '../types/collaborator';
import {TableId, UserId} from '../types/hyper_ids';
import {isEnumValue, entries, isDeepEqual, ObjectValues, has, ObjectMap} from '../private_utils';
import {spawnError, invariant} from '../error_utils';
import {SdkMode} from '../../sdk_mode';
import AbstractModel from './abstract_model';


export const WatchableBaseKeys = Object.freeze({
    name: 'name' as const,
    tables: 'tables' as const,
    collaborators: 'collaborators' as const,
    schema: 'schema' as const,
    color: 'color' as const,
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
export type ChangedPathsForType<T> = T extends string | number | boolean | ReadonlyArray<unknown>
    ? {_isDirty?: true}
    : T extends {}
    ? ChangedPathsForObject<T>
    : never;

/** @hidden */
export abstract class BaseCore<SdkModeT extends SdkMode> extends AbstractModel<
    SdkModeT,
    SdkModeT['BaseDataT'],
    WatchableBaseKey
> {
    /** @internal */
    static _className = 'BaseCore';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableBaseKeys, key);
    }
    /** @internal */
    _tableModelsById: {[key: string]: SdkModeT['TableT']};
    /** @internal */
    _tableRecordStoresByTableId: ObjectMap<TableId, SdkModeT['RecordStoreT']> = {};
    /** @internal */
    __billingPlanGrouping: string;
    /** @internal */
    _collaboratorIdsByNameAndEmail: Map<string, string> | null = null;
    /**
     * @internal
     */
    constructor(sdk: SdkModeT['SdkT']) {
        super(sdk, sdk.__airtableInterface.sdkInitData.baseData.id);
        this._tableModelsById = {}; 
        this.__billingPlanGrouping =
            sdk.__airtableInterface.sdkInitData.baseData.billingPlanGrouping;
    }

    /**
     * Aliased to communicate stability for internal use by Sdk code.
     *
     * @internal
     */
    get __sdk(): SdkModeT['SdkT'] {
        return this._sdk;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): SdkModeT['BaseDataT'] | null {
        return this._baseData;
    }
    /**
     * The name of the base.
     *
     * @example
     * ```js
     * import {useBase} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const base = useBase();
     *     console.log('The name of your base is', base.name);
     * }
     * ```
     */
    get name(): string {
        return this._data.name;
    }

    /**
     * The workspace id of the base.
     *
     * @example
     * ```js
     * import {useBase} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const base = useBase();
     *     console.log('The workspace id of your base is', base.workspaceId);
     * }
     * ```
     */
    get workspaceId(): string {
        return this._data.workspaceId;
    }

    /**
     * The color of the base.
     *
     * @example
     * ```js
     * import {colorUtils, useBase} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const base = useBase();
     *     return (
     *         <div style={{backgroundColor: colorUtils.getHexForColor(base.color)}}>
     *             This div's background is the same color as the base background
     *         </div>
     *     );
     * }
     * ```
     */
    get color(): string {
        return this._data.color;
    }

    /**
     * The tables in this base. Can be watched to know when tables are created, deleted, or reordered in the base.
     *
     * @example
     * ```js
     * import {useBase} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const base = useBase();
     *     console.log(`You have ${base.tables.length} tables`);
     * }
     * ```
     */
    get tables(): Array<SdkModeT['TableT']> {
        const tables: Array<SdkModeT['TableT']> = [];
        for (const tableId of this._iterateTableIds()) {
            const table = this.getTableByIdIfExists(tableId);
            if (table) {
                tables.push(table);
            }
        }
        return tables;
    }

    /** @internal */
    abstract _constructTable(tableId: TableId): SdkModeT['TableT'];
    /** @internal */
    abstract _constructRecordStore(
        sdk: SdkModeT['SdkT'],
        tableId: TableId,
    ): SdkModeT['RecordStoreT'];
    /** @internal */
    abstract _iterateTableIds(): Iterable<TableId>;

    /**
     * The users who have access to this base.
     *
     * @example
     * ```js
     * import {useBase} from '@airtable/blocks/[placeholder-path]/ui';
     *
     * function MyApp() {
     *     const base = useBase();
     *     console.log(base.activeCollaborators[0].email);
     * }
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
                "No collaborator with ID %s has access to base '%s'",
                collaboratorId,
                this.name,
            );
        }
        return collaborator;
    }
    /**
     * The user matching the given ID, name, or email address. Returns null if that user does not
     * exist or does not have access to this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getCollaboratorByIdIfExists} method instead.
     *
     * @param collaboratorIdOrNameOrEmail The ID of the user.
     */
    getCollaboratorIfExists(idOrNameOrEmail: UserId | string): CollaboratorData | null {
        const collaboratorById = this.getCollaboratorByIdIfExists(idOrNameOrEmail);
        if (collaboratorById) {
            return collaboratorById;
        }

        if (!this._collaboratorIdsByNameAndEmail) {
            this._collaboratorIdsByNameAndEmail = new Map<string, string>();
            for (const [id, {email, name}] of entries(this._data.collaboratorsById)) {
                this._collaboratorIdsByNameAndEmail.set(email, id);
                if (name && !this._collaboratorIdsByNameAndEmail.has(name)) {
                    this._collaboratorIdsByNameAndEmail.set(name, id);
                }
            }
        }

        const idForNameOrEmail = this._collaboratorIdsByNameAndEmail.get(idOrNameOrEmail);
        if (idForNameOrEmail !== undefined) {
            return this.getCollaboratorById(idForNameOrEmail);
        }

        return null;
    }
    /**
     * The user matching the given ID, name, or email address. Throws if that user does not exist
     * or does not have access to this base. Use {@link getCollaboratorIfExists} instead if you are
     * unsure whether a collaborator with the given ID exists and has access to this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getCollaboratorById} method instead.
     *
     * @param collaboratorIdOrNameOrEmail The ID of the user.
     */
    getCollaborator(idOrNameOrEmail: UserId | string): CollaboratorData | null {
        const collaborator = this.getCollaboratorIfExists(idOrNameOrEmail);
        if (!collaborator) {
            throw spawnError(
                "No collaborator with ID, name, or email of '%s' is in base '%s'",
                idOrNameOrEmail,
                this.name,
            );
        }
        return collaborator;
    }
    /**
     * @internal
     */
    __getBaseData(): SdkModeT['BaseDataT'] {
        return this._data;
    }
    /**
     * The table matching the given ID, or `null` if that table does not exist in this base.
     *
     * @param tableId The ID of the table.
     */
    getTableByIdIfExists(tableId: string): SdkModeT['TableT'] | null {
        if (!this._data.tablesById[tableId]) {
            return null;
        } else {
            if (!this._tableModelsById[tableId]) {
                this._tableModelsById[tableId] = this._constructTable(tableId);
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
    getTableById(tableId: string): SdkModeT['TableT'] {
        const table = this.getTableByIdIfExists(tableId);
        if (!table) {
            throw spawnError("No table with ID %s in base '%s'", tableId, this.name);
        }
        return table;
    }
    /**
     * The table matching the given name, or `null` if no table exists with that name in this base.
     *
     * @param tableName The name of the table you're looking for.
     */
    getTableByNameIfExists(tableName: string): SdkModeT['TableT'] | null {
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
    getTableByName(tableName: string): SdkModeT['TableT'] {
        const table = this.getTableByNameIfExists(tableName);
        if (!table) {
            throw spawnError("No table named '%s' in base '%s'", tableName, this.name);
        }
        return table;
    }
    /**
     * The table matching the given ID or name. Returns `null` if no matching table exists within
     * this base.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getTableByIdIfExists} or
     * {@link getTableByNameIfExists} methods instead.
     *
     * @param tableIdOrName The ID or name of the table you're looking for.
     */
    getTableIfExists(tableIdOrName: TableId | string): SdkModeT['TableT'] | null {
        return (
            this.getTableByIdIfExists(tableIdOrName) ?? this.getTableByNameIfExists(tableIdOrName)
        );
    }
    /**
     * The table matching the given ID or name. Throws if no matching table exists within this base.
     * Use {@link getTableIfExists} instead if you are unsure whether a table exists with the given
     * name/ID.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getTableById} or {@link getTableByName} methods
     * instead.
     *
     * @param tableIdOrName The ID or name of the table you're looking for.
     */
    getTable(tableIdOrName: TableId | string): SdkModeT['TableT'] {
        const table = this.getTableIfExists(tableIdOrName);
        if (!table) {
            throw spawnError(
                "No table with ID or name '%s' in base '%s'",
                tableIdOrName,
                this.name,
            );
        }
        return table;
    }

    /**
     * Returns the maximum number of records allowed in each table of this base.
     */
    getMaxRecordsPerTable(): number {
        return this._data.maxRowsPerTable ?? 100000;
    }

    /**
     * @internal
     */
    __getRecordStore(tableId: TableId): SdkModeT['RecordStoreT'] {
        if (has(this._tableRecordStoresByTableId, tableId)) {
            return this._tableRecordStoresByTableId[tableId];
        }
        invariant(this._data.tablesById[tableId], 'table must exist');
        const newRecordStore = this._constructRecordStore(this._sdk, tableId);
        this._tableRecordStoresByTableId[tableId] = newRecordStore;
        return newRecordStore;
    }

    /**
     * @internal
     */
    __triggerOnChangeForChangedPaths(
        changedPaths: ChangedPathsForType<SdkModeT['BaseDataT']>,
    ): void {
        let didSchemaChange = false;
        if (changedPaths.name) {
            this._onChange(WatchableBaseKeys.name);
            didSchemaChange = true;
        }
        if (changedPaths.color) {
            this._onChange(WatchableBaseKeys.color);
            didSchemaChange = true;
        }
        const {tablesById} = changedPaths;
        if (tablesById) {
            if (isDeepEqual(tablesById, {_isDirty: true})) {
                didSchemaChange = true;
            } else {
                for (const [tableId, dirtyTablePaths] of entries(tablesById)) {
                    const table = this.getTableByIdIfExists(tableId);
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
    ): ChangedPathsForType<SdkModeT['BaseDataT']> {
        const changedPaths = {} as ChangedPathsForType<SdkModeT['BaseDataT']>;
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
        changedPathsByRef: ChangedPathsForType<SdkModeT['BaseDataT']>,
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
