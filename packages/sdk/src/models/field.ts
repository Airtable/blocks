/** @module @airtable/blocks/models: Field */ /** */
import getAirtableInterface from '../injected/airtable_interface';

import {AggregatorKey} from '../types/aggregators';
import {BaseData} from '../types/base';
import {MutationTypes, PermissionCheckResult} from '../types/mutations';
import {FieldData, FieldType, FieldOptions} from '../types/field';
import {isEnumValue, cloneDeep, values, ObjectValues, FlowAnyObject} from '../private_utils';
import getSdk from '../get_sdk';
import AbstractModel from './abstract_model';
import {Aggregator} from './create_aggregators';
import Table from './table';

const WatchableFieldKeys = Object.freeze({
    name: 'name' as const,
    type: 'type' as const,
    options: 'options' as const,
    isComputed: 'isComputed' as const,
    description: 'description' as const,
});

/**
 * All the watchable keys in a field.
 * - `name`
 * - `type`
 * - `options`
 * - `isComputed`
 * - `description`
 */
export type WatchableFieldKey = ObjectValues<typeof WatchableFieldKeys>;

/**
 * Model class representing a field in a table.
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks';
 *
 * const table = base.getTableByName('Table 1');
 * const field = table.getFieldByName('Name');
 * console.log('The type of this field is', field.type);
 * ```
 * @docsPath models/Field
 */
