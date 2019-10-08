/** @module @airtable/blocks/ui: Button */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {ObjectValues} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import withStyledSystem from './with_styled_system';
import {baymax} from './baymax_utils';
import {
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

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

type ButtonTheme = ObjectValues<typeof themes>;

/**
 * @typedef {object} ButtonProps
 * @property {Button.themes.RED | Button.themes.GREEN | Button.themes.BLUE | Button.themes.YELLOW | Button.themes.WHITE | Button.themes.GRAY | Button.themes.DARK | Button.themes.TRANSPARENT} [theme=Button.themes.BLUE] The color theme for the button.
 * @property {string} [className] Extra `className`s to apply to the button, separated by spaces.
 * @property {object} [style] Extra styles to apply to the button.
 * @property {Function} [onClick] Click event handler. Also handles Space and Enter keypress events.
 * @property {string} [type='button'] The type of the button.
 * @property {boolean} [disabled] Indicates whether or not the user can interact with the button.
 * @property {number} [tabIndex] Indicates if the button can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-label] The label for the button. Use this if the button lacks a visible text label.
 */
interface ButtonProps extends TooltipAnchorProps<HTMLButtonElement> {
    type?: 'button' | 'submit' | 'reset';
    theme?: ButtonTheme;
    className?: string;
    style?: React.CSSProperties;
    // `onClick` is already defined in `TooltipAnchorProps`, for clarity we list it again.
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown;
    id?: string;
    disabled?: boolean;
    tabIndex?: number;
    ['aria-label']?: string;
    children?: React.ReactNode;
}

type StyleProps = (MaxWidthProps) &
    (MinWidthProps) &
    (WidthProps) &
    (FlexItemSetProps) &
    (PositionSetProps) &
    (MarginProps);

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

const stylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
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
 * ```js
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
 * ```
 */
export class Button extends React.Component<ButtonProps> {
    /** @hidden */
    static propTypes = {
        theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        onClick: PropTypes.func,
        type: PropTypes.string,
        disabled: PropTypes.bool,
        tabIndex: PropTypes.number,
        'aria-label': PropTypes.string,
        ...tooltipAnchorPropTypes,
    };
    /** @hidden */
    static defaultProps = {
        theme: themes.BLUE,
        // Default type is "submit", which will submit the parent <form> if it exists.
        type: 'button',
    };
    /** */
    static themes = themes;
    /** @internal */
    _button: HTMLButtonElement | null;
    /** @hidden */
    constructor(props: ButtonProps) {
        super(props);
        // TODO (stephen): use React.forwardRef
        this._button = null;
    }
    /** */
    focus() {
        if (!this._button) {
            throw spawnInvariantViolationError('No button to focus');
        }
        this._button.focus();
    }
    /** */
    blur() {
        if (!this._button) {
            throw spawnInvariantViolationError('No button to blur');
        }
        this._button.blur();
    }
    /** */
    click() {
        if (!this._button) {
            throw spawnInvariantViolationError('No button to click');
        }
        this._button.click();
    }
    /** @hidden */
    render() {
        const {
            theme,
            id,
            className,
            style,
            onMouseEnter,
            onMouseLeave,
            onClick,
            type,
            disabled,
            tabIndex,
            children,
        } = this.props;

        if (!theme) {
            throw spawnInvariantViolationError('button theme');
        }
        const themeClassNames = classNamesByTheme[theme] || '';

        return (
            <button
                ref={el => (this._button = el)}
                id={id}
                className={cx(
                    baymax(
                        'styled-input rounded big strong p1 flex-inline items-center no-outline no-user-select',
                    ),
                    baymax(themeClassNames),
                    {
                        [baymax('pointer link-quiet')]: !disabled,
                        [baymax('quieter')]: !!disabled,
                    },
                    className,
                )}
                style={style}
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
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

export default withStyledSystem<ButtonProps, StyleProps, Button, {themes: typeof themes}>(
    Button,
    styleParser,
    stylePropTypes,
);
