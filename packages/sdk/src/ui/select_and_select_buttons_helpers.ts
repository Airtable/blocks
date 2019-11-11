/** @module @airtable/blocks/ui: Select */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';

/**
 * Supported value types for {@link SelectOption}.
 */
export type SelectOptionValue = string | number | boolean | null | undefined;

/** @internal */
export function isSelectOptionValue(value: unknown): value is SelectOptionValue {
    return (
        value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    );
}

/**
 * A select option for {@link Select}, {@link TablePicker}, {@link ViewPicker}, {@link FieldPicker}, and their `Synced` counterparts.
 */
export interface SelectOption {
    /** The value for the select option. */
    value: SelectOptionValue;
    /** The label for the select option. */
    label: React.ReactNode;
    /** If set to `true`, this option will not be selectable. */
    disabled?: boolean;
}

export const selectOptionValuePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
]) as PropTypes.Validator<NonNullable<SelectOptionValue>>;

export const validateOptions = (options: Array<SelectOption>) => {
    if (options) {
        for (const option of options) {
            if (typeof option.value === 'object' && option.value !== null) {
                return {
                    isValid: false,
                    reason:
                        'option value must be a string, number, boolean, null, or undefined. Got an object.',
                };
            }
        }
    }
    return {isValid: true};
};

/** @internal */
export function optionValueToString(value: SelectOptionValue): string {
    const valueJson = JSON.stringify(
        value === undefined ? {isUndefined: true} : {notUndefinedValue: value},
    );
    return valueJson;
}
/** @internal */
export function stringToOptionValue(valueJson: string): SelectOptionValue {
    const parsed = JSON.parse(valueJson);
    const value = parsed.isUndefined ? null : parsed.notUndefinedValue;
    return value;
}
