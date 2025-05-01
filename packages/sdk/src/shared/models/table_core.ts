import {FieldId} from '../types/hyper_ids';
import {isEnumValue, entries, has, ObjectValues, ObjectMap} from '../private_utils';
import {spawnError} from '../error_utils';
import {SdkMode} from '../../sdk_mode';
import AbstractModel from './abstract_model';
import {ChangedPathsForType} from './base_core';
import {FieldCore} from './field_core';

export const WatchableTableKeysCore = Object.freeze({
    name: 'name' as const,
    description: 'description' as const,
    fields: 'fields' as const,
});

/** @hidden */
type WatchableTableKeyCore = ObjectValues<typeof WatchableTableKeysCore>;

/** @hidden */
export abstract class TableCore<
    SdkModeT extends SdkMode,
    WatchableKeys extends string = WatchableTableKeyCore
> extends AbstractModel<SdkModeT, SdkModeT['TableDataT'], WatchableTableKeyCore | WatchableKeys> {
    /** @internal */
    static _className = 'TableCore';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableTableKeysCore, key);
    }
    /** @internal */
    _parentBase: SdkModeT['BaseT'];
    /** @internal */
    _recordStore: SdkModeT['RecordStoreT'];
    /** @internal */
    _fieldModelsById: {[key: string]: SdkModeT['FieldT']};
    /** @internal */
    _cachedFieldNamesById: {[key: string]: string} | null;

    /**
     * @internal
     */
    constructor(
        parentBase: SdkModeT['BaseT'],
        recordStore: SdkModeT['RecordStoreT'],
        tableId: string,
        sdk: SdkModeT['SdkT'],
    ) {
        super(sdk, tableId);
        this._parentBase = parentBase;
        this._recordStore = recordStore;
        this._fieldModelsById = {}; 
        this._cachedFieldNamesById = null;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): SdkModeT['TableDataT'] | null {
        return this._baseData.tablesById[this._id] ?? null;
    }
    /**
     * The base that this table belongs to.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @example
     * ```js
     * import {base} from '@airtable/blocks/base';
     * const table = base.getTableByName('Table 1');
     * console.log(table.parentBase.id === base.id);
     * // => true
     * ```
     */
    get parentBase(): SdkModeT['BaseT'] {
        return this._parentBase;
    }
    /**
     * The name of the table. Can be watched.
     *
     * @example
     * ```js
     * console.log(myTable.name);
     * // => 'Table 1'
     * ```
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * The description of the table, if it has one. Can be watched.
     *
     * @example
     * ```js
     * console.log(myTable.description);
     * // => 'This is my table'
     * ```
     */
    get description(): string | null {
        return this._data.description;
    }
    /**
     * The table's primary field. Every table has exactly one primary
     * field. The primary field of a table will not change.
     *
     * @example
     * ```js
     * console.log(myTable.primaryField.name);
     * // => 'Name'
     * ```
     */
    get primaryField(): SdkModeT['FieldT'] {
        const primaryField = this.getFieldById(this._data.primaryFieldId);
        return primaryField;
    }
    /**
     * The fields in this table. The order is arbitrary, since fields are
     * only ordered in the context of a specific view.
     *
     * Can be watched to know when fields are created or deleted.
     *
     * @example
     * ```js
     * console.log(`This table has ${myTable.fields.length} fields`);
     * ```
     */
    get fields(): Array<SdkModeT['FieldT']> {
        const fields = [];
        for (const fieldId of Object.keys(this._data.fieldsById)) {
            const field = this.getFieldById(fieldId);
            fields.push(field);
        }
        return fields;
    }
    /**
     * Gets the field matching the given ID, or `null` if that field does not exist in this table.

     * @param fieldId The ID of the field.
     * @example
     * ```js
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldByIdIfExists(fieldId);
     * if (field !== null) {
     *     console.log(field.name);
     * } else {
     *     console.log('No field exists with that ID');
     * }
     * ```
     */
    getFieldByIdIfExists(fieldId: FieldId): SdkModeT['FieldT'] | null {
        if (!this._data.fieldsById[fieldId]) {
            return null;
        } else {
            if (!this._fieldModelsById[fieldId]) {
                this._fieldModelsById[fieldId] = this._constructField(fieldId);
            }
            return this._fieldModelsById[fieldId];
        }
    }
    /** @internal */
    abstract _constructField(fieldId: FieldId): SdkModeT['FieldT'];
    /**
     * Gets the field matching the given ID. Throws if that field does not exist in this table. Use
     * {@link getFieldByIdIfExists} instead if you are unsure whether a field exists with the given
     * ID.
     *
     * @param fieldId The ID of the field.
     * @example
     * ```js
     * const fieldId = 'fldxxxxxxxxxxxxxx';
     * const field = myTable.getFieldById(fieldId);
     * console.log(field.name);
     * // => 'Name'
     * ```
     */
    getFieldById(fieldId: FieldId): SdkModeT['FieldT'] {
        const field = this.getFieldByIdIfExists(fieldId);
        if (!field) {
            throw spawnError("No field with ID %s in table '%s'", fieldId, this.name);
        }
        return field;
    }
    /**
     * Gets the field matching the given name, or `null` if no field exists with that name in this
     * table.
     *
     * @param fieldName The name of the field you're looking for.
     * @example
     * ```js
     * const field = myTable.getFieldByNameIfExists('Name');
     * if (field !== null) {
     *     console.log(field.id);
     * } else {
     *     console.log('No field exists with that name');
     * }
     * ```
     */
    getFieldByNameIfExists(fieldName: string): SdkModeT['FieldT'] | null {
        for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
            if (fieldData.name === fieldName) {
                return this.getFieldByIdIfExists(fieldId);
            }
        }
        return null;
    }
    /**
     * Gets the field matching the given name. Throws if no field exists with that name in this
     * table. Use {@link getFieldByNameIfExists} instead if you are unsure whether a field exists
     * with the given name.
     *
     * @param fieldName The name of the field you're looking for.
     * @example
     * ```js
     * const field = myTable.getFieldByName('Name');
     * console.log(field.id);
     * // => 'fldxxxxxxxxxxxxxx'
     * ```
     */
    getFieldByName(fieldName: string): SdkModeT['FieldT'] {
        const field = this.getFieldByNameIfExists(fieldName);
        if (!field) {
            throw spawnError("No field named '%s' in table '%s'", fieldName, this.name);
        }
        return field;
    }
    /**
     * The field matching the given ID or name. Returns `null` if no matching field exists within
     * this table.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getFieldByIdIfExists} or
     * {@link getFieldByNameIfExists} methods instead.
     *
     * @param fieldIdOrName The ID or name of the field you're looking for.
     */
    getFieldIfExists(fieldIdOrName: FieldId | string): SdkModeT['FieldT'] | null {
        return (
            this.getFieldByIdIfExists(fieldIdOrName) ?? this.getFieldByNameIfExists(fieldIdOrName)
        );
    }
    /**
     * The field matching the given ID or name. Throws if no matching field exists within this table.
     * Use {@link getFieldIfExists} instead if you are unsure whether a field exists with the given
     * name/ID.
     *
     * This method is convenient when building an extension for a specific base, but for more generic
     * extensions the best practice is to use the {@link getFieldById} or {@link getFieldByName} methods
     * instead.
     *
     * @param fieldIdOrName The ID or name of the field you're looking for.
     */
    getField(fieldIdOrName: FieldId | string): SdkModeT['FieldT'] {
        const field = this.getFieldIfExists(fieldIdOrName);
        if (!field) {
            throw spawnError(
                "No field with ID or name '%s' in table '%s'",
                fieldIdOrName,
                this.name,
            );
        }
        return field;
    }
    /** @internal */
    _cellValuesByFieldIdOrNameToCellValuesByFieldId(
        cellValuesByFieldIdOrName: ObjectMap<FieldId | string, unknown>,
    ): ObjectMap<FieldId, unknown> {
        return Object.fromEntries(
            entries(cellValuesByFieldIdOrName).map(([fieldIdOrName, cellValue]) => {
                const field = this.__getFieldMatching(fieldIdOrName);
                return [field.id, cellValue];
            }),
        );
    }
    /**
     * @internal
     */
    __getFieldMatching(fieldOrFieldIdOrFieldName: SdkModeT['FieldT'] | string): SdkModeT['FieldT'] {
        let field: SdkModeT['FieldT'] | null;
        if (fieldOrFieldIdOrFieldName instanceof FieldCore) {
            if (fieldOrFieldIdOrFieldName.parentTable.id !== this.id) {
                throw spawnError(
                    "Field '%s' is from a different table than table '%s'",
                    fieldOrFieldIdOrFieldName.name,
                    this.name,
                );
            }
            field = fieldOrFieldIdOrFieldName;
        } else {
            field =
                this.getFieldByIdIfExists(fieldOrFieldIdOrFieldName) ||
                this.getFieldByNameIfExists(fieldOrFieldIdOrFieldName);

            if (field === null) {
                throw spawnError(
                    "Field '%s' does not exist in table '%s'",
                    fieldOrFieldIdOrFieldName,
                    this.name,
                );
            }
        }

        if (field.isDeleted) {
            throw spawnError("Field '%s' was deleted from table '%s'", field.name, this.name);
        }
        return field;
    }
    /**
     * @internal
     */
    __triggerOnChangeForDirtyPaths(
        dirtyPaths: ChangedPathsForType<SdkModeT['TableDataT']>,
    ): boolean {
        let didTableSchemaChange = false;
        if (dirtyPaths.name) {
            this._onChange(WatchableTableKeysCore.name);
            didTableSchemaChange = true;
        }
        if (dirtyPaths.lock) {
            didTableSchemaChange = true;
        }
        if (dirtyPaths.externalSyncById) {
            didTableSchemaChange = true;
        }
        if (dirtyPaths.description) {
            this._onChange(WatchableTableKeysCore.description);
            didTableSchemaChange = true;
        }
        if (dirtyPaths.fieldsById) {
            didTableSchemaChange = true;

            const addedFieldIds: Array<FieldId> = [];
            const removedFieldIds: Array<FieldId> = [];
            for (const [fieldId, dirtyFieldPaths] of entries(dirtyPaths.fieldsById)) {
                if (dirtyFieldPaths && dirtyFieldPaths._isDirty) {
                    if (has(this._data.fieldsById, fieldId)) {
                        addedFieldIds.push(fieldId);
                    } else {
                        removedFieldIds.push(fieldId);

                        const fieldModel = this._fieldModelsById[fieldId];
                        if (fieldModel) {
                            delete this._fieldModelsById[fieldId];
                        }
                    }
                } else {
                    const field = this._fieldModelsById[fieldId];
                    if (field) {
                        field.__triggerOnChangeForDirtyPaths(dirtyFieldPaths);
                    }
                }
            }

            if (addedFieldIds.length > 0 || removedFieldIds.length > 0) {
                this._onChange(WatchableTableKeysCore.fields, {
                    addedFieldIds,
                    removedFieldIds,
                });
            }

            this._cachedFieldNamesById = null;
        }

        this._recordStore.triggerOnChangeForDirtyPaths(dirtyPaths);

        return didTableSchemaChange;
    }
    /**
     * @internal
     */
    __getFieldNamesById(): {[key: string]: string} {
        if (!this._cachedFieldNamesById) {
            const fieldNamesById: ObjectMap<FieldId, string> = {};
            for (const [fieldId, fieldData] of entries(this._data.fieldsById)) {
                fieldNamesById[fieldId] = fieldData.name;
            }
            this._cachedFieldNamesById = fieldNamesById;
        }
        return this._cachedFieldNamesById;
    }
}
