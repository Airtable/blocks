/** @module @airtable/blocks/models: Field */ /** */
import {BaseData} from '../types/base';
import {FieldTypes, FieldData, PrivateColumnType, FieldType} from '../types/field';
import {isEnumValue, cloneDeep, values, ObjectValues, FlowAnyObject} from '../private_utils';
import getSdk from '../get_sdk';
import AbstractModel from './abstract_model';
import Aggregators, {Aggregator} from './aggregators';
import liveappSummaryFunctionKeyByAggregatorKey from './liveapp_summary_function_key_by_aggregator_key';
import Table from './table';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const ColumnTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_types',
);
const ApiCellFormats = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_cell_formats',
);
const {PublicApiVersions} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_versions',
);

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableFieldKeys = Object.freeze({
    name: 'name' as const,
    type: 'type' as const,
    options: 'options' as const,
    isComputed: 'isComputed' as const,
});

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
     * @function id
     * @memberof Field
     * @instance
     * @returns {string} This field's ID.
     * @example
     * ```js
     * console.log(myField.id);
     * // => 'fldxxxxxxxxxxxxxx'
     * ```
     */

    /**
     * True if this field has been deleted.
     *
     * In general, it's best to avoid keeping a reference to a field past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted field (other than its ID) will throw. But if you do keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * field's data.
     *
     * @function isDeleted
     * @memberof Field
     * @instance
     * @returns {boolean} `true` if the field has been deleted, `false` otherwise.
     * @example
     * ```js
     * if (!myField.isDeleted) {
     *     // Do things with myField
     * }
     * ```
     */

    /**
     * Get notified of changes to the field.
     *
     * Watchable keys are:
     * - `'name'`
     * - `'type'`
     * - `'options'`
     * - `'isComputed'`
     *
     * Every call to `.watch` should have a matching call to `.unwatch`.
     *
     * @function watch
     * @memberof Field
     * @instance
     * @param {(WatchableFieldKey|Array<WatchableFieldKey>)} keys the keys to watch
     * @param {Function} callback a function to call when those keys change
     * @param {?object} [context] an optional context for `this` in `callback`.
     * @returns {Array<WatchableFieldKey>} the array of keys that were watched
     */

    /**
     * Unwatch keys watched with `.watch`.
     *
     * Should be called with the same arguments given to `.watch`.
     *
     * @function unwatch
     * @memberof Field
     * @instance
     * @param {(WatchableFieldKey|Array<WatchableFieldKey>)} keys the keys to unwatch
     * @param {Function} callback the function passed to `.watch` for these keys
     * @param {?object} [context] the context that was passed to `.watch` for this `callback`
     * @returns {Array<WatchableFieldKey>} the array of keys that were unwatched
     */

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
     * @internal (since we may not be able to return parent model instances in the immutable models world)
     * @function
     * @returns The table that this field belongs to. Should never change because fields aren't moved between tables.
     *
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
     * @function
     * @returns The name of the field. Can be watched.
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
     * @function
     * @returns The type of the field. Can be watched.
     * @example
     * ```js
     * console.log(myField.type);
     * // => 'singleLineText'
     * ```
     */
    get type(): FieldType {
        // TODO: add separate methods for getting type and options and
        const {type} = columnTypeProvider.getConfigForPublicApi(
            this.__getRawType(),
            this.__getRawTypeOptions(),
            getSdk().__appInterface,
            this.parentTable.__getFieldNamesById(),
        );
        // We intend to switch from "lookup" to "multipleLookupValues", but need to support both
        // until the transition is complete. See <https://airtable.quip.com/VxaMAmAfUscs> for more.
        if (type === 'lookup') {
            return FieldTypes.MULTIPLE_LOOKUP_VALUES;
        } else {
            return type;
        }
    }
    /**
     * @function
     * @returns The configuration options of the field. The structure of the field's
     * options depend on the field's type. Can be watched.
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
        const {options} = columnTypeProvider.getConfigForPublicApi(
            this.__getRawType(),
            this.__getRawTypeOptions(),
            getSdk().__appInterface,
            this.parentTable.__getFieldNamesById(),
        );

        return options ? cloneDeep(options) : null;
    }
    /**
     * @function
     * @returns `true` if this field is computed, `false` otherwise. A field is
     * "computed" if it's value is not set by user input (e.g. autoNumber, formula,
     * etc.). Can be watched.
     * @example
     * ```js
     * console.log(mySingleLineTextField.isComputed);
     * // => false
     * console.log(myAutoNumberField.isComputed);
     * // => true
     * ```
     */
    get isComputed(): boolean {
        const isComputed = columnTypeProvider.isComputed(this.__getRawType());
        return isComputed;
    }
    /**
     * @function
     * @returns `true` if this field is its parent table's primary field, `false` otherwise.
     * Should never change because the primary field of a table cannot change.
     */
    get isPrimaryField(): boolean {
        return this.id === this.parentTable.primaryField.id;
    }
    /**
     * @function
     * @returns A list of available aggregators given this field's configuration.
     * @example
     * ```js
     * const fieldAggregators = myField.availableAggregators;
     * ```
     */
    get availableAggregators(): Array<Aggregator> {
        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return values(Aggregators).filter(aggregator => {
            const liveappSummaryFunctionKey =
                liveappSummaryFunctionKeyByAggregatorKey[aggregator.key];
            return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
        });
    }
    /**
     * @function
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
    isAggregatorAvailable(
        aggregator: Aggregator | keyof typeof liveappSummaryFunctionKeyByAggregatorKey,
    ): boolean {
        const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;
        const liveappSummaryFunctionKey = liveappSummaryFunctionKeyByAggregatorKey[aggregatorKey];

        const possibleSummaryFunctionConfigs = columnTypeProvider.getPossibleSummaryFunctionConfigs(
            this.__getRawType(),
            this.__getRawTypeOptions(),
        );
        return !!possibleSummaryFunctionConfigs[liveappSummaryFunctionKey];
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
        // TODO(jb): figure out 'cacheForBulkConversion'
        const privateCellValue = columnTypeProvider.convertStringToCellValue(
            string,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            getSdk().__appInterface,
        );

        const publicCellValue = columnTypeProvider.formatCellValueForPublicApi(
            privateCellValue,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            getSdk().__appInterface,
            {cellFormat: ApiCellFormats.JSON, apiVersion: PublicApiVersions.API2},
        );
        const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(
            publicCellValue,
            null,
            this.__getRawType(),
            this.__getRawTypeOptions(),
            getSdk().__appInterface,
            PublicApiVersions.API2,
        );

        if (validationResult.isValid) {
            return publicCellValue;
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
    __getRawFormulaicResultType() {
        // Copied from liveapp column model.
        // We don't store resultType for count, for all intents and purposes on the
        // client side, counts should use a "number" resultType.
        if (this.__getRawType() === ColumnTypes.COUNT) {
            return ColumnTypes.NUMBER;
        } else {
            const typeOptions = this.__getRawTypeOptions();
            if (!typeOptions || typeOptions.resultType === undefined) {
                return null;
            } else {
                return typeOptions.resultType;
            }
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

            // TODO: it would be better if we only trigger this when
            // we know isComputed changed.
            this._onChange(WatchableFieldKeys.isComputed);
        }
        if (dirtyPaths.typeOptions) {
            this._onChange(WatchableFieldKeys.options);
        }
    }
}

export default Field;
