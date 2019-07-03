// @flow

import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import {invariant} from '../error_utils';

const themes = Object.freeze({
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    GRAY: 'gray',
});

export type ToggleTheme = $Values<typeof themes>;

const classNamesByTheme = {
    [themes.GREEN]: 'green',
    [themes.BLUE]: 'blue',
    [themes.RED]: 'red',
    [themes.YELLOW]: 'yellow',
    [themes.GRAY]: 'gray',
};

/**
 * @typedef {object} ToggleProps
 * @property {boolean} value If set to `true`, the switch will be toggled on.
 * @property {function} [onChange] A function to be called when the switch is toggled.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the switch.
 * @property {React.Node} [label] The label node for the switch.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {string} [id] The ID of the switch element.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {number | string} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type ToggleProps = {
    value: boolean,
    onChange?: boolean => void,
    disabled?: boolean,
    label?: React.Node,
    theme?: ToggleTheme,
    id?: string,
    className?: string,
    style?: Object,
    tabIndex?: number | string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
};

/**
 * A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.
 *
 * @example
 * import {Toggle} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function Block() {
 *     const [isEnabled, setIsEnabled] = useState(false);
 *     return (
 *         <Toggle
 *             value={isEnabled}
 *             onChange={setIsEnabled}
 *             label={isEnabled ? 'On' : 'Off'}
 *         />
 *     );
 * }
 */
class Toggle extends React.Component<ToggleProps> {
    static themes = themes;
    static propTypes = {
        value: PropTypes.bool.isRequired,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        label: PropTypes.node,
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        'aria-label': PropTypes.string,
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
    };
    static defaultProps = {
        tabIndex: 0,
        theme: themes.GREEN,
    };
    _container: HTMLElement | null;
    _onKeyDown: (e: SyntheticKeyboardEvent<HTMLElement>) => void;
    _toggleValue: () => void;
    constructor(props: ToggleProps) {
        super(props);
        this._container = null;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._toggleValue = this._toggleValue.bind(this);
    }
    focus() {
        invariant(this._container, 'No toggle to focus');
        this._container.focus();
    }
    blur() {
        invariant(this._container, 'No toggle to blur');
        this._container.blur();
    }
    click() {
        invariant(this._container, 'No toggle to click');
        this._container.click();
    }
    _onKeyDown(e: SyntheticKeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            this._toggleValue();
        }
    }
    _toggleValue() {
        const {value, onChange, disabled} = this.props;
        if (onChange && !disabled) {
            onChange(!value);
        }
    }
    render() {
        const {value, disabled, label, theme, id, className, style, tabIndex} = this.props;

        const toggleHeight = 12;
        const togglePadding = 2;
        const toggleClassNameForTheme = theme && classNamesByTheme[theme];

        return (
            <label className="flex-inline">
                <div
                    ref={el => (this._container = el)}
                    onClick={this._toggleValue}
                    onKeyDown={this._onKeyDown}
                    id={id}
                    className={classNames(
                        'focusable flex-inline items-center p-half rounded',
                        {
                            'pointer link-quiet': !disabled,
                            'noevents quieter': disabled,
                        },
                        className,
                    )}
                    style={style}
                    tabIndex={disabled ? -1 : tabIndex}
                    aria-label={this.props['aria-label']}
                    aria-labelledby={this.props['aria-labelledby']}
                    aria-describedby={this.props['aria-describedby']}
                >
                    <div
                        className={classNames('pill flex animate flex-none', {
                            'justify-start darken2': !value,
                            'justify-end': value,
                            [toggleClassNameForTheme || '']: value,
                        })}
                        style={{
                            height: toggleHeight,
                            width: toggleHeight * 1.6,
                            padding: togglePadding,
                        }}
                    >
                        <div
                            className="white circle flex-none"
                            style={{width: toggleHeight - 2 * togglePadding}}
                        />
                    </div>
                    {label && <div className="flex-auto ml1 normal text-dark">{label}</div>}
                </div>
            </label>
        );
    }
}

export default Toggle;
