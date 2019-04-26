// @flow
const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');
const invariant = require('invariant');
const React = require('block_sdk/frontend/ui/react');
const classNames = require('classnames');

const {
    SelectAndSelectButtonsPropTypes,
    validateOptions,
    optionValueToString,
    stringToOptionValue,
} = require('block_sdk/frontend/ui/select_and_select_buttons_helpers');

import type {SelectAndSelectButtonsProps as SelectProps} from 'block_sdk/frontend/ui/select_and_select_buttons_helpers';

const styleForChevron = {
    // eslint-disable-next-line quotes
    backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 6px)',
    paddingRight: 22,
};

// This component isn't great right now. It's just a styled <select> with a really hacky
// way of getting the chevron arrow to show up. It also behaves weirdly when you give it
// a margin (I think this is a limitation of <select>). We should probably replace it with
// something like react-select, which would give us nice features like rendering custom
// elements for options (e.g. for field type icons) and typeahead search.
/** */
class Select extends React.Component<SelectProps> {
    static propTypes = SelectAndSelectButtonsPropTypes;
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
            className,
            style,
            options: originalOptions = [],
            value,
            // Filter these out so they're not
            // included in restOfProps:
            children, // eslint-disable-line no-unused-vars
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;

        // Check options here for a cleaner stack trace.
        // Also, even though options are required, still check if it's set because
        // the error is really ugly and covers up the prop type check.
        const validationResult = validateOptions(originalOptions);
        if (!validationResult.isValid) {
            throw new Error(`<Select> ${validationResult.reason}`);
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
            console.warn(`No option for selected value in <Select>: ${String(value)}`.substr(0, 100)); // eslint-disable-line no-console
        }
        options.push(...originalOptions);

        return (
            <select
                ref={el => this._select = el}
                className={classNames('styled-input p1 rounded normal no-outline darken1 text-dark', {
                    'link-quiet pointer': !this.props.disabled,
                    quieter: this.props.disabled,
                }, className)}
                style={{
                    ...styleForChevron,
                    ...style,
                }}
                value={optionValueToString(value)}
                onChange={this._onChange}
                {...restOfProps}>
                {options && options.map(option => {
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

module.exports = Select;
