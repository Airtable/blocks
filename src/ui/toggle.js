// @flow

import PropTypes from 'prop-types';
import classNames from 'classnames';
import invariant from 'invariant';
import * as React from 'react';

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

const onEnterOrSpaceKey = handler => {
    return function(e) {
        if ((e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) && handler) {
            e.preventDefault();
            handler();
        }
    };
};

const themes = Object.freeze({
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    GRAY: 'gray',
});

const classNamesByTheme = {
    [themes.GREEN]: 'green',
    [themes.BLUE]: 'blue',
    [themes.RED]: 'red',
    [themes.YELLOW]: 'yellow',
    [themes.GRAY]: 'gray',
};

/** @typedef */
type ToggleProps = {
    value: boolean,
    label?: React.Node,
    theme?: string,
    onChange?: boolean => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
    tabIndex?: number | string,
};

/** */
class Toggle extends React.Component<ToggleProps> {
    static themes = themes;
    static propTypes = {
        value: PropTypes.bool.isRequired,
        label: PropTypes.node,
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    };
    static defaultProps = {
        tabIndex: 0,
        theme: themes.GREEN,
    };
    _toggleValue: () => void;
    _container: HTMLElement | null;
    constructor(props: ToggleProps) {
        super(props);

        this._container = null;
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
    _toggleValue() {
        const {value, onChange} = this.props;
        if (onChange) {
            onChange(!value);
        }
    }
    render() {
        const {
            value,
            label,
            theme,
            disabled,
            className,
            style,
            tabIndex,
            // Filter these out so they're not
            // included in restOfProps:
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;

        const onClick = disabled ? null : this._toggleValue;
        const tabIndexToUse = disabled ? -1 : tabIndex;

        const toggleHeight = 12;
        const togglePadding = 2;
        const toggleClassNameForTheme = theme && classNamesByTheme[theme];

        return (
            <div
                ref={el => (this._container = el)}
                onClick={onClick}
                tabIndex={tabIndexToUse}
                onKeyDown={onEnterOrSpaceKey(onClick)}
                className={classNames(
                    'focusable flex-inline items-center',
                    {
                        'pointer link-quiet': !disabled,
                        'noevents quieter': disabled,
                    },
                    className,
                )}
                style={style}
                {...restOfProps}
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
                {label !== null && label !== undefined && label !== '' && (
                    <div className="flex-auto ml1 normal text-dark">{label}</div>
                )}
            </div>
        );
    }
}

export default Toggle;
