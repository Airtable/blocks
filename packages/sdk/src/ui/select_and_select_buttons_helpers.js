// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {type GlobalConfigKey} from '../global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

export type SelectOptionValue = string | number | boolean | null | void;

/**
 * @typedef {object} SelectOption
 * @property {string | number | boolean | null} value The value for the select option.
 * @property {React.Node} label The label for the select option.
 * @property {boolean} [disabled=false] If set to `true`, this option will not be selectable.
 */
type SelectOption = {
    value: SelectOptionValue,
    label: React.Node,
    disabled?: boolean,
};

export type SelectAndSelectButtonsProps = {|
    onChange?: SelectOptionValue => void,
    value: ?SelectOptionValue,
    options: Array<SelectOption>,
    disabled?: boolean,
    id?: string,
    className?: string,
    style?: {[string]: mixed},
    tabIndex?: number | string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
|};

export type SelectAndSelectButtonsSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    options: Array<SelectOption>,
    onChange?: (value: SelectOptionValue) => void,
    disabled?: boolean,
    id?: string,
    className?: string,
    style?: {[string]: mixed},
    tabIndex?: number | string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
|};

const SelectOptionValueProp = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
]);

export const SelectAndSelectButtonsPropTypes = {
    onChange: PropTypes.func,
    value: SelectOptionValueProp,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: SelectOptionValueProp,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ).isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const SelectAndSelectButtonsSyncedPropTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: SelectOptionValueProp,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ).isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

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
    const value = parsed.isUndefined ? undefined : parsed.notUndefinedValue;
    return value;
}
