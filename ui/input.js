// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const classNames = require('classnames');

const {PropTypes} = React;

export type InputValue = string | boolean | number;

type InputProps = {
    value: mixed,
    type?: string,
    placeholder?: string,
    onChange?: InputValue => void,
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

class Input extends React.Component {
    static propTypes = {
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number,
        ]),
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
    _onChange: SyntheticInputEvent => void;
    constructor(props: InputProps) {
        super(props);

        this._onChange = this._onChange.bind(this);
    }
    _isCheckbox() {
        return this.props.type === 'checkbox';
    }
    _shouldUseDefaultClassesForType(): boolean {
        return !this.props.type || !typesToExcludeFromDefaultClassesSet[this.props.type];
    }
    _onChange(e: SyntheticInputEvent) {
        const value: InputValue = this._isCheckbox() ?
            e.target.checked :
            e.target.value;

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    render() {
        let value = this.props.value;
        if (value === undefined) {
            value = this._isCheckbox() ? false : '';
        }

        const valueObj = this._isCheckbox() ? {checked: value} : {value};

        let {type} = this.props;
        if (type && !validTypesSet[type]) {
            type = 'text';
        }

        const {disabled} = this.props;
        const defaultClassName = this._shouldUseDefaultClassesForType() ? 'styled-input rounded p1 darken1 text-dark normal' : '';

        const restOfProps = _.omit(this.props, Object.keys(Input.propTypes));

        return (
            <input
                type={type}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={classNames(defaultClassName, {
                    'quieter': disabled,
                    'link-quiet': !disabled,
                }, this.props.className)}
                disabled={disabled}
                onChange={this._onChange}
                spellCheck={this.props.spellCheck}
                tabIndex={this.props.tabIndex}
                {...valueObj}
                {...restOfProps}
            />
        );
    }
}

Input.validTypesSet = validTypesSet;

module.exports = Input;
