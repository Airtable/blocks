// @flow
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const classNames = require('classnames');
const invariant = require('invariant');

type ButtonPropTypes = {
    className: string,
    disabled: boolean,
    theme: string,
    children: React$Element<*>,
};

const themes = Object.freeze({
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue',
    YELLOW: 'yellow',
    WHITE: 'white',
    GRAY: 'gray',
    DARK: 'dark',
    TRANSPARENT: 'transparent',
});

const classNamesByTheme = {
    [themes.RED]: 'red text-white',
    [themes.GREEN]: 'green text-white',
    [themes.BLUE]: 'blue text-white',
    [themes.YELLOW]: 'yellow text-dark',
    [themes.WHITE]: 'white text-blue',
    [themes.DARK]: 'dark text-white',
    [themes.GRAY]: 'grayLight1 text-dark',
    [themes.TRANSPARENT]: 'background-transparent text-dark',
};

class Button extends React.Component {
    _button: HTMLButtonElement | null;
    constructor(props: ButtonPropTypes) {
        super(props);

        this._button = null;
    }
    focus() {
        invariant(this._button, 'No button to focus');
        this._button.focus();
    }
    blur() {
        invariant(this._button, 'No button to blur');
        this._button.blur();
    }
    click() {
        invariant(this._button, 'No button to click');
        this._button.click();
    }
    render() {
        const {
            className,
            theme,
            disabled,
            children,
            ...restOfProps
        } = this.props;

        const themeClassNames = classNamesByTheme[theme] || '';

        return (
            <button
                ref={el => this._button = el}
                disabled={disabled}
                className={classNames(`baymax rounded big strong p1 flex-inline items-center no-outline ${themeClassNames} ${className}`, {
                    'pointer link-quiet': !disabled,
                    quieter: disabled,
                })}
                {...restOfProps}>
                {children}
            </button>
        );
    }
}

Button.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
};

Button.defaultProps = {
    theme: themes.GRAY, // eslint-disable-line react/default-props-match-prop-types
};

Button.themes = themes;

module.exports = Button;
