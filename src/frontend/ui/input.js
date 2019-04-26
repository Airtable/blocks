// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('block_sdk/frontend/ui/react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const invariant = require('invariant');

export type InputValue = string | boolean | number;

type InputProps = {
    type?: string,
    placeholder?: string,
    onChange?: (SyntheticInputEvent<>) => void,
    style?: Object,
    className?: string,
    disabled?: boolean,
    spellCheck?: boolean,
    tabIndex?: number,
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

/** */
class Input extends React.Component<InputProps> {
    static validTypesSet = validTypesSet;

    static propTypes = {
        type: PropTypes.oneOf(Object.keys(validTypesSet)),
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        spellCheck: PropTypes.bool,
        tabIndex: PropTypes.number,
    };
    static defaultProps = {
        tabIndex: 0,
    };
    props: InputProps;
    _onChange: SyntheticInputEvent<> => void;
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

        const {disabled} = this.props;
        const defaultClassName = this._shouldUseDefaultClassesForType() ? 'styled-input rounded p1 darken1 text-dark normal' : '';

        const restOfProps = u.omit(this.props, Object.keys(Input.propTypes));

        return (
            <input
                ref={el => this._input = el}
                type={type}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={classNames(defaultClassName, {
                    quieter: disabled,
                    'link-quiet': !disabled,
                }, this.props.className)}
                disabled={disabled}
                onChange={this.props.onChange}
                spellCheck={this.props.spellCheck}
                tabIndex={this.props.tabIndex}
                {...restOfProps}
            />
        );
    }
}

module.exports = Input;
