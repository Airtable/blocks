// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {invariant} from '../error_utils';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
import {
    maxWidth,
    maxWidthPropTypes,
    type MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    type MinWidthProps,
    width,
    widthPropTypes,
    type WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    type SpacingSetProps,
    display,
    displayPropTypes,
} from './system';
import {type Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';
import Box from './box';

const TOGGLE_WIDTH = 20;
const TOGGLE_HEIGHT = 12;
const TOGGLE_PADDING = 2;
const CIRCLE_SIZE = TOGGLE_HEIGHT - 2 * TOGGLE_PADDING;

const themes = Object.freeze({
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    GRAY: 'gray',
});

export type ToggleTheme = $Values<typeof themes>;

const classNamesByTheme = Object.freeze({
    [themes.GREEN]: 'green',
    [themes.BLUE]: 'blue',
    [themes.RED]: 'red',
    [themes.YELLOW]: 'yellow',
    [themes.GRAY]: 'gray',
});

/**
 * @typedef {object} ToggleProps
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the switch.
 * @property {string} [id] The ID of the switch element.
 * @property {React.Node} [label] The label node for the switch.
 * @property {function} [onChange] A function to be called when the switch is toggled.
 * @property {number | string} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {boolean} value If set to `true`, the switch will be toggled on.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
export type SharedToggleProps = {|
    disabled?: boolean,
    id?: string,
    label?: React.Node,
    onChange?: boolean => mixed,
    tabIndex?: number | string,
    theme?: ToggleTheme,
    className?: string,
    style?: {[string]: mixed},
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
    ...TooltipAnchorProps,
|};

type ToggleProps = {|
    value: boolean,
    ...SharedToggleProps,
|};

export const sharedTogglePropTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    onChange: PropTypes.func,
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
};

export type StyleProps = {|
    display?: Prop<'flex' | 'inline-flex'>,
    ...MaxWidthProps,
    ...MinWidthProps,
    ...WidthProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...SpacingSetProps,
|};

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    spacingSet,
    display,
);

export const stylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
    ...displayPropTypes,
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
        ...sharedTogglePropTypes,
    };
    static defaultProps = {
        tabIndex: 0,
        theme: themes.GREEN,
    };
    _container: HTMLElement | null;
    _onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void;
    _onKeyDown: (e: SyntheticKeyboardEvent<HTMLDivElement>) => void;
    _toggleValue: () => void;
    constructor(props: ToggleProps) {
        super(props);
        this._container = null;
        this._onClick = this._onClick.bind(this);
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
    _onClick(e: SyntheticMouseEvent<HTMLDivElement>) {
        const {onClick, disabled} = this.props;
        if (!disabled && onClick) {
            onClick(e);
        }
        this._toggleValue();
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
        const {
            disabled,
            id,
            label,
            tabIndex,
            theme,
            value,
            onMouseEnter,
            onMouseLeave,
            className,
            style,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
        } = this.props;

        const toggleClassNameForTheme = theme && classNamesByTheme[theme];

        return (
            <div
                ref={el => (this._container = el)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={this._onClick}
                onKeyDown={this._onKeyDown}
                id={id}
                className={cx(
                    baymax('items-center rounded no-outline'),
                    {
                        [baymax('pointer link-quiet focusable')]: !disabled,
                        [baymax('quieter')]: disabled,
                    },
                    className,
                )}
                style={style}
                tabIndex={disabled ? -1 : tabIndex}
                role="checkbox"
                aria-checked={!!value}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
            >
                <Box
                    className={cx(baymax('animate'), {
                        [baymax(toggleClassNameForTheme || '')]: value,
                    })}
                    flex="none"
                    width={`${TOGGLE_WIDTH}px`}
                    height={`${TOGGLE_HEIGHT}px`}
                    padding={`${TOGGLE_PADDING}px`}
                    backgroundColor={value ? null : 'darken2'}
                    borderRadius="circle"
                >
                    <Box
                        className={baymax('animate')}
                        width={`${CIRCLE_SIZE}px`}
                        height={`${CIRCLE_SIZE}px`}
                        backgroundColor="white"
                        borderRadius="circle"
                        style={{
                            transform: value ? 'translateX(100%)' : null,
                        }}
                    />
                </Box>
                {label && (
                    <Box
                        className={baymax('normal no-user-select')}
                        flex="auto"
                        marginLeft={2}
                        textColor="dark"
                    >
                        {label}
                    </Box>
                )}
            </div>
        );
    }
}

export default withStyledSystem<
    ToggleProps,
    StyleProps,
    Toggle,
    {|
        themes: typeof themes,
    |},
>(Toggle, styleParser, stylePropTypes, {
    display: 'inline-flex',
    padding: 1,
});
