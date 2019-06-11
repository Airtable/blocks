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

/**
 * @typedef
 * @type {object}
 * @property {Button.themes.RED | Button.themes.GREEN | Button.themes.BLUE | Button.themes.YELLOW | Button.themes.WHITE | Button.themes.GRAY | Button.themes.DARK | Button.themes.TRANSPARENT} [theme=Button.themes.GRAY] The color theme for the button.
 */
type ButtonProps = {
    theme: ButtonTheme,
    className?: string,
    style?: Object,
    onClick?: (e?: SyntheticMouseEvent<HTMLButtonElement>) => mixed,
    type?: 'button' | 'reset' | 'submit',
    disabled?: boolean,
    tabIndex?: number,
    'aria-label'?: string,
    children?: React.Node,
};

const classNamesByTheme = {
    [themes.RED]: 'red text-white',
    [themes.GREEN]: 'green text-white',
    [themes.BLUE]: 'blue text-white',
    [themes.YELLOW]: 'yellow text-dark',
    [themes.WHITE]: 'white text-blue',
    [themes.DARK]: 'dark text-white',
    [themes.GRAY]: 'grayLight2 text-dark',
    [themes.TRANSPARENT]: 'background-transparent text-dark',
};

/**
 * Clickable button component.
 *
 * @example
 * import UI from '@airtable/blocks/ui';
 *
 * const button = (
 *     <UI.Button
 *        onClick={() => alert('Clicked!')}
 *        disabled={false}
 *        theme={Button.themes.BLUE}
 *     >
 *         Click here!
 *     </UI.Button>
 * );
 */
class Button extends React.Component<ButtonProps> {
    static propTypes = {
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        type: PropTypes.oneOf(['button', 'submit', 'reset']),
        disabled: PropTypes.bool,
        tabIndex: PropTypes.number,
        'aria-label': PropTypes.string,
    };
    static defaultProps = {
        theme: themes.BLUE,
        // Default type is "submit", which will submit the parent <form> if it exists.
        type: 'button',
    };
    static themes = themes;
    _button: HTMLButtonElement | null;
    constructor(props: ButtonProps) {
        super(props);
        // TODO (stephen): use React.forwardRef
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
        const {theme, className, style, onClick, disabled, children} = this.props;

        const themeClassNames = classNamesByTheme[theme] || '';

        return (
            <button
                ref={el => (this._button = el)}
                className={classNames(
                    'baymax rounded big strong p1 flex-inline items-center no-outline no-user-select',
                    themeClassNames,
                    className,
                    {
                        'pointer link-quiet': !disabled,
                        'noevents quieter': disabled,
                    },
                )}
                style={style}
                onClick={onClick}
                type="button"
                disabled={disabled}
                aria-label={this.props['aria-label']}
            >
                {children}
            </button>
        );
    }
}

export default Button;
