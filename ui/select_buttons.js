// @flow
const u = require('client_server_shared/u');
const React = require('client/blocks/sdk/ui/react');
const classNames = require('classnames');
const KeyCodes = require('client_server_shared/key_codes');

const {SelectAndSelectButtonsPropTypes, validateOptions} = require('client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers');

import type {SelectAndSelectButtonsProps as SelectButtonsProps} from 'client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers';

class SelectButtons extends React.Component {
    static propTypes = SelectAndSelectButtonsPropTypes;
    props: SelectButtonsProps;
    _onChange(valueJson: string) {
        const {value, onChange} = this.props;
        if (onChange) {
            const parsedJson = JSON.parse(valueJson);
            if (parsedJson !== value) {
                onChange(JSON.parse(valueJson));
            }
        }
    }
    _onKeyDown(e: KeyboardEvent, valueJson: string) {
        if (e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) {
            this._onChange(valueJson);
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
                    const valueJson = JSON.stringify(option.value);
                    const isSelected = option.value === value;
                    const isOptionDisabled = disabled || option.disabled;
                    return (
                        <div
                            key={valueJson}
                            onClick={!isOptionDisabled && (() => this._onChange(valueJson))}
                            onKeyDown={!isOptionDisabled && (e => this._onKeyDown(e, valueJson))}
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
