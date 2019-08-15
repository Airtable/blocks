// @flow
import classNames from 'classnames';
import * as React from 'react';
import omit from 'lodash.omit';
import {spawnError} from '../error_utils';

/* eslint-disable react/prop-types */
import {
    SelectAndSelectButtonsPropTypes,
    validateOptions,
    optionValueToString,
    type SelectOptionValue,
    type SelectAndSelectButtonsProps,
} from './select_and_select_buttons_helpers';

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

/** @typedef */
type SelectButtonsProps = SelectAndSelectButtonsProps;

/** */
class SelectButtons extends React.Component<SelectButtonsProps> {
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
        const {className, style, options, disabled, value, tabIndex = 0} = this.props;

        const validationResult = validateOptions(options);
        if (!validationResult.isValid) {
            throw spawnError('<SelectButtons> %s', validationResult.reason);
        }

        const restOfProps = omit(this.props, Object.keys(SelectButtons.propTypes));

        return (
            <div
                className={classNames(
                    'flex rounded overflow-hidden p-half darken2',
                    {
                        quieter: disabled,
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
                                className={classNames(
                                    'flex-auto rounded p-half normal center no-outline',
                                    {
                                        'link-unquiet pointer focusable': !isOptionDisabled,
                                        'darken4 text-white': isSelected,
                                        'text-dark': !isSelected,
                                        quiet: !isSelected && !disabled,
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
