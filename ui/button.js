// @flow
const React = require('client/blocks/sdk/ui/react');
const {PropTypes} = React;
const classNames = require('classnames');

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

const Button = (props: ButtonPropTypes) => {
    const {
        className,
        theme,
        ...restOfProps
    } = props;

    const themeClassNames = classNamesByTheme[theme] || '';

    return (
        <button
            className={classNames(`baymax rounded big strong p1 flex-inline items-center no-outline ${themeClassNames} ${className}`, {
                'pointer link-quiet': !props.disabled,
                quieter: props.disabled,
            })}
            {...restOfProps}>
            {props.children}
        </button>
    );
};

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
