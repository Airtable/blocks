/** @module @airtable/blocks/ui: Select */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import withStyledSystem from './with_styled_system';
import {FormFieldIdContext} from './use_form_field_id';
import {
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    stringToOptionValue,
    SelectOptionValuePropType,
    SelectOptionValue,
    SelectOption,
} from './select_and_select_buttons_helpers';

const styleForChevron = {
    // eslint-disable-next-line quotes
    backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 6px)',
    paddingRight: 22,
};

// Shared with `Select`, `SelectSynced` and `ModelPickerSelect` and `(Table/View/Field)Picker(Synced)`.
export type SharedSelectBaseProps = {
    className?: string;
    autoFocus?: boolean;
    id?: string;
    name?: string;
    tabIndex?: number;
    disabled?: boolean;
    style?: React.CSSProperties;
    ['aria-label']?: string;
    ['aria-labelledby']?: string;
    ['aria-describedby']?: string;
} & (TooltipAnchorProps);

// Shared with `Select`, `SelectSynced`, `ModelPickerSelect` and `(Table/View/Field)Picker(Synced)`
export const sharedSelectBasePropTypes = {
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
};

// Shared with `Select` and `SelectSynced`.
export type SharedSelectProps = {
    options: Array<SelectOption>;
    onChange?: (value: SelectOptionValue) => unknown;
} & (SharedSelectBaseProps);

// Shared with `Select` and `SelectSynced`.
export const sharedSelectPropTypes = {
    // We do more strict checks in render.
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: SelectOptionValuePropType,
            label: PropTypes.node,
            disabled: PropTypes.bool,
        }),
    ).isRequired,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * @typedef {object} SelectProps
 * @property {string | number | boolean | null} [value] The value of the selected option.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {Function} [onChange] A function to be called when the selected option changes.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-label] The `aria-label` attribute. Use this if the select is not referenced by a label element.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
export type SelectProps = {value: SelectOptionValue} & (SharedSelectProps);

// This component isn't great right now. It's just a styled <select> with a really hacky
// way of getting the chevron arrow to show up. It also behaves weirdly when you give it
// a margin (I think this is a limitation of <select>). We should probably replace it with
// something like react-select, which would give us nice features like rendering custom
// elements for options (e.g. for field type icons) and typeahead search.

export type StyleProps = (MaxWidthProps) &
    (MinWidthProps) &
    (WidthProps) &
    (FlexItemSetProps) &
    (PositionSetProps) &
    (MarginProps);

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
 * ```js
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
 * ```
 */
export class Select extends React.Component<SelectProps> {
    /** @hidden */
    static propTypes = {
        value: SelectOptionValuePropType,
        ...sharedSelectPropTypes,
    };
    /** */
    static contextType = FormFieldIdContext;
    /** @internal */
    _select: HTMLSelectElement | null;
    /** @hidden */
    constructor(props: SelectProps) {
        super(props);

        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    /** @internal */
    _onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const {onChange} = this.props;
        if (onChange) {
            if (!(e.target instanceof HTMLSelectElement)) {
                throw spawnInvariantViolationError('bad input');
            }
            const value = stringToOptionValue(e.target.value);
            onChange(value);
        }
    }
    /** */
    focus() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to focus');
        }
        this._select.focus();
    }
    /** */
    blur() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to blur');
        }
        this._select.blur();
    }
    /** */
    click() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to click');
        }
        this._select.click();
    }
    /** @hidden */
    render() {
        const {
            value,
            options: originalOptions = [],
            autoFocus,
            disabled,
            id,
            name,
            tabIndex,
            // TODO (stephen): remove tooltip anchor props
            onMouseEnter,
            onMouseLeave,
            onClick,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-describedby': ariaDescribedBy,
            'aria-labelledby': ariaLabelledBy,
        } = this.props;
        const contextId = this.context;

        // Check options here for a cleaner stack trace.
        // Also, even though options are required, still check if it's set because
        // the error is really ugly and covers up the prop type check.
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
            // Since there's no option that matches the given value, let's add an
            // empty option at the top and log a warning.
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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                autoFocus={autoFocus}
                disabled={disabled}
                id={id || contextId}
                name={name}
                tabIndex={tabIndex}
                className={cx(
                    baymax('styled-input px1 rounded normal no-outline darken1 text-dark'),
                    {
                        [baymax('link-quiet pointer')]: !disabled,
                        [baymax('quieter')]: !!disabled,
                    },
                    className,
                )}
                style={{
                    // TODO (stephen): switch to size API
                    height: 35,
                    ...styleForChevron,
                    ...style,
                }}
                aria-label={ariaLabel}
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
