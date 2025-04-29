/** @module @airtable/blocks/ui: ColorPalette */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {invariant} from '../../shared/error_utils';
import colorUtils from '../../shared/color_utils';
import {baymax} from './baymax_utils';
import Box from './box';
import Icon from './icon';
import createDetectElementResize from './create_detect_element_resize';
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
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

const MIN_COLOR_SQUARE_SIZE = 16;
const DEFAULT_COLOR_SQUARE_SIZE = 24;
const MAX_COLOR_SQUARE_SIZE = 32;


/**
 * Style props shared between the {@link ColorPalette} and {@link ColorPaletteSynced} components. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
export interface ColorPaletteStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {}

const styleParser = compose(maxWidth, minWidth, width, flexItemSet, positionSet, margin);

export const colorPaletteStylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Props shared between the {@link ColorPalette} and {@link ColorPaletteSynced} components.
 */
export interface SharedColorPaletteProps extends ColorPaletteStyleProps, TooltipAnchorProps {
    /** The list of {@link Color|colors} to display in the color palette. */
    allowedColors: Array<string>;
    /** A function to be called when the selected color changes. */
    onChange?: (arg1: string) => unknown;
    /** The margin between color squares in the color palette. */
    squareMargin?: number;
    /** Additional class names to apply to the color palette, separated by spaces. */
    className?: string;
    /** Additional styles to apply to the color palette. */
    style?: React.CSSProperties;
    /** If set to `true`, the color palette will not allow color selection. */
    disabled?: boolean;
}

export const sharedColorPalettePropTypes = {
    allowedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func,
    squareMargin: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    ...tooltipAnchorPropTypes,
};

/**
 * Props for the {@link ColorPalette} component. Also accepts:
 * * {@link ColorPaletteStyleProps}
 *
 * @docsPath UI/components/ColorPalette
 */
export interface ColorPaletteProps extends SharedColorPaletteProps {
    /** The current selected {@link Color} option. */
    color?: string | null;
}

/** @hidden */
interface ColorPaletteState {
    squareSize: number;
}

/**
 * A color selection component. Accepts a list of `allowedColors` to be displayed
 * as selectable color squares.
 *
 * [[ Story id="colorpalette--example" title="Color palette example" ]]
 *
 * @component
 * @docsPath UI/components/ColorPalette
 */
export class ColorPalette extends React.Component<ColorPaletteProps, ColorPaletteState> {
    /** @hidden */
    static propTypes = {
        color: PropTypes.string,
        ...sharedColorPalettePropTypes,
    };
    /** @hidden */
    static defaultProps = {
        squareMargin: 4,
        className: '',
        style: {},
    };
    /** @internal */
    _detectElementResize: {
        addResizeListener: (element: HTMLElement, fn: () => void) => void;
        removeResizeListener: (element: HTMLElement, fn: () => void) => void;
    };
    /** @internal */
    _colorPaletteContainerRef: {current: HTMLElement | null};
    /** @hidden */
    constructor(props: ColorPaletteProps) {
        super(props);

        this._detectElementResize = createDetectElementResize();
        this._colorPaletteContainerRef = React.createRef();
        this._setColorSquareSize = this._setColorSquareSize.bind(this);
        this.state = {
            squareSize: DEFAULT_COLOR_SQUARE_SIZE,
        };
    }
    /** @hidden */
    componentDidMount() {
        if (this._colorPaletteContainerRef.current) {
            this._detectElementResize.addResizeListener(
                this._colorPaletteContainerRef.current,
                this._setColorSquareSize,
            );
        }
        this._setColorSquareSize();
    }
    /** @hidden */
    componentWillUnmount() {
        if (this._colorPaletteContainerRef.current) {
            this._detectElementResize.removeResizeListener(
                this._colorPaletteContainerRef.current,
                this._setColorSquareSize,
            );
        }
    }
    /** @hidden */
    componentDidUpdate(prevProps: ColorPaletteProps) {
        if (this.props.allowedColors.length !== prevProps.allowedColors.length) {
            this._setColorSquareSize();
        }
    }
    /** @internal */
    _setColorSquareSize() {
        const {squareMargin} = this.props;

        invariant(
            squareMargin !== null && squareMargin !== undefined,
            'colorPalette.squareMargin must be a number',
        );

        invariant(this._colorPaletteContainerRef.current, 'No container to set color square size');

        const calculateSquareSize = (numSquares: number) => {
            return (containerWidth - squareMargin * 2 * numSquares) / numSquares;
        };
        const containerWidth = this._colorPaletteContainerRef.current.getBoundingClientRect().width;
        const numColors = this.props.allowedColors.length;
        const calculatedSquareSize = calculateSquareSize(numColors);
        let squareSize;
        if (calculatedSquareSize < MIN_COLOR_SQUARE_SIZE) {
            const numColorsThatWillFitAsDefaultSize = Math.round(
                (containerWidth + 2 * squareMargin) /
                    (DEFAULT_COLOR_SQUARE_SIZE + 2 * squareMargin),
            );
            squareSize = squareSize =
                numColorsThatWillFitAsDefaultSize === 0
                    ? DEFAULT_COLOR_SQUARE_SIZE
                    : calculateSquareSize(numColorsThatWillFitAsDefaultSize);
        } else {
            squareSize = Math.min(MAX_COLOR_SQUARE_SIZE, calculatedSquareSize);
        }
        this.setState({squareSize});
    }
    /** @internal */
    _onChange(color: string) {
        if (this.props.onChange) {
            this.props.onChange(color);
        }
    }
    /** @hidden */
    render() {
        const {
            color,
            allowedColors,
            squareMargin,
            onMouseEnter,
            onMouseLeave,
            onClick,
            className,
            style,
            disabled,
        } = this.props;
        const {squareSize} = this.state;

        invariant(
            squareMargin !== null && squareMargin !== undefined,
            'colorPalette.squareMargin must be a number',
        );

        return (
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={className}
                style={style}
                overflow="hidden"
            >
                <Box
                    ref={this._colorPaletteContainerRef}
                    display="flex"
                    flexWrap="wrap"
                    margin={`${-squareMargin}px`}
                >
                    {allowedColors.map(allowedColor => (
                        <label
                            key={allowedColor}
                            onClick={disabled ? undefined : () => this._onChange(allowedColor)}
                            style={{
                                backgroundColor:
                                    colorUtils.getHexForColor(allowedColor) || undefined,
                                height: squareSize,
                                width: squareSize,
                                margin: squareMargin,
                            }}
                            className={cx(baymax('rounded flex items-center justify-center'), {
                                [baymax('pointer link-quiet')]: !disabled,
                                [baymax('quieter')]: !!disabled,
                            })}
                        >
                            {allowedColor === color && (
                                <Icon
                                    name="check"
                                    size={squareSize}
                                    className={baymax(
                                        colorUtils.shouldUseLightTextOnColor(allowedColor)
                                            ? 'text-white'
                                            : 'text-dark',
                                    )}
                                />
                            )}
                        </label>
                    ))}
                </Box>
            </Box>
        );
    }
}

export default withStyledSystem<
    Omit<ColorPaletteProps, keyof ColorPaletteStyleProps>,
    ColorPaletteStyleProps,
    ColorPalette,
    {}
>(ColorPalette, styleParser, colorPaletteStylePropTypes);
