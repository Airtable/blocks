/** @module @airtable/blocks/ui: ProgressBar */ /** */
import PropTypes from 'prop-types';
import {cx, css} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import colors from '../colors';
import {clamp} from '../private_utils';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    backgroundColor,
    backgroundColorPropTypes,
    BackgroundColorProps,
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    height,
    heightPropTypes,
    HeightProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
    display,
    displayPropTypes,
} from './system';
import {OptionalResponsiveProp} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import Box from './box';
import theme from './theme/default_theme';

/**
 * Style props for the {@link ProgressBar} component. Also accepts:
 * * {@link BackgroundColorProps}
 * * {@link FlexItemSetProps}
 * * {@link HeightProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
interface ProgressBarStyleProps
    extends BackgroundColorProps,
        MaxWidthProps,
        MinWidthProps,
        WidthProps,
        HeightProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'block' | 'inline' | 'inline-block'>;
}

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

export const progressBarStylePropTypes = {
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
 * Props for the {@link ProgressBar} component. Also accepts:
 * * {@link ProgressBarStyleProps}
 *
 * @docsPath UI/components/ProgressBar
 * @noInheritDoc
 */
export interface ProgressBarProps extends ProgressBarStyleProps, TooltipAnchorProps {
    /** A CSS color, such as `#ff9900`. Defaults to a blue color. */
    barColor?: string;
    /** A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete. If you include a number outside of the range, the value will be clamped to be inside of the range. */
    progress: number;
    /** Extra `className`s to apply to the element, separated by spaces. */
    className?: string;
    /** Extra styles to apply to the progress bar. */
    style?: React.CSSProperties;
}

const progressBarClassName = css({
    position: 'relative',
    borderRadius: theme.radii.circle,
    overflow: 'hidden',
});

/**
 * A progress bar.
 *
 * @example
 * ```js
 * import {ProgressBar} from '@airtable/blocks/ui';
 *
 * function MyComponent() {
 *     return (
 *         <ProgressBar
 *             progress={0.6}
 *             barColor='#ff9900'
 *         />
 *     );
 * }
 * ```
 * @docsPath UI/components/ProgressBar
 * @component
 */
const ProgressBar = (props: ProgressBarProps) => {
    const {
        barColor = theme.colors.blueBright,
        progress,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;

    const clampedProgressValue = clamp(progress, 0, 1) * 100;
    const classNameForStyleProps = useStyledSystem<ProgressBarStyleProps>(styleProps, styleParser);

    return (
        <div
            role="progressbar"
            aria-valuenow={clampedProgressValue}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(progressBarClassName, classNameForStyleProps, className)}
            style={style}
        >
            <Box
                className={baymax('animate')}
                width={`${clampedProgressValue}%`}
                height="100%"
                backgroundColor={barColor}
            />
        </div>
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
    barColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    ...tooltipAnchorPropTypes,
    ...progressBarStylePropTypes,
};

ProgressBar.defaultProps = {
    barColor: colors.BLUE_BRIGHT,
    backgroundColor: colors.GRAY_LIGHT_1,
    width: '100%',
    height: 4,
};

export default ProgressBar;
