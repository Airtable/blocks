// @flow
const React = require('block_sdk/frontend/ui/react');
const globalConfigSyncedComponentHelpers = require('block_sdk/frontend/ui/global_config_synced_component_helpers');
const PropTypes = require('prop-types');

import type {GlobalConfigKey} from 'block_sdk/shared/global_config';

// JSON stringify the value so you can use any primitive.
// Regular <select> coerces all values to string, which is confusing.
export type SelectOptionValue = string | number | boolean | null | void;

type SelectOption = {
    value: SelectOptionValue,
    label: React.Node,
    disabled?: boolean,
};

export type SelectAndSelectButtonsProps = {
    onChange?: (SelectOptionValue) => void,
    value: ?SelectOptionValue,
    options: Array<SelectOption>,
    disabled?: boolean,
    style?: Object,
    className?: string,
    tabIndex?: number | string,
    children?: void,
};

export type SelectAndSelectButtonsSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    options: Array<SelectOption>,
    onChange?: (value: SelectOptionValue) => void,
    disabled?: boolean,
    style?: Object,
    className?: string,
    tabIndex?: number | string,
};

const SelectOptionValueProp = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
]);

const SelectAndSelectButtonsPropTypes = {
    onChange: PropTypes.func,
    value: SelectOptionValueProp,
    // We do more strict checks in render.
    options: PropTypes.arrayOf(PropTypes.shape({
        value: SelectOptionValueProp,
        label: PropTypes.node,
        disabled: PropTypes.bool,
    })).isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

const SelectAndSelectButtonsSyncedPropTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: SelectOptionValueProp,
        label: PropTypes.node,
        disabled: PropTypes.bool,
    })).isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    tabIndex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

const validateOptions = (options: Array<SelectOption>) => {
    if (options) {
        for (const option of options) {
            // These are hard errors because we can't guarantee that other values
            // will be JSON-encodable. And undefined gets coerced to the string
            // "undefined" which is confusing.
            if (typeof option.value === 'object' && option.value !== null) {
                return {isValid: false, reason: 'option value must be a string, number, boolean, null, or undefined. Got an object.'};
            }
        }
    }
    return {isValid: true};
};

function optionValueToString(value: SelectOptionValue): string {
    const valueJson = JSON.stringify(
        value === undefined ? {isUndefined: true} : {notUndefinedValue: value},
    );
    return valueJson;
}
function stringToOptionValue(valueJson: string): SelectOptionValue {
    const parsed = JSON.parse(valueJson);
    const value = parsed.isUndefined ? undefined : parsed.notUndefinedValue;
    return value;
}

module.exports = {
    SelectAndSelectButtonsPropTypes,
    SelectAndSelectButtonsSyncedPropTypes,
    validateOptions,
    optionValueToString,
    stringToOptionValue,
};
