// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import colors from '../colors';
import colorUtils from '../color_utils';
import {clamp} from '../private_utils';
import {baymax} from './baymax_utils';

/**
 * @typedef
 * @type {object}
 * @property {number} progress A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete. If you include a number outside of the range, the value will be clamped to be inside of the range.
 * @property {string} [barColor] A CSS color, such as `#ff9900`.
 * @property {string} [backgroundColor] A CSS color, such as `#ff9900`.
 * @property {number} [height] A height, in pixels.
 * @property {string} [className=''] Extra `className`s to apply to the element, separated by spaces.
 * @property {object} [style={}] Extra styles to apply to the progress bar.
 */
type ProgressBarProps = {
    progress: number,
    barColor?: string,
    backgroundColor?: string,
    height?: number,
    className?: string,
    style?: Object,
};

/**
 * A progress bar.
 *
 * @example
 * import {UI} from '@airtable/blocks/ui';
 *
 * function MyComponent() {
 *     return (
 *         <ProgressBar
 *             progress={0.6}
 *             barColor='#ff9900'
 *         />
 *     );
 * }
 */
const ProgressBar = (props: ProgressBarProps) => {
    const {
        progress,
        barColor = colorUtils.getHexForColor(colors.BLUE_BRIGHT),
        backgroundColor = colorUtils.getHexForColor(colors.GRAY_LIGHT_1),
        height = 4,
        className = '',
        style,
    } = props;

    const clampedProgress = clamp(progress, 0, 1);

    return (
        <div
            className={cx(baymax('relative pill overflow-hidden'), className)}
            style={{
                ...style,
                height,
                backgroundColor,
            }}
        >
            <div
                className={baymax('absolute animate top-0 left-0 height-full')}
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

export default ProgressBar;
