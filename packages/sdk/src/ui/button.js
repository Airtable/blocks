// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import {invariant} from '../error_utils';

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
 * @typedef {object} ButtonProps
 * @property {Button.themes.RED | Button.themes.GREEN | Button.themes.BLUE | Button.themes.YELLOW | Button.themes.WHITE | Button.themes.GRAY | Button.themes.DARK | Button.themes.TRANSPARENT} [theme=Button.themes.BLUE] The color theme for the button.
 * @property {string} [className] Extra `className`s to apply to the button, separated by spaces.
 * @property {object} [style] Extra styles to apply to the button.
 * @property {function} [onClick] Click event handler. Also handles Space and Enter keypress events.
 * @property {string} [type='button'] The type of the button.
 * @property {boolean} [disabled] Indicates whether or not the user can interact with the button.
 * @property {number | string} [tabIndex] Indicates if the button can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-label] The label for the button. Use this if the button lacks a visible text label.
 */
type ButtonProps = {
    theme: ButtonTheme,
    id?: string,
    className?: string,
    style?: Object,
    onClick?: (e?: SyntheticMouseEvent<HTMLButtonElement>) => mixed,
    type?: string,
    disabled?: boolean,
    tabIndex?: number | string,
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
 * import {Button} from '@airtable/blocks/ui';
 *
 * const button = (
 *     <Button
 *         onClick={() => alert('Clicked!')}
 *         disabled={false}
 *         theme={Button.themes.BLUE}
 *     >
 *         Click here!
 *     </Button>
 * );
 */
class Button extends React.Component<ButtonProps> {
    static propTypes = {
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        'aria-label': PropTypes.string,
    };
    static defaultProps = {
        theme: themes.BLUE,
        type: 'button',
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
        const {
            theme,
            id,
            className,
            style,
            onClick,
            type,
            disabled,
            tabIndex,
            children,
        } = this.props;

        const themeClassNames = classNamesByTheme[theme] || '';

        return (
            <button
                ref={el => (this._button = el)}
                id={id}
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
                type={type}
                disabled={disabled}
                tabIndex={tabIndex}
                aria-label={this.props['aria-label']}
            >
                {children}
            </button>
        );
    }
}

export default Button;
