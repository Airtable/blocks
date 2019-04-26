// @flow
const React = require('./react');
const PropTypes = require('prop-types');
const colorUtils = require('../../shared/color_utils');
const Icon = require('./icon');
const classNames = require('classnames');

// TODO: it's confusing that this expects color names, but other components
// expect a CSS color string.

type ColorPaletteProps = {
    color?: string,
    allowedColors: Array<string>,
    onChange?: string => mixed,
    squareSize: number,
    squareMargin: number,
    className: string,
    style: Object,
    disabled?: boolean,
};

/** */
class ColorPalette extends React.Component<ColorPaletteProps> {
    static propTypes = {
        color: PropTypes.string,
        allowedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChange: PropTypes.func,
        squareSize: PropTypes.number,
        squareMargin: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        disabled: PropTypes.bool,
    };
    static defaultProps = {
        squareSize: 32,
        squareMargin: 4,
        className: '',
        style: {},
    };
    _onChange(color: string) {
        if (this.props.onChange) {
            this.props.onChange(color);
        }
    }
    render() {
        const {
            color,
            allowedColors,
            squareSize,
            squareMargin,
            className,
            style,
            disabled,
        } = this.props;
        return (
            <div className={`${className} overflow-hidden`} style={{style}}>
                <div
                    className="flex flex-wrap"
                    style={{
                        // Add a negative margin to offset the margin of each swatch,
                        // so the color swatches are flush with the outer container.
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
                                    size={25}
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

module.exports = ColorPalette;
