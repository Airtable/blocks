/** @module @airtable/blocks/models: Field */ /** */
import {AggregatorKey} from '../types/aggregators';
import {BaseData} from '../types/base';
import {FieldTypes, FieldData, PrivateColumnType, FieldType} from '../types/field';
import {isEnumValue, cloneDeep, values, ObjectValues, FlowAnyObject} from '../private_utils';
import getSdk from '../get_sdk';
import AbstractModel from './abstract_model';
import Aggregators, {Aggregator} from './aggregators';
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
        if (!tableData) {
            return null;
        }
        return tableData.fieldsById[this._id] || null;
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
        // @ts-ignore
        if (type === 'lookup') {
            return FieldTypes.MULTIPLE_LOOKUP_VALUES;
        } else {
            return type;
        }
    }
    /**
     * The configuration options of the field. The structure of the field's
     * options depend on the field's type. Can be watched.
     *
     * @see {@link FieldTypes}
     * @example
     * ```js
     * import {fieldTypes} from '@airtable/blocks/models';
     *
     * if (myField.type === fieldTypes.CURRENCY) {
     *     console.log(myField.options.symbol);
     *     // => '$'
     * }
     * ```
     */
    get options(): {[key: string]: unknown} | null {
        const airtableInterface = getSdk().__airtableInterface;
        const appInterface = getSdk().__appInterface;

        const {options} = airtableInterface.fieldTypeProvider.getConfig(
            appInterface,
            this._data,
            this.parentTable.__getFieldNamesById(),
        );

        return options ? cloneDeep(options) : null;
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
     * @param aggregator The aggregator object or aggregator key.
     * @returns `true` if the given aggregator is available for this field, `false` otherwise.
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
     * console.log(mySingleLineTextField.isAggregatorAvailable('totalAttachmentSize'));
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
     * Given a string, will attempt to parse it and return a valid cell value for
     * the field's current config.
     *
     * @param string The string to parse.
     * @returns The parsed cell value, or `null` if unable to parse the given string.
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
