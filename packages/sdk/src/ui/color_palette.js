// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import colorUtils from '../color_utils';
import {invariant} from '../error_utils';
import Icon from './icon';
import createDetectElementResize from './create_detect_element_resize';

const MIN_COLOR_SQUARE_SIZE = 16;
const DEFAULT_COLOR_SQUARE_SIZE = 24;
const MAX_COLOR_SQUARE_SIZE = 32;


/** @typedef */
type ColorPaletteProps = {
    color?: string,
    allowedColors: Array<string>,
    onChange?: string => mixed,
    squareMargin: number,
    className: string,
    style: Object,
    disabled?: boolean,
};

type ColorPaletteState = {
    squareSize: number,
};

/** */
class ColorPalette extends React.Component<ColorPaletteProps, ColorPaletteState> {
    static propTypes = {
        color: PropTypes.string,
        allowedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChange: PropTypes.func,
        squareMargin: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        disabled: PropTypes.bool,
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
    _colorPaletteContainerRef: {current: HTMLDivElement | null};
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
        invariant(this._colorPaletteContainerRef.current, 'No container to set color square size');
        const calculateSquareSize = numSquares => {
            return (containerWidth - this.props.squareMargin * 2 * numSquares) / numSquares;
        };
        const containerWidth = this._colorPaletteContainerRef.current.getBoundingClientRect().width;
        const numColors = this.props.allowedColors.length;
        const calculatedSquareSize = calculateSquareSize(numColors);
        let squareSize;
        if (calculatedSquareSize < MIN_COLOR_SQUARE_SIZE) {
            const numColorsThatWillFitAsDefaultSize = Math.round(
                (containerWidth + 2 * this.props.squareMargin) /
                    (DEFAULT_COLOR_SQUARE_SIZE + 2 * this.props.squareMargin),
            );
            squareSize = calculateSquareSize(numColorsThatWillFitAsDefaultSize);
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
        const {color, allowedColors, squareMargin, className, style, disabled} = this.props;
        const {squareSize} = this.state;
        return (
            <div className={`${className} overflow-hidden`} style={style}>
                <div
                    className="flex flex-wrap"
                    ref={this._colorPaletteContainerRef}
                    style={{
                        margin: -squareMargin,
                    }}
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
                            className={classNames('rounded flex items-center justify-center', {
                                'pointer link-quiet': !disabled,
                                quieter: disabled,
                            })}
                        >
                            {allowedColor === color && (
                                <Icon
                                    name="check"
                                    size={squareSize}
                                    className={
                                        colorUtils.shouldUseLightTextOnColor(allowedColor)
                                            ? 'text-white'
                                            : 'text-dark'
                                    }
                                />
                            )}
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}

export default ColorPalette;
