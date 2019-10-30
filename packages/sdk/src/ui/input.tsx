/** @module @airtable/blocks/ui: Input */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
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
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

// Shared with `Input` and `InputSynced`.
/** */
export interface SharedInputProps extends TooltipAnchorProps {
    /** The `type` for the input. Defaults to `text`. */
    type?: EnumType<typeof ValidInputType>;
    /** The `disabled` attribute. */
    disabled?: boolean;
    /** The `required` attribute. */
    required?: boolean;
    /** The `spellcheck` attribute. */
    spellCheck?: boolean;
    /** The `tabindex` attribute. */
    tabIndex?: number;
    /** The `name` attribute. */
    name?: string;
    /** The `id` attribute. */
    id?: string;
    /** The `autoFocus` attribute. */
    autoFocus?: boolean;
    /** The `max` attribute. */
    max?: number | string;
    /** The `maxLength` attribute. */
    maxLength?: number;
    /** The placeholder for the input. */
    placeholder?: string;
    /** The `minLength` attribute. */
    minLength?: number;
    /** The `step` attribute. */
    step?: number | string;
    /** The `pattern` attribute. */
    pattern?: string;
    /** The `readOnly` attribute. */
    readOnly?: boolean;
    /** The `autoComplete` attribute. */
    autoComplete?: string;
    /** Additional styles to apply to the input. */
    style?: React.CSSProperties;
    /** Additional class names to apply to the input, separated by spaces. */
    className?: string;
    /** A function to be called when the input changes. */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
    /** A space separated list of label element IDs. */
    ['aria-labelledby']?: string;
    /** A space separated list of description element IDs. */
    ['aria-describedby']?: string;
    /** The `min` attribute. */
    min?: number | string;
}

export const ValidInputType = createEnum(
    'date',
    'datetime-local',
    'email',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week',
);
/** */
type ValidInputType = EnumType<typeof ValidInputType>;

// Shared with `Input` and `InputSynced`.
export const sharedInputPropTypes = {
    type: createPropTypeFromEnum(ValidInputType),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    spellCheck: PropTypes.bool,
    tabIndex: PropTypes.oneOfType([PropTypes.number]),
    autoFocus: PropTypes.bool,
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxLength: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minLength: PropTypes.number,
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pattern: PropTypes.string,
    readOnly: PropTypes.bool,
    autoComplete: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
};

/**
 * @typedef {object} InputProps
 */
interface InputProps extends SharedInputProps, InputStyleProps {
    /** The input's current value. */
    value: string;
}

/** */
export interface InputStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {}

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

export const inputStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * An input component. A wrapper around `<input>` that fits in with Airtable's user interface.
 *
 * @example
 * ```js
 * import {Input} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function HelloSomeone() {
 *     const [value, setValue] = useState('world');
 *
 *     return (
 *         <Fragment>
 *             <div>Hello, {value}!</div>
 *
 *             <Input
 *                 value={value}
 *                 onChange={(event) => setValue(event.target.value)}
 *                 placeholder="world"
 *             />
 *         </Fragment>
 *     );
 * }
 * ```
 */
function Input(props: InputProps, ref: React.Ref<HTMLInputElement>) {
    const {
        type = ValidInputType.text,
        value,
        placeholder,
        onMouseEnter,
        onMouseLeave,
        onClick,
        onChange,
        style,
        className,
        disabled,
        required,
        spellCheck,
        tabIndex,
        id,
        name,
        autoFocus,
        max,
        maxLength,
        min,
        minLength,
        step,
        pattern,
        readOnly,
        autoComplete,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        ...styleProps
    } = props;

    const formFieldId = useFormFieldId();
    const classNameForStyleProps = useStyledSystem({width: '100%', ...styleProps}, styleParser);

    return (
        <input
            ref={ref}
            value={value}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            spellCheck={spellCheck}
            tabIndex={tabIndex}
            id={id || formFieldId}
            name={name}
            autoFocus={autoFocus}
            max={max}
            maxLength={maxLength}
            min={min}
            minLength={minLength}
            step={step}
            pattern={pattern}
            readOnly={readOnly}
            autoComplete={autoComplete}
            onChange={onChange}
            // TODO (stephen): remove tooltip anchor props
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={style}
            className={cx(
                baymax('styled-input rounded p1 darken1 text-dark normal'),
                {
                    [baymax('quieter')]: !!disabled,
                    [baymax('link-quiet')]: !disabled,
                },
                classNameForStyleProps,
                className,
            )}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        />
    );
}

const ForwardedRefInput = React.forwardRef(Input);

ForwardedRefInput.propTypes = {
    value: PropTypes.string.isRequired,
    ...sharedInputPropTypes,
    ...inputStylePropTypes,
};

ForwardedRefInput.displayName = 'Input';

export default ForwardedRefInput;
