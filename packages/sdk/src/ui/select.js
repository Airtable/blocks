// @flow
import classNames from 'classnames';
import * as React from 'react';
import {invariant, spawnError} from '../error_utils';
import {
    SelectAndSelectButtonsPropTypes,
    validateOptions,
    optionValueToString,
    stringToOptionValue,
    type SelectAndSelectButtonsProps,
} from './select_and_select_buttons_helpers';

const styleForChevron = {
    // eslint-disable-next-line quotes
    backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 6px)',
    paddingRight: 22,
};

/**
 * @typedef {object} SelectProps
 * @property {function} [onChange] A function to be called when the selected option changes.
 * @property {string | number | boolean | null} [value] The value of the selected option.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the button.
 * @property {string} [id] The ID of the select element.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {number | string} [tabIndex] Indicates if the select can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type SelectProps = SelectAndSelectButtonsProps;


/**
 * Dropdown menu component. A wrapper around `<select>` that fits in with Airtable's user interface.
 *
 * @example
 * import {Select} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function ColorPicker() {
 *     const [value, setValue] = useState(null);
 *     return (
 *         <label>
 *             <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
 *             <Select
 *                 onChange={newValue => setValue(newValue)}
 *                 value={value}
 *                 options={[
 *                     {value: null, label: 'Pick a color...', disabled: true},
 *                     {value: 'red', label: 'red'},
 *                     {value: 'green', label: 'green'},
 *                     {value: 'blue', label: 'blue'},
 *                 ]}
 *             />
 *         </label>
 *     );
 * }
 */
class Select extends React.Component<SelectProps> {
    static propTypes = SelectAndSelectButtonsPropTypes;
    props: SelectProps;
    _select: HTMLSelectElement | null;
    constructor(props: SelectProps) {
        super(props);

        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    _onChange: (e: Event) => void;
    _onChange(e: Event) {
        const {onChange} = this.props;
        if (onChange) {
            invariant(e.target instanceof HTMLSelectElement, 'bad input');
            const value = stringToOptionValue(e.target.value);
            onChange(value);
        }
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
    }
    render() {
        const {id, className, style, options: originalOptions = [], value, disabled} = this.props;

        const validationResult = validateOptions(originalOptions);
        if (!validationResult.isValid) {
            throw spawnError('<Select> %s', validationResult.reason);
        }

        let didFindOptionMatchingValue = false;
        for (const option of originalOptions) {
            if (option.value === value) {
                didFindOptionMatchingValue = true;
                break;
            }
        }
        const options = [];
        if (!didFindOptionMatchingValue) {
            options.push({
                label: '',
                value,
                disabled: true,
            });
            // eslint-disable-next-line no-console
            console.warn(
                `No option for selected value in <Select>: ${String(value)}`.substr(0, 100),
            );
        }
        options.push(...originalOptions);

        return (
            <select
                ref={el => (this._select = el)}
                id={id}
                className={classNames(
                    'styled-input p1 rounded normal no-outline darken1 text-dark',
                    {
                        'link-quiet pointer': !disabled,
                        quieter: disabled,
                    },
                    className,
                )}
                style={{
                    ...styleForChevron,
                    ...style,
                }}
                value={optionValueToString(value)}
                onChange={this._onChange}
                disabled={disabled}
            >
                {options &&
                    options.map(option => {
                        const valueJson = optionValueToString(option.value);
                        return (
                            <option key={valueJson} value={valueJson} disabled={option.disabled}>
                                {option.label}
                            </option>
                        );
                    })}
            </select>
        );
    }
}

export default Select;
