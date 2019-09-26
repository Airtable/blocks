// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import colors from '../colors';
import {clamp} from '../private_utils';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    backgroundColor,
    backgroundColorPropTypes,
    type BackgroundColorProps,
    maxWidth,
    maxWidthPropTypes,
    type MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    type MinWidthProps,
    width,
    widthPropTypes,
    type WidthProps,
    height,
    heightPropTypes,
    type HeightProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
    display,
    displayPropTypes,
} from './system';
import {type Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';
import Box from './box';

type StyleProps = {|
    display?: Prop<'block' | 'inline' | 'inline-block'>,
    ...BackgroundColorProps,
    ...MaxWidthProps,
    ...MinWidthProps,
    ...WidthProps,
    ...HeightProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    backgroundColor,
    maxWidth,
    minWidth,
    width,
    height,
    flexItemSet,
    positionSet,
    margin,
    display,
);

export const stylePropTypes = {
    ...backgroundColorPropTypes,
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...heightPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
    ...displayPropTypes,
};

/**
 * @typedef {object} ProgressBarProps
 * @property {number} progress A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete. If you include a number outside of the range, the value will be clamped to be inside of the range.
 * @property {string} [barColor] A CSS color, such as `#ff9900`.
 * @property {string} [backgroundColor] A CSS color, such as `#ff9900`.
 * @property {number} [height] A height, in pixels.
 * @property {string} [className] Extra `className`s to apply to the element, separated by spaces.
 * @property {object} [style] Extra styles to apply to the progress bar.
 */
type ProgressBarProps = {|
    barColor?: string,
    progress: number,
    className?: string,
    style?: {[string]: mixed},
    ...TooltipAnchorProps,
    ...StyleProps,
|};

/**
 * A progress bar.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {ProgressBarProps} props
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
        barColor,
        progress,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;

    const clampedProgress = clamp(progress, 0, 1);
    const classNameForStyleProps = useStyledSystem(styleProps, styleParser);

    return (
        <Box
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(classNameForStyleProps, className)}
            style={style}
            position="relative"
            borderRadius="circle"
            overflow="hidden"
        >
            <Box
                className={baymax('animate')}
                width={`${clampedProgress * 100}%`}
                height="100%"
                backgroundColor={barColor}
            />
        </Box>
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
    barColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    ...tooltipAnchorPropTypes,
    ...stylePropTypes,
};

ProgressBar.defaultProps = {
    barColor: colors.BLUE_BRIGHT,
    backgroundColor: colors.GRAY_LIGHT_1,
    width: '100%',
    height: 4,
};

export default ProgressBar;
