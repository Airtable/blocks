// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {invariant} from '../error_utils';
import {baymax} from './baymax_utils';
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

export type SharedInputProps = {|
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
        | 'week',
    placeholder?: string,
    onChange?: (e: SyntheticInputEvent<HTMLInputElement>) => mixed,
    style?: {[string]: mixed},
    className?: string,
    disabled?: boolean,
    required?: boolean,
    spellCheck?: boolean,
    tabIndex?: number | string,
    name?: string,
    id?: string,
    autoFocus?: boolean,
    max?: number | string,
    maxLength?: number,
    min?: number | string,
    minLength?: number,
    step?: number | string,
    pattern?: string,
    readOnly?: boolean,
    autoComplete?: string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
|};

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

export const sharedInputPropTypes = {
    type: PropTypes.oneOf(Object.keys(validTypesSet)),
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    spellCheck: PropTypes.bool,
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    autoFocus: PropTypes.bool,
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxLength: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minLength: PropTypes.number,
    step: PropTypes.oneOfType([PropTypes.number, PropTypes.sstring]),
    pattern: PropTypes.string,
    readOnly: PropTypes.bool,
    autoComplete: PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
};

/**
 * @typedef {object} InputProps
 * @property {string} value The input's current value.
 * @property {function} onChange A function to be called when the input changes.
 * @property {string} [type='text'] The `type` for the input. Defaults to `text`.
 * @property {string} [placeholder] The placeholder for the input.
 * @property {object} [style] Additional styles to apply to the input.
 * @property {string} [className] Additional class names to apply to the input, separated by spaces.
 * @property {boolean} [disabled] The `disabled` attribute.
 * @property {boolean} [required] The `required` attribute.
 * @property {boolean} [spellCheck] The `spellcheck` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {string} [id] The `id` attribute.
 * @property {boolean} [autoFocus] The `autoFocus` attribute.
 * @property {number | string} [max] The `max` attribute.
 * @property {number} [maxLength] The `maxLength` attribute.
 * @property {number | string} [min] The `min` attribute.
 * @property {number} [minLength] The `minLength` attribute.
 * @property {number | string} [step] The `step` attribute.
 * @property {string} [pattern] The `pattern` attribute.
 * @property {boolean} [readOnly] The `readOnly` attribute.
 * @property {string} [autoComplete] The `autoComplete` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type InputProps = {|
    value: string,
    ...SharedInputProps,
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
 * An input component. A wrapper around `<input>` that fits in with Airtable's user interface.
 *
 * @example
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
 */
class Input extends React.Component<InputProps> {
    static validTypesSet = validTypesSet;
    static propTypes = {
        value: PropTypes.string,
        ...sharedInputPropTypes,
    };
    props: InputProps;
    _onChange: (e: SyntheticInputEvent<HTMLInputElement>) => void;
    _input: HTMLInputElement | null;
    constructor(props: InputProps) {
        super(props);
        this._input = null;
    }
    focus() {
        invariant(this._input, 'No input to focus');
        this._input.focus();
    }
    blur() {
        invariant(this._input, 'No input to blur');
        this._input.blur();
    }
    click() {
        invariant(this._input, 'No input to click');
        this._input.click();
    }
    select() {
        invariant(this._input, 'No input to select');
        this._input.select();
    }
    render() {
        const {
            type,
            placeholder,
            onChange,
            style,
            className,
            disabled,
            required,
            spellCheck,
            tabIndex,
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
        const defaultClassName = 'styled-input rounded p1 darken1 text-dark normal';

        return (
            <input
                ref={el => (this._input = el)}
                type={type}
                placeholder={placeholder}
                style={style}
                className={cx(
                    baymax(defaultClassName),
                    {
                        [baymax('quieter')]: disabled,
                        [baymax('link-quiet')]: !disabled,
                    },
                    className,
                )}
                disabled={disabled}
                required={required}
                onChange={onChange}
                spellCheck={spellCheck}
                tabIndex={tabIndex}
                autoFocus={autoFocus}
                max={max}
                maxLength={maxLength}
                min={min}
                minLength={minLength}
                step={step}
                pattern={pattern}
                readOnly={readOnly}
                autoComplete={autoComplete}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
            />
        );
    }
}

export default withStyledSystem<
    InputProps,
    StyleProps,
    Input,
    {|
        validTypesSet: typeof validTypesSet,
    |},
>(Input, styleParser, stylePropTypes, {
    width: '100%',
});
