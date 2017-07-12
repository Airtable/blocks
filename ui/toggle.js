// @flow
const React = require('client/blocks/sdk/ui/react');
const classNames = require('classnames');
const KeyCodes = require('client_server_shared/key_codes');

const {PropTypes} = React;

const onEnterOrSpaceKey = handler => {
    return function(e) {
        if ((e.which === KeyCodes.ENTER || e.which === KeyCodes.SPACE) && handler) {
            e.preventDefault();
            handler(e);
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

type ToggleProps = {
    value: boolean,
    label?: React.Element<*>,
    theme?: string,
    onChange?: boolean => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
    tabIndex?: number,
};

class Toggle extends React.Component {
    static propTypes = {
        value: PropTypes.bool.isRequired,
        label: PropTypes.node,
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.number,
    };
    static defaultProps = {
        tabIndex: 0,
        theme: themes.GREEN,
    };
    _toggleValue: () => void;
    constructor(props: ToggleProps) {
        super(props);

        this._toggleValue = this._toggleValue.bind(this);
    }
    _toggleValue() {
        const {value, onChange} = this.props;
        if (onChange) {
            onChange(!value);
        }
    }
    render() {
        const {value, label, theme, disabled, className, style, tabIndex} = this.props;

        const onClick = disabled ? null : this._toggleValue;
        const tabIndexToUse = disabled ? -1 : tabIndex;

        const toggleHeight = 12;
        const togglePadding = 2;
        const toggleClassNameForTheme = classNamesByTheme[theme];

        return (
            <div
                onClick={onClick}
                tabIndex={tabIndexToUse}
                onKeyDown={onEnterOrSpaceKey(onClick)}
                className={classNames('focusable flex-inline items-center', {
                    'pointer link-quiet': !disabled,
                    'noevents quieter': disabled,
                }, className)}
                style={style}>
                <div
                    className={classNames('pill flex animate', {
                        'justify-start darken2': !value,
                        'justify-end': value,
                        [toggleClassNameForTheme]: value,
                    })}
                    style={{
                        height: toggleHeight,
                        width: toggleHeight * 1.6,
                        padding: togglePadding,
                    }}>
                    <div
                        className="white circle flex-none"
                        style={{width: toggleHeight - (2 * togglePadding)}}
                    />
                </div>
                {label &&
                    <div className="ml1 normal text-dark">{label}</div>
                }
            </div>
        );
    }
}

Toggle.themes = themes;

module.exports = Toggle;
