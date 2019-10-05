/** @module @airtable/blocks/ui: Select */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';

// JSON stringify the value so you can use any primitive.
// Regular <select> coerces all values to string, which is confusing.
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
 * @typedef {object} SelectOption
 * @property {string | number | boolean | null} value The value for the select option.
 * @property {React.ReactNode} label The label for the select option.
 * @property {boolean} [disabled=false] If set to `true`, this option will not be selectable.
 */
export type SelectOption = {
    value: SelectOptionValue;
    label: React.ReactNode;
    disabled?: boolean;
};

export const SelectOptionValuePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
]);

export const validateOptions = (options: Array<SelectOption>) => {
    if (options) {
        for (const option of options) {
            // These are hard errors because we can't guarantee that other values
            // will be JSON-encodable. And undefined gets coerced to the string
            // "undefined" which is confusing.
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
