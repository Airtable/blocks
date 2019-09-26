// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import colorUtils from '../color_utils';
import {invariant} from '../error_utils';
import {baymax} from './baymax_utils';
import Box from './box';
import Icon from './icon';
import createDetectElementResize from './create_detect_element_resize';
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
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

const MIN_COLOR_SQUARE_SIZE = 16;
const DEFAULT_COLOR_SQUARE_SIZE = 24;
const MAX_COLOR_SQUARE_SIZE = 32;


export type StyleProps = {|
    ...MaxWidthProps,
    ...MinWidthProps,
    ...WidthProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    margin,
);

export const stylePropTypes = {
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

export type SharedColorPaletteProps = {|
    allowedColors: Array<string>,
    onChange?: string => mixed,
    squareMargin?: number,
    className?: string,
    style?: {[string]: mixed},
    disabled?: boolean,
    ...TooltipAnchorProps,
|};

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
 * @typedef {object} ColorPaletteProps
 * @property {string} [color] The current selected {@link Color} option.
 * @property {Array<string>} allowedColors The list of {@link colors} to display in the color palette.
 * @property {function} [onChange] A function to be called when the selected color changes.
 * @property {number} [squareMargin] The margin between color squares in the color palette.
 * @property {string} [className] Additional class names to apply to the color palette, separated by spaces.
 * @property {object} [style] Additional styles to apply to the color palette.
 * @property {boolean} [disabled] If set to `true`, the color palette will not allow color selection.
 */
type ColorPaletteProps = {|
    color?: string | null,
    ...SharedColorPaletteProps,
|};

type ColorPaletteState = {
    squareSize: number,
};

/**
 * A color selection component. Accepts a list of `allowedColors` to be displayed
 * as selectable color squares.
 *
 * @example
 * import {ColorPalette, colors} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function DisplayOptions() {
 *     const allowedColors = [colors.GREEN, colors.BLUE, colors.RED];
 *     const [selectedColor, setSelectedColor] = useState(colors.GREEN);
 *     return (
 *         <ColorPalette
 *             allowedColors={allowedColors}
 *             onChange={setSelectedColor}
 *         />
 *     );
 * }
 */
class ColorPalette extends React.Component<ColorPaletteProps, ColorPaletteState> {
    static propTypes = {
        color: PropTypes.string,
        ...sharedColorPalettePropTypes,
    };
    static defaultProps = {
        squareMargin: 4,
        className: '',
        style: {},
    };
    _detectElementResize: {|
        addResizeListener: (element: HTMLElement, fn: () => void) => void,
        removeResizeListener: (element: HTMLElement, fn: () => void) => void,
    |};
    _setColorSquareSize: () => void;
    _colorPaletteContainerRef: {current: HTMLElement | null};
    constructor(props: ColorPaletteProps) {
        super(props);

        this._detectElementResize = createDetectElementResize();
        this._colorPaletteContainerRef = React.createRef();
        this._setColorSquareSize = this._setColorSquareSize.bind(this);
        this.state = {
            squareSize: DEFAULT_COLOR_SQUARE_SIZE,
        };
    }
    componentDidMount() {
        if (this._colorPaletteContainerRef.current) {
            this._detectElementResize.addResizeListener(
                this._colorPaletteContainerRef.current,
                this._setColorSquareSize,
            );
        }
        this._setColorSquareSize();
    }
    componentWillUnmount() {
        if (this._colorPaletteContainerRef.current) {
            this._detectElementResize.removeResizeListener(
                this._colorPaletteContainerRef.current,
                this._setColorSquareSize,
            );
        }
    }
    componentDidUpdate(prevProps: ColorPaletteProps) {
        if (this.props.allowedColors.length !== prevProps.allowedColors.length) {
            this._setColorSquareSize();
        }
    }
    _setColorSquareSize() {
        const {squareMargin} = this.props;
        invariant(squareMargin, 'colorPalette.squareMargin');
        invariant(this._colorPaletteContainerRef.current, 'No container to set color square size');
        const calculateSquareSize = numSquares => {
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
    _onChange(color: string) {
        if (this.props.onChange) {
            this.props.onChange(color);
        }
    }
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
        invariant(squareMargin, 'colorPalette.squareMargin');
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
                            onClick={!disabled && (() => this._onChange(allowedColor))}
                            style={{
                                backgroundColor: colorUtils.getHexForColor(allowedColor),
                                height: squareSize,
                                width: squareSize,
                                margin: squareMargin,
                            }}
                            className={cx(baymax('rounded flex items-center justify-center'), {
                                [baymax('pointer link-quiet')]: !disabled,
                                [baymax('quieter')]: disabled,
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

export default withStyledSystem<ColorPaletteProps, StyleProps, ColorPalette, {}>(
    ColorPalette,
    styleParser,
    stylePropTypes,
);
