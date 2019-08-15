// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import omit from 'lodash.omit';
import {invariant} from '../error_utils';

/**
 * @type {object}
 * @property {string} [type='text'] The `type` for the input. Defaults to `text`.
 * @property {string} [placeholder=''] The placeholder for the input.
 * @property {string} [value] The input's current value. Required if `onChange` is set.
 * @property {function} [onChange] A function to be called when the input changes. Required if `value` is set.
 * @property {object} [style={}] Additional styles to apply to the input.
 * @property {string} [className=''] Additional class names to apply to the input, separated by spaces.
 * @property {boolean} [disabled=false] If set to `true`, the input will be disabled.
 * @property {boolean} [required=false] If set to `true`, the input will be required.
 * @property {boolean} [spellCheck=false] If set to `true`, the `spellcheck` property will be set on the input.
 * @property {number | string} [tabIndex=0] The `tabindex` for the input.
 */
type InputProps = {
    type?: string,
    placeholder?: string,
    onChange?: (SyntheticInputEvent<>) => void,
    style?: Object,
    className?: string,
    disabled?: boolean,
    required?: boolean,
    spellCheck?: boolean,
    tabIndex?: number | string,
};

const validTypesSet = {
    checkbox: true,
    color: true,
    date: true,
    'datetime-local': true,
    email: true,
    hidden: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
};

const typesToExcludeFromDefaultClassesSet = {
    checkbox: true,
    color: true,
    range: true,
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
        type: PropTypes.oneOf(Object.keys(validTypesSet)),
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        spellCheck: PropTypes.bool,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    };
    static defaultProps = {
        tabIndex: 0,
    };
    props: InputProps;
    _onChange: (SyntheticInputEvent<>) => void;
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
    _shouldUseDefaultClassesForType(): boolean {
        return !this.props.type || !typesToExcludeFromDefaultClassesSet[this.props.type];
    }
    render() {
        let {type} = this.props;
        if (type && !validTypesSet[type]) {
            type = 'text';
        }

        const {disabled, required} = this.props;
        const defaultClassName = this._shouldUseDefaultClassesForType()
            ? 'styled-input rounded p1 darken1 text-dark normal'
            : '';

        const restOfProps = omit(this.props, Object.keys(Input.propTypes));

        return (
            <input
                ref={el => (this._input = el)}
                type={type}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={classNames(
                    defaultClassName,
                    {
                        quieter: disabled,
                        'link-quiet': !disabled,
                    },
                    this.props.className,
                )}
                disabled={disabled}
                required={required}
                onChange={this.props.onChange}
                spellCheck={this.props.spellCheck}
                tabIndex={this.props.tabIndex}
                {...restOfProps}
            />
        );
    }
}

export default Input;
