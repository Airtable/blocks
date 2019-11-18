/** @module @airtable/blocks/ui: Input */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useTheme from './theme/use_theme';
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
import {ControlSizeProp, controlSizePropType, ControlSize, useInputSize} from './control_sizes';

/** @internal */
type InputVariant = EnumType<typeof InputVariant>;
const InputVariant = createEnum('default');

/** @internal */
function useInputVariant(variant: InputVariant = InputVariant.default) {
    const {inputVariants} = useTheme();
    return inputVariants[variant];
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

/**
 * Style props shared between the {@link Input} and {@link InputSynced} components. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
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
 * Props shared between the {@link Input} and {@link InputSynced} components.
 *
 * @noInheritDoc
 */
export interface SharedInputProps extends InputStyleProps, TooltipAnchorProps<HTMLInputElement> {
    /** The size of the input. Defaults to `default`. */
    size?: ControlSizeProp;
    /** The `type` for the input. Defaults to `text`. */
    type?: EnumType<typeof SupportedInputType>;
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

export const SupportedInputType = createEnum(
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
/**
 * Supported types for the {@link Input} component. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types|MDN} for more information.
 */
type SupportedInputType = EnumType<typeof SupportedInputType>;

export const sharedInputPropTypes = {
    size: controlSizePropType,
    type: createPropTypeFromEnum(SupportedInputType),
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
    ...inputStylePropTypes,
    ...tooltipAnchorPropTypes,
};

/**
 * Props for the {@link Input} component. Also accepts:
 * * {@link InputStyleProps}
 */
interface InputProps extends SharedInputProps {
    /** The input's current value. */
    value: string;
}

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
        size = ControlSize.default,
        type = SupportedInputType.text,
        value,
        placeholder,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
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
    const classNameForInputVariant = useInputVariant();
    const classNameForInputSize = useInputSize(size);
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
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={style}
            className={cx(
                classNameForInputSize,
                classNameForInputVariant,
                classNameForStyleProps,
                className,
            )}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        />
    );
}

const ForwardedRefInput = React.forwardRef<HTMLInputElement, InputProps>(Input);

ForwardedRefInput.propTypes = {
    value: PropTypes.string.isRequired,
    ...sharedInputPropTypes,
};

ForwardedRefInput.displayName = 'Input';

export default ForwardedRefInput;
