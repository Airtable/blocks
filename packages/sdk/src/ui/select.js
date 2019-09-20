// @flow
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {invariant, spawnError} from '../error_utils';
import withStyledSystem from './with_styled_system';
import {
    maxWidth,
    maxWidthPropTypes,
    type MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    type MinWidthProps,
    width,
    widthPropTypes,
    type WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    stringToOptionValue,
    SelectOptionValuePropType,
    type SelectOptionValue,
    type SelectOption,
} from './select_and_select_buttons_helpers';

const styleForChevron = {
    // eslint-disable-next-line quotes
    backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 6px)',
    paddingRight: 22,
};

export type SharedSelectProps = {|
    options: Array<SelectOption>,
    onChange?: (value: SelectOptionValue) => mixed,
    autoFocus?: boolean,
    disabled?: boolean,
    id?: string,
    name?: string,
    tabIndex?: number | string,
    className?: string,
    style?: {[string]: mixed},
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
|};

export const sharedSelectPropTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: SelectOptionValuePropType,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ).isRequired,
    onChange: PropTypes.func,
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
};

/**
 * @typedef {object} SelectProps
 * @property {string | number | boolean | null} [value] The value of the selected option.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {function} [onChange] A function to be called when the selected option changes.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
export type SelectProps = {|
    value: SelectOptionValue,
    ...SharedSelectProps,
|};


export type StyleProps = {|
    ...MaxWidthProps,
    ...MinWidthProps,
    ...WidthProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

export const stylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

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
    static propTypes = {
        value: SelectOptionValuePropType,
        ...sharedSelectPropTypes,
    };
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
        const {
            value,
            options: originalOptions = [],
            autoFocus,
            disabled,
            id,
            name,
            tabIndex,
            className,
            style,
            'aria-describedby': ariaDescribedBy,
            'aria-labelledby': ariaLabelledBy,
        } = this.props;

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
                value={optionValueToString(value)}
                onChange={this._onChange}
                autoFocus={autoFocus}
                disabled={disabled}
                id={id}
                name={name}
                tabIndex={tabIndex}
                className={cx(
                    baymax('styled-input p1 rounded normal no-outline darken1 text-dark'),
                    {
                        [baymax('link-quiet pointer')]: !disabled,
                        [baymax('quieter')]: disabled,
                    },
                    className,
                )}
                style={{
                    ...styleForChevron,
                    ...style,
                }}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
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

export default withStyledSystem<SelectProps, StyleProps, Select, {}>(
    Select,
    styleParser,
    stylePropTypes,
    {
        width: '100%',
    },
);
