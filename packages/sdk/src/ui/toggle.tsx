/** @module @airtable/blocks/ui: Toggle */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {ObjectValues} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
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
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
    display,
    displayPropTypes,
} from './system';
import {Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import Box from './box';

// TODO (stephen): add size variants
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

export type ToggleTheme = ObjectValues<typeof themes>;

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
 * @property {Function} [onChange] A function to be called when the switch is toggled.
 * @property {number} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {boolean} value If set to `true`, the switch will be toggled on.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
export type SharedToggleProps = {
    className?: string;
    disabled?: boolean;
    label?: React.ReactNode;
    onChange?: (arg1: boolean) => unknown;
    tabIndex?: number;
    theme?: ToggleTheme;
    id?: string;
    style?: React.CSSProperties;
    ['aria-label']?: string;
    ['aria-labelledby']?: string;
    ['aria-describedby']?: string;
} & (TooltipAnchorProps);

type ToggleProps = {value: boolean} & (SharedToggleProps);

export const sharedTogglePropTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    onChange: PropTypes.func,
    tabIndex: PropTypes.number,
    theme: PropTypes.oneOf(Object.keys(classNamesByTheme)),
    className: PropTypes.string,
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    ...tooltipAnchorPropTypes,
};

export type StyleProps = {display?: Prop<'flex' | 'inline-flex'>} & (MaxWidthProps) &
    (MinWidthProps) &
    (WidthProps) &
    (FlexItemSetProps) &
    (PositionSetProps) &
    (SpacingSetProps);

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
    // TODO (stephen): currently, this will accept all values for display, not just flex/inline-flex
    ...displayPropTypes,
};

/**
 * A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.
 *
 * @example
 * ```js
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
 * ```
 */
export class Toggle extends React.Component<ToggleProps> {
    /** */
    static themes = themes;
    /** @hidden */
    static propTypes = {
        value: PropTypes.bool.isRequired,
        ...sharedTogglePropTypes,
    };
    /** @hidden */
    static defaultProps = {
        tabIndex: 0,
        theme: themes.GREEN,
    };
    /** @internal */
    _container: HTMLElement | null;
    /** @hidden */
    constructor(props: ToggleProps) {
        super(props);
        // TODO (stephen): use React.forwardRef
        this._container = null;
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._toggleValue = this._toggleValue.bind(this);
    }
    /** */
    focus() {
        if (!this._container) {
            throw spawnInvariantViolationError('No toggle to focus');
        }
        this._container.focus();
    }
    /** */
    blur() {
        if (!this._container) {
            throw spawnInvariantViolationError('No toggle to blur');
        }
        this._container.blur();
    }
    /** */
    click() {
        if (!this._container) {
            throw spawnInvariantViolationError('No toggle to click');
        }
        this._container.click();
    }
    /** @internal */
    _onClick(e: React.MouseEvent<HTMLDivElement>) {
        const {onClick, disabled} = this.props;
        // onClick should only be defined in the case of a tooltip
        if (!disabled && onClick) {
            onClick(e);
        }
        this._toggleValue();
    }
    /** @internal */
    _onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            this._toggleValue();
        }
    }
    /** @internal */
    _toggleValue() {
        const {value, onChange, disabled} = this.props;
        if (onChange && !disabled) {
            onChange(!value);
        }
    }
    /** @hidden */
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
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={this._onClick}
                onKeyDown={this._onKeyDown}
                id={id}
                className={cx(
                    baymax('items-center rounded no-outline'),
                    {
                        [baymax('pointer link-quiet focusable')]: !disabled,
                        [baymax('quieter')]: !!disabled,
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
                            transform: value ? 'translateX(100%)' : undefined,
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
    {
        themes: typeof themes;
    }
>(Toggle, styleParser, stylePropTypes, {
    display: 'inline-flex',
    padding: 1,
});
