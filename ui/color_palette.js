// @flow
const React = require('client/blocks/sdk/ui/react');
const colorUtils = require('client/blocks/sdk/ui/color_utils');
const Icon = require('client/blocks/sdk/ui/icon');
const classNames = require('classnames');

// TODO: add flow types.
// TODO: it's confusing that this expects color names, but other components
// expect a CSS color string.

class ColorPalette extends React.Component {
    static propTypes = {
        color: React.PropTypes.string,
        allowedColors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
        onChange: React.PropTypes.func,
        squareSize: React.PropTypes.number,
        squareMargin: React.PropTypes.number,
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        disabled: React.PropTypes.bool,
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
        const {color, allowedColors, squareSize, squareMargin, className, style, disabled} = this.props;
        return (
            <div className={`${className} overflow-hidden`} style={{style}}>
                <div className="flex flex-wrap" style={{
                    // Add a negative margin to offset the margin of each swatch,
                    // so the color swatches are flush with the outer container.
                    margin: -squareMargin,
                }}>
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
                            })}>
                            {allowedColor === color &&
                                <Icon name="check" size={25} className={colorUtils.shouldUseLightTextOnColor(allowedColor) ? 'text-white' : 'text-dark'} />
                            }
                        </label>
                    ))}
                </div>
            </div>
        );
    }
}

module.exports = ColorPalette;
