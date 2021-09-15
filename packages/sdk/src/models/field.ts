/** @module @airtable/blocks/models: Field */ /** */
import {AggregatorKey} from '../types/aggregators';
import Sdk from '../sdk';
import {MutationTypes, PermissionCheckResult, UpdateFieldOptionsOpts} from '../types/mutations';
import {FieldData, FieldType, FieldOptions, FieldConfig} from '../types/field';
import {isEnumValue, cloneDeep, values, ObjectValues, FlowAnyObject} from '../private_utils';
import {FieldTypeConfig} from '../types/airtable_interface';
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
    /** @internal */
    _cachedFieldTypeConfigOrNull: FieldTypeConfig | null;
    /**
     * @internal
     */
    constructor(sdk: Sdk, parentTable: Table, fieldId: string) {
        super(sdk, fieldId);

        this._parentTable = parentTable;
        this._cachedFieldTypeConfigOrNull = null;
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
        const {type} = this._getCachedConfigFromFieldTypeProvider();
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
        const {options} = this._getCachedConfigFromFieldTypeProvider();

        return options ? cloneDeep(options) : null;
    }

    _getCachedConfigFromFieldTypeProvider(): FieldTypeConfig {
        if (this._cachedFieldTypeConfigOrNull !== null) {
            return this._cachedFieldTypeConfigOrNull;
        }
        const airtableInterface = this._sdk.__airtableInterface;
        const appInterface = this._sdk.__appInterface;

        this._cachedFieldTypeConfigOrNull = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );

        return this._cachedFieldTypeConfigOrNull;
    }
    _clearCachedConfig(): void {
        this._cachedFieldTypeConfigOrNull = null;
    }

    /**
     * The type and options of the field to make type narrowing `FieldOptions` easier.
     *
     * @see {@link FieldConfig}
     * @example
     * const fieldConfig = field.config;
     * if (fieldConfig.type === FieldType.SINGLE_SELECT) {
     *     return fieldConfig.options.choices;
     * } else if (fieldConfig.type === FieldType.MULTIPLE_LOOKUP_VALUES && fieldConfig.options.isValid) {
     *     if (fieldConfig.options.result.type === FieldType.SINGLE_SELECT) {
     *         return fieldConfig.options.result.options.choices;
     *     }
     * }
     * return DEFAULT_CHOICES;
     */
    get config(): FieldConfig {
        return {
            type: this.type,
            options: this.options,
        } as FieldConfig;
    }
    /**
     * Checks whether the current user has permission to perform the given options update.
     *
     * Accepts partial input, in the same format as {@link updateOptionsAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified field,
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
        return this._sdk.__mutations.checkPermissionsForMutation({
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
     * Optionally, you can pass an `opts` object as the second argument. See {@link UpdateFieldOptionsOpts}
     * for available options.
     *
     * @param options new options for the field
     * @param opts optional options to affect the behavior of the update
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
    async updateOptionsAsync(
        options: FieldOptions,
        opts: UpdateFieldOptionsOpts = {},
    ): Promise<void> {
        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                options: options,
            },
            opts,
        });
    }

    /**
     * Checks whether the current user has permission to perform the given description update.
     *
     * Accepts partial input, in the same format as {@link updateDescriptionAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified field,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param description new description for the field
     *
     * @example
     * ```js
     * const updateFieldCheckResult = field.checkPermissionsForUpdateDescription();
     *
     * if (!updateFieldCheckResult.hasPermission) {
     *     alert(updateFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForUpdateDescription(description?: string | null): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION,
            tableId: this.parentTable.id,
            id: this.id,
            description,
        });
    }

    /**
     * An alias for `checkPermissionsForUpdateDescription(options).hasPermission`.
     *
     * Checks whether the current user has permission to perform the description update.
     *
     * Accepts partial input, in the same format as {@link updateDescriptionAsync}.
     *
     * @param description new description for the field
     *
     * @example
     * ```js
     * const canUpdateField = field.hasPermissionToUpdateDescription();
     *
     * if (!canUpdateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToUpdateDescription(description?: string | null): boolean {
        return this.checkPermissionsForUpdateDescription(description).hasPermission;
    }

    /**
     * Updates the description for this field.
     *
     * To remove an existing description, pass `''` or `null` as the new description.
     *
     * Throws an error if the user does not have permission to update the field, or if an invalid
     * description is provided.
     *
     * This action is asynchronous. Unlike updates to cell values, updates to field descriptions are
     * **not** applied optimistically locally. You must `await` the returned promise before
     * relying on the change in your app.
     *
     * @param description new description for the field
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
    async updateDescriptionAsync(description: string | null): Promise<void> {
        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION,
            tableId: this.parentTable.id,
            id: this.id,
            description,
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
        const airtableInterface = this._sdk.__airtableInterface;
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
        const airtableInterface = this._sdk.__airtableInterface;
        const availableAggregatorKeysSet = new Set(
            airtableInterface.aggregators.getAvailableAggregatorKeysForField(this._data),
        );

        const {aggregators} = require('./models');
        return values(aggregators).filter(aggregator => {
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

        const airtableInterface = this._sdk.__airtableInterface;
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
        const airtableInterface = this._sdk.__airtableInterface;
        const appInterface = this._sdk.__appInterface;

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
        this._clearCachedConfig();

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
