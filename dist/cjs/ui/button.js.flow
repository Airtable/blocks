// @flow

import PropTypes from 'prop-types';
import classNames from 'classnames';
import invariant from 'invariant';
import * as React from 'react';

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

type ButtonTheme = $Values<typeof themes>;

type ButtonProps = {
    className?: string,
    disabled?: boolean,
    theme: ButtonTheme,
    children?: React.Node,
};

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

/**
 * Clickable button component.
 *
 * @example
 * import {UI} from 'airtable-block';
 * const button = (
 *     <UI.Button
 *        disabled={false}
 *        theme={UI.Button.themes.BLUE}
 *        onClick={() = alert('Clicked!')}>
 *         Done
 *     </UI.Button>
 * );
 */
class Button extends React.Component<ButtonProps> {
    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
    };

    static defaultProps = {
        theme: themes.GRAY,
    };

    static themes = themes;

    _button: HTMLButtonElement | null;
    constructor(props: ButtonProps) {
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
        const {className, theme, disabled, children, ...restOfProps} = this.props;

        const themeClassNames = classNamesByTheme[theme] || '';

        return (
            <button
                ref={el => (this._button = el)}
                type="button" // Default type is "submit", which will submit the parent <form> if it exists.
                disabled={disabled}
                className={classNames(
                    'baymax rounded big strong p1 flex-inline items-center no-outline',
                    themeClassNames,
                    className,
                    {
                        'pointer link-quiet': !disabled,
                        'noevents quieter': disabled,
                    },
                )}
                {...restOfProps}
            >
                {children}
            </button>
        );
    }
}

export default Button;
