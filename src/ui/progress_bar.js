// @flow
const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const colors = require('../colors');
const colorUtils = require('../color_utils');

type ProgressBarProps = {
    progress: number,
    barColor?: string,
    backgroundColor?: string,
    height?: number,
    className?: string,
    style?: Object,
};

/** */
const ProgressBar = (props: ProgressBarProps) => {
    const {
        progress,
        barColor = colorUtils.getHexForColor(colors.BLUE_BRIGHT),
        backgroundColor = colorUtils.getHexForColor(colors.GRAY_LIGHT_1),
        height = 4,
        className = '',
        style,
    } = props;

    const clampedProgress = u.clamp(progress, 0, 1);

    return (
        <div
            className={`${className} relative pill overflow-hidden`}
            style={{
                ...style,
                height,
                backgroundColor,
            }}
        >
            <div
                className="absolute animate top-0 left-0 height-full"
                style={{
                    width: `${clampedProgress * 100}%`,
                    backgroundColor: barColor,
                }}
            />
        </div>
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    height: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
};

module.exports = ProgressBar;
