/** @module @airtable/blocks/ui: Input */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {spawnInvariantViolationError} from '../error_utils';
import {baymax} from './baymax_utils';
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

// Shared with `Input` and `InputSynced`.
/** */
export interface SharedInputProps extends TooltipAnchorProps {
    /** The `type` for the input. Defaults to `text`. */
    type?:
        | 'text'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'month'
        | 'number'
        | 'password'
        | 'search'
        | 'tel'
        | 'time'
        | 'url'
        | 'week';
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

const validTypesSet = Object.freeze({
    date: true,
    'datetime-local': true,
    email: true,
    month: true,
    number: true,
    password: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
});

// Shared with `Input` and `InputSynced`.
export const sharedInputPropTypes = {
    type: PropTypes.oneOf(Object.keys(validTypesSet)),
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
interface InputProps extends SharedInputProps {
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
export class Input extends React.Component<InputProps> {
    /** */
    static validTypesSet = validTypesSet;
    /** @hidden */
    static propTypes = {
        value: PropTypes.string,
        ...sharedInputPropTypes,
    };
    /** */
    static contextType = FormFieldIdContext;
    /** @internal */
    _input: HTMLInputElement | null;
    /** @hidden */
    constructor(props: InputProps) {
        super(props);
        this._input = null;
    }
    /** */
    focus() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to focus');
        }
        this._input.focus();
    }
    /** */
    blur() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to blur');
        }
        this._input.blur();
    }
    /** */
    click() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to click');
        }
        this._input.click();
    }
    /** */
    select() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to select');
        }
        this._input.select();
    }
    /** @hidden */
    render() {
        const {
            type,
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
        } = this.props;
        const controlId = this.context;
        const defaultClassName = 'styled-input rounded p1 darken1 text-dark normal';

        return (
            <input
                ref={el => (this._input = el)}
                value={value}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                spellCheck={spellCheck}
                tabIndex={tabIndex}
                id={id || controlId}
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
                    baymax(defaultClassName),
                    {
                        [baymax('quieter')]: !!disabled,
                        [baymax('link-quiet')]: !disabled,
                    },
                    className,
                )}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
            />
        );
    }
}

export default withStyledSystem<
    InputProps,
    InputStyleProps,
    Input,
    {validTypesSet: typeof validTypesSet}
>(Input, styleParser, inputStylePropTypes, {
    width: '100%',
});
