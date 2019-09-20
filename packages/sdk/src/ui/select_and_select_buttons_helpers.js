// @flow
import PropTypes from 'prop-types';
import * as React from 'react';

export type SelectOptionValue = string | number | boolean | null | void;

/**
 * @typedef {object} SelectOption
 * @property {string | number | boolean | null} value The value for the select option.
 * @property {React.Node} label The label for the select option.
 * @property {boolean} [disabled=false] If set to `true`, this option will not be selectable.
 */
export type SelectOption = {
    value: SelectOptionValue,
    label: React.Node,
    disabled?: boolean,
};

export const SelectOptionValuePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
]);

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

/** @private */
export function optionValueToString(value: SelectOptionValue): string {
    const valueJson = JSON.stringify(
        value === undefined ? {isUndefined: true} : {notUndefinedValue: value},
    );
    return valueJson;
}
/** @private */
export function stringToOptionValue(valueJson: string): SelectOptionValue {
    const parsed = JSON.parse(valueJson);
    const value = parsed.isUndefined ? null : parsed.notUndefinedValue;
    return value;
}
