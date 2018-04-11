// @flow
const u = require('client_server_shared/u');
const React = require('client/blocks/sdk/ui/react');
const classNames = require('classnames');
const KeyCodes = require('client_server_shared/key_codes');

// Disable the "react/prop-types" rule in this file, since it doesn't support this
// "shared/reusable prop types" pattern:
// https://github.com/yannickcr/eslint-plugin-react/issues/476
/* eslint-disable react/prop-types */
const {
    SelectAndSelectButtonsPropTypes,
    validateOptions,
    optionValueToString,
} = require('client/blocks/sdk/ui/select_and_select_buttons_helpers');

import type {
    SelectOptionValue,
    SelectAndSelectButtonsProps as SelectButtonsProps,
} from 'client/blocks/sdk/ui/select_and_select_buttons_helpers';

/** */
class SelectButtons extends React.Component {
    static propTypes = SelectAndSelectButtonsPropTypes;
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
        const {
            className,
            style,
            options,
            disabled,
            value,
            tabIndex = 0,
        } = this.props;

        // Check options here for a cleaner stack trace.
        // Also, even though options are required, still check if it's set because
        // the error is really ugly and covers up the prop type check.
        const validationResult = validateOptions(options);
        if (!validationResult.isValid) {
            throw new Error(`<SelectButtons> ${validationResult.reason}`);
        }

        const restOfProps = u.omit(this.props, Object.keys(SelectButtons.propTypes));

        return (
            <div
                className={classNames('flex rounded overflow-hidden p-half darken2', {
                    quieter: disabled,
                }, className)}
                style={style}
                {...restOfProps}>
                {options && options.map(option => {
                    const isSelected = option.value === value;
                    const isOptionDisabled = disabled || option.disabled;
                    return (
                        <div
                            key={optionValueToString(option.value)}
                            onClick={!isOptionDisabled && (() => this._onChange(option.value))}
                            onKeyDown={!isOptionDisabled && (e => this._onKeyDown(e, option.value))}
                            tabIndex={isOptionDisabled ? -1 : tabIndex}
                            className={classNames('flex-auto rounded p-half normal center no-outline', {
                                'link-unquiet pointer focusable': !isOptionDisabled,
                                'darken4 text-white': isSelected,
                                'text-dark': !isSelected,
                                quiet: !isSelected && !disabled,
                            })}
                            style={{
                                flexBasis: 0,
                            }}>
                            {option.label}
                        </div>
                    );
                })}
            </div>
        );
    }
}

module.exports = SelectButtons;
