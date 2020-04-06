/** @module @airtable/blocks/models: Field */ /** */
import {AggregatorKey} from '../types/aggregators';
import {BaseData} from '../types/base';
import {MutationTypes, PermissionCheckResult} from '../types/mutations';
import {FieldData, PrivateColumnType, FieldType, FieldOptions} from '../types/field';
import {isEnumValue, cloneDeep, values, ObjectValues, FlowAnyObject} from '../private_utils';
import getSdk from '../get_sdk';
import AbstractModel from './abstract_model';
import Aggregators, {Aggregator} from './aggregators';
import Table from './table';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
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
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;

        const {type} = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );
        // We intend to switch from "lookup" to "multipleLookupValues", but need to support both
        // until the transition is complete. See <https://airtable.quip.com/VxaMAmAfUscs> for more.
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
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;

        const {options} = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );

        // TODO(emma): can we remove this cloneDeep?
        return options ? cloneDeep(options) : null;
    }
    /**
     * @internal
     * TODO(emma): add docstrings
     */
    unstable_checkPermissionsForUpdateOptions(
        options?: FieldOptions | null,
    ): PermissionCheckResult {
        return getSdk().__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                // In field.options we translate options to null when it's undefined (no options),
                // but the mutation expects config to match the PublicApiConfig, where it's
                // not present at all (options: undefined will fail validation).
                ...(options ? {options} : null),
            },
        });
    }

    /**
     * @internal
     * TODO(emma): add docstrings
     */
    unstable_hasPermissionToUpdateOptions(options?: FieldOptions | null): boolean {
        return this.unstable_checkPermissionsForUpdateOptions(options).hasPermission;
    }

    /**
     * @internal
     * TODO(emma): add docstrings
     */
    async unstable_updateOptionsAsync(options: FieldOptions | null): Promise<void> {
        await getSdk().__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                // In field.options we translate options to null when it's undefined (no options),
                // but the mutation expects config to match the PublicApiConfig, where it's
                // not present at all (options: undefined will fail validation).
                ...(options ? {options} : null),
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
        const airtableInterface = getSdk().__airtableInterface;
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

        return values(Aggregators).filter(aggregator => {
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
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;

        const cellValue = airtableInterface.fieldTypeProvider.convertStringToCellValue(
            appInterface,
            string,
            this._data,
        );

        // Temporarily bail out of validating computed values (since validation will crash)
        // while we work out if we actually have to validate or not. Ideally we just delete all
        // the validation
        // TODO(emma): delete me or tidy me up
        if (this.isComputed) {
            return cellValue;
        }

        // TODO(emma): do we need to validate here?
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
    __getRawType(): PrivateColumnType {
        return this._data.type;
    }
    /**
     * @internal
     */
    __getRawTypeOptions(): FlowAnyObject | null | undefined {
        return this._data.typeOptions;
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

            // TODO: it would be better if we only trigger this when
            // we know isComputed changed.
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