class Field extends AbstractModel<FieldData, WatchableFieldKey> {
    /** @internal */
    static _className = 'Field';
    /** @internal */
    static _isWatchableKey(key: string) {
        return isEnumValue(WatchableFieldKeys, key);
    }
    /** @internal */
    _parentTable: Table;
    /**
     * @internal
     */
    constructor(baseData: BaseData, parentTable: Table, fieldId: string) {
        super(baseData, fieldId);

        this._parentTable = parentTable;
    }

    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): FieldData | null {
        const tableData = this._baseData.tablesById[this.parentTable.id];
        return tableData?.fieldsById[this._id] ?? null;
    }
    /**
     * The table that this field belongs to. Should never change because fields aren't moved between tables.
     *
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @example
     * ```js
     * const field = myTable.getFieldByName('Name');
     * console.log(field.parentTable.id === myTable.id);
     * // => true
     * ```
     */
    get parentTable(): Table {
        return this._parentTable;
    }
    /**
     * The name of the field. Can be watched.
     *
     * @example
     * ```js
     * console.log(myField.name);
     * // => 'Name'
     * ```
     */
    get name(): string {
        return this._data.name;
    }
    /**
     * The type of the field. Can be watched.
     *
     * @example
     * ```js
     * console.log(myField.type);
     * // => 'singleLineText'
     * ```
     */
    get type(): FieldType {
        const airtableInterface = getAirtableInterface();
        const appInterface = getSdk().__appInterface;

        const {type} = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );
        // @ts-ignore
        if (type === 'lookup') {
            return FieldType.MULTIPLE_LOOKUP_VALUES;
        } else {
            return type;
        }
    }
    /**
     * The configuration options of the field. The structure of the field's
     * options depend on the field's type. `null` if the field has no options.
     * Can be watched.
     *
     * @see {@link FieldType}
     * @example
     * ```js
     * import {FieldType} from '@airtable/blocks/models';
     *
     * if (myField.type === FieldType.CURRENCY) {
     *     console.log(myField.options.symbol);
     *     // => '$'
     * }
     * ```
     */
    get options(): FieldOptions | null {
        const airtableInterface = getAirtableInterface();
        const appInterface = getSdk().__appInterface;

        const {options} = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );

        return options ? cloneDeep(options) : null;
    }
    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * Checks whether the current user has permission to perform the given options update.
     *
     * Accepts partial input, in the same format as {@link updateOptionsAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified record,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param options new options for the field
     *
     * @example
     * ```js
     * const updateFieldCheckResult = field.checkPermissionsForUpdateOptions();
     *
     * if (!updateFieldCheckResult.hasPermission) {
     *     alert(updateFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForUpdateOptions(options?: FieldOptions): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                options: options,
            },
        });
    }

    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * An alias for `checkPermissionsForUpdateOptions(options).hasPermission`.
     *
     * Checks whether the current user has permission to perform the options update.
     *
     * Accepts partial input, in the same format as {@link updateOptionsAsync}.
     *
     * @param options new options for the field
     *
     * @example
     * ```js
     * const canUpdateField = field.hasPermissionToUpdateOptions();
     *
     * if (!canUpdateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToUpdateOptions(options?: FieldOptions): boolean {
        return this.checkPermissionsForUpdateOptions(options).hasPermission;
    }

    /**
     * _Beta feature with unstable API. May have breaking changes before release._
     *
     * Updates the options for this field.
     *
     * Throws an error if the user does not have permission to update the field, if invalid
     * options are provided, if this field has no writable options, or if updates to this field
     * type is not supported.
     *
     * Refer to {@link FieldType} for supported field types, the write format for options, and
     * other specifics for certain field types.
     *
     * This action is asynchronous. Unlike updates to cell values, updates to field options are
     * **not** applied optimistically locally. You must `await` the returned promise before
     * relying on the change in your app.
     *
     * @param options new options for the field
     *
     * @example
     * ```js
     * async function addChoiceToSelectField(selectField, nameForNewOption) {
     *     const updatedOptions = {
     *         choices: [
     *             ...selectField.options.choices,
     *             {name: nameForNewOption},
     *         ]
     *     };
     *
     *     if (selectField.hasPermissionToUpdateOptions(updatedOptions)) {
     *         await selectField.updateOptionsAsync(updatedOptions);
     *     }
     * }
     * ```
     */
    async updateOptionsAsync(options: FieldOptions): Promise<void> {
        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                options: options,
            },
        });
    }
    /**
     * `true` if this field is computed, `false` otherwise. A field is
     * "computed" if it's value is not set by user input (e.g. autoNumber, formula,
     * etc.). Can be watched
     *
     * @example
     * ```js
     * console.log(mySingleLineTextField.isComputed);
     * // => false
     * console.log(myAutoNumberField.isComputed);
     * // => true
     * ```
     */
    get isComputed(): boolean {
        const airtableInterface = getAirtableInterface();
        return airtableInterface.fieldTypeProvider.isComputed(this._data);
    }
    /**
     * `true` if this field is its parent table's primary field, `false` otherwise.
     * Should never change because the primary field of a table cannot change.
     */
    get isPrimaryField(): boolean {
        return this.id === this.parentTable.primaryField.id;
    }

    /**
     * The description of the field, if it has one. Can be watched.
     *
     * @example
     * ```js
     * console.log(myField.description);
     * // => 'This is my field'
     * ```
     */
    get description(): string | null {
        return this._data.description;
    }
    /**
     * A list of available aggregators given this field's configuration.
     *
     * @example
     * ```js
     * const fieldAggregators = myField.availableAggregators;
     * ```
     */
    get availableAggregators(): Array<Aggregator> {
        const airtableInterface = this._parentTable._airtableInterface;
        const availableAggregatorKeysSet = new Set(
            airtableInterface.aggregators.getAvailableAggregatorKeysForField(this._data),
        );

        return values(getSdk().models.aggregators).filter(aggregator => {
            return availableAggregatorKeysSet.has(aggregator.key);
        });
    }
    /**
     * Checks if the given aggregator is available for this field.
     *
     * @param aggregator The aggregator object or aggregator key.
     * @example
     * ```js
     * import {aggregators} from '@airtable/blocks/models';
     * const aggregator = aggregators.totalAttachmentSize;
     *
     * // Using an aggregator object
     * console.log(myAttachmentField.isAggregatorAvailable(aggregator));
     * // => true
     *
     * // Using an aggregator key
     * console.log(myTextField.isAggregatorAvailable('totalAttachmentSize'));
     * // => false
     * ```
     */
    isAggregatorAvailable(aggregator: Aggregator | AggregatorKey): boolean {
        const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;

        const airtableInterface = this._parentTable._airtableInterface;
        const availableAggregatorKeys = airtableInterface.aggregators.getAvailableAggregatorKeysForField(
            this._data,
        );

        return availableAggregatorKeys.some(key => key === aggregatorKey);
    }
    /**
     * Attempt to parse a given string and return a valid cell value for the field's current config.
     * Returns `null` if unable to parse the given string.
     *
     * @param string The string to parse.
     * @example
     * ```js
     * const inputString = '42';
     * const cellValue = myNumberField.convertStringToCellValue(inputString);
     * console.log(cellValue === 42);
     * // => true
     * ```
     */
    convertStringToCellValue(string: string): unknown {
        const airtableInterface = getAirtableInterface();
        const appInterface = getSdk().__appInterface;

        const cellValue = airtableInterface.fieldTypeProvider.convertStringToCellValue(
            appInterface,
            string,
            this._data,
        );

        if (this.isComputed) {
            return cellValue;
        }

        const validationResult = airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
            appInterface,
            cellValue,
            null,
            this._data,
        );

        if (validationResult.isValid) {
            return cellValue;
        } else {
            return null;
        }
    }
    /**
     * @internal
     */
    __triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject) {
        if (dirtyPaths.name) {
            this._onChange(WatchableFieldKeys.name);
        }
        if (dirtyPaths.type) {
            this._onChange(WatchableFieldKeys.type);

            this._onChange(WatchableFieldKeys.isComputed);
        }
        if (dirtyPaths.typeOptions) {
            this._onChange(WatchableFieldKeys.options);
        }
        if (dirtyPaths.description) {
            this._onChange(WatchableFieldKeys.description);
        }
    }
}

export default Field;
