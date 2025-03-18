import {FieldData, FieldType, FieldOptions, FieldConfig} from '../types/field';
import {isEnumValue, cloneDeep, ObjectValues, FlowAnyObject} from '../../private_utils';
import {SdkMode} from '../../sdk_mode';
import {FieldTypeConfig} from '../types/airtable_interface_core';
import AbstractModel from './abstract_model';

// This doesn't follow our enum naming conventions because we want the keys
// to mirror the method/getter names on the model class.
const WatchableFieldKeys = Object.freeze({
    name: 'name' as const,
    type: 'type' as const,
    options: 'options' as const,
    isComputed: 'isComputed' as const,
    description: 'description' as const,
    isFieldSynced: 'isFieldSynced' as const,
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

/** @hidden */
export abstract class FieldCore<SdkModeT extends SdkMode> extends AbstractModel<
    SdkModeT,
    FieldData,
    WatchableFieldKey
> {
    /** @internal */
    static _className = 'FieldCore';
    /** @internal */
    static _isWatchableKey(key: string) {
        return isEnumValue(WatchableFieldKeys, key);
    }
    /** @internal */
    _parentTable: SdkModeT['TableT'];
    /** @internal */
    _cachedFieldTypeConfigOrNull: FieldTypeConfig | null;
    /**
     * @internal
     */
    constructor(sdk: SdkModeT['SdkT'], parentTable: SdkModeT['TableT'], fieldId: string) {
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
    get parentTable(): SdkModeT['TableT'] {
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
        const {options} = this._getCachedConfigFromFieldTypeProvider();

        // TODO: In the next breaking release freeze (inside of the cache) and replace
        // FieldOptions with readonly<FieldOptions>.
        // Today this is required because we re-use the fieldTypeProvider.getConfig response.
        return options ? cloneDeep(options) : null;
    }

    // We use a cached response from FieldTypeProvider because getting the config can
    // be an expensive operation. In particular when fieldConfigs are extremely large
    // (eg: Select fields with lots of select options)
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
     * `true` if this field is synced, `false` otherwise. A field is
     * "synced" if it's source is from another airtable base or external data source
     * like Google Calendar, Jira, etc..
     *
     * @hidden
     */
    get isFieldSynced(): boolean {
        return this._data.isSynced ?? false;
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
            // The opt parseDateCellValueInColumnTimeZone is used here to ensure date string
            // inputs are interpreted correctly according to the `timeZone` of the dateTime field.
            {parseDateCellValueInColumnTimeZone: this.type === FieldType.DATE_TIME},
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
    __triggerOnChangeForDirtyPaths(dirtyPaths: FlowAnyObject) {
        // Always clear the cached config when anything on the field data model changes
        this._clearCachedConfig();

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
        if (dirtyPaths.isSynced) {
            this._onChange(WatchableFieldKeys.isFieldSynced);
        }
    }
}
