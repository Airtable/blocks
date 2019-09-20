// @flow
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import {spawnError} from '../error_utils';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    SelectOptionValuePropType,
    type SelectOption,
    type SelectOptionValue,
} from './select_and_select_buttons_helpers';

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

export type SharedSelectButtonsProps = {|
    options: Array<SelectOption>,
    onChange?: (value: SelectOptionValue) => void,
    disabled?: boolean,
    className?: string,
    tabIndex?: number | string,
    style?: {[string]: mixed},
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
|};

/**
 * @typedef {object} SelectButtonsProps
 * @property {string | number | boolean | null} [value] The value of the selected option.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {function} [onChange] A function to be called when the selected option changes.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type SelectButtonsProps = {|
    value: SelectOptionValue,
    ...SharedSelectButtonsProps,
|};

export const sharedSelectButtonsPropTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: SelectOptionValuePropType,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ).isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
};

/** */
class SelectButtons extends React.Component<SelectButtonsProps> {
    static propTypes = {
        value: SelectOptionValuePropType,
        ...sharedSelectButtonsPropTypes,
    };
    props: SelectButtonsProps;
    _onChange(newValue: SelectOptionValue) {
        const {value, onChange} = this.props;
        if (onChange) {
            if (newValue !== value) {
                onChange(newValue);
            }
        }
    }
    _onKeyDown(e: KeyboardEvent, value: SelectOptionValue) {
        if (e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) {
            this._onChange(value);
        }
    }
    render() {
        const {className, style, options, disabled, value, tabIndex = 0} = this.props;

        const validationResult = validateOptions(options);
        if (!validationResult.isValid) {
            throw spawnError('<SelectButtons> %s', validationResult.reason);
        }

        const restOfProps = omit(this.props, Object.keys(SelectButtons.propTypes));

        return (
            <div
                className={cx(
                    baymax('flex rounded overflow-hidden p-half darken2'),
                    {
                        [baymax('quieter')]: disabled,
                    },
                    className,
                )}
                style={style}
                {...restOfProps}
            >
                {options &&
                    options.map(option => {
                        const isSelected = option.value === value;
                        const isOptionDisabled = disabled || option.disabled;
                        return (
                            <div
                                key={optionValueToString(option.value)}
                                onClick={!isOptionDisabled && (() => this._onChange(option.value))}
                                onKeyDown={
                                    !isOptionDisabled && (e => this._onKeyDown(e, option.value))
                                }
                                tabIndex={isOptionDisabled ? -1 : tabIndex}
                                className={cx(
                                    baymax('flex-auto rounded p-half normal center no-outline'),
                                    {
                                        [baymax(
                                            'link-unquiet pointer focusable',
                                        )]: !isOptionDisabled,
                                        [baymax('darken4 text-white')]: isSelected,
                                        [baymax('text-dark')]: !isSelected,
                                        [baymax('quiet')]: !isSelected && !disabled,
                                    },
                                )}
                                style={{
                                    flexBasis: 0,
                                }}
                            >
                                {option.label}
                            </div>
                        );
                    })}
            </div>
        );
    }
}

export default SelectButtons;
