/** @module @airtable/blocks/ui: Select */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {spawnError} from '../error_utils';
import useFormFieldId from './use_form_field_id';
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
import {Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {baymax} from './baymax_utils';
import {
    validateOptions,
    optionValueToString,
    stringToOptionValue,
    selectOptionValuePropType,
    SelectOptionValue,
    SelectOption,
} from './select_and_select_buttons_helpers';
import useStyledSystem from './use_styled_system';

const styleForChevron = {
    // eslint-disable-next-line quotes
    backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 6px)',
    paddingRight: 22,
};

/** */
interface SelectStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
    /** */
    display?: Prop<'inline-flex' | 'flex' | 'none'>;
}

// Shared with `Select`, `SelectSynced` and `ModelPickerSelect` and `(Table/View/Field)Picker(Synced)`.
/** */
export interface SharedSelectBaseProps extends TooltipAnchorProps, SelectStyleProps {
    /** Additional class names to apply to the select. */
    className?: string;
    /** The `autoFocus` attribute. */
    autoFocus?: boolean;
    /** The `id` attribute. */
    id?: string;
    /** The `name` attribute. */
    name?: string;
    /** The `tabindex` attribute. */
    tabIndex?: number;
    /** If set to `true`, the user cannot interact with the select. */
    disabled?: boolean;
    /** Additional styles to apply to the select. */
    style?: React.CSSProperties;
    /** The `aria-label` attribute. Use this if the select is not referenced by a label element. */
    ['aria-label']?: string;
    /** A space separated list of label element IDs. */
    ['aria-labelledby']?: string;
    /** A space separated list of description element IDs. */
    ['aria-describedby']?: string;
}

export const selectStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

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
    ...selectStylePropTypes,
};

// Shared with `Select` and `SelectSynced`.
/** */
export interface SharedSelectProps extends SharedSelectBaseProps {
    /** The list of select options. */
    options: Array<SelectOption>;
    /** A function to be called when the selected option changes. */
    onChange?: (value: SelectOptionValue) => unknown;
}

// Shared with `Select` and `SelectSynced`.
export const sharedSelectPropTypes = {
    // We do more strict checks in render.
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: selectOptionValuePropType,
            label: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
        }).isRequired,
    ).isRequired,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * @typedef {object} SelectProps
 */
export interface SelectProps extends SharedSelectProps {
    /** The value of the selected option. */
    value: SelectOptionValue;
}

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

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
function Select(props: SelectProps, ref: React.Ref<HTMLSelectElement>) {
    const {
        value,
        options: originalOptions = [],
        autoFocus,
        disabled,
        id,
        name,
        tabIndex,
        onChange,
        // TODO (stephen): remove tooltip anchor props
        onMouseEnter,
        onMouseLeave,
        onClick,
        className,
        style,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        ...styleProps
    } = props;
    const formFieldId = useFormFieldId();
    const classNameForStyleProps = useStyledSystem(
        {
            width: '100%',
            ...styleProps,
        },
        styleParser,
    );

    function _onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (onChange) {
            const newValue = stringToOptionValue(e.currentTarget.value);
            onChange(newValue);
        }
    }

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
        console.warn(`No option for selected value in <Select>: ${String(value)}`.substr(0, 100));
    }
    options.push(...originalOptions);

    return (
        <select
            ref={ref}
            value={optionValueToString(value)}
            onChange={_onChange}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            autoFocus={autoFocus}
            disabled={disabled}
            id={id || formFieldId}
            name={name}
            tabIndex={tabIndex}
            className={cx(
                baymax('styled-input px1 rounded normal no-outline darken1 text-dark'),
                {
                    [baymax('link-quiet pointer')]: !disabled,
                    [baymax('quieter')]: !!disabled,
                },
                classNameForStyleProps,
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

const ForwardedRefSelect = React.forwardRef(Select);

ForwardedRefSelect.displayName = 'Select';

ForwardedRefSelect.propTypes = {
    value: selectOptionValuePropType,
    ...sharedSelectPropTypes,
};

export default ForwardedRefSelect;
