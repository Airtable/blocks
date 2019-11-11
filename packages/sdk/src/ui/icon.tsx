/** @module @airtable/blocks/ui: Icon */ /** */
import React from 'react';
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
    width,
    WidthProps,
    height,
    HeightProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {iconNamePropType, IconName, allIconPaths, AllIconName} from './icon_config';

/**
 * Style props shared between the {@link Icon} and {@link FieldIcon} components. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link PositionSetProps}
 * * {@link MarginProps}
 *
 * @noInheritDoc
 */
export interface IconStyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
    width,
    height,
);

export const iconStylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Props shared between the {@link Icon} and {@link FieldIcon} components. Also accepts:
 * * {@link IconStyleProps}
 *
 * @noInheritDoc
 */

export interface SharedIconProps extends IconStyleProps, TooltipAnchorProps<SVGSVGElement> {
    /** The width/height of the icon. Defaults to 16. */
    size?: number | string;
    /** The color of the icon. */
    fillColor?: string;
    /** Additional class names to apply to the icon. */
    className?: string;
    /** Additional styles to apply to the icon. */
    style?: React.CSSProperties;
    /** Additional class names to apply to the icon path. */
    pathClassName?: string;
    /** Additional styles to apply to the icon path. */
    pathStyle?: React.CSSProperties;
}

export const sharedIconPropTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fillColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    pathClassName: PropTypes.string,
    pathStyle: PropTypes.object,
    ...tooltipAnchorPropTypes,
    ...iconStylePropTypes,
};

/**
 * Props for the {@link Icon} component. Also accepts:
 * * {@link SharedIconProps}
 *
 * @noInheritDoc
 */
interface IconProps extends SharedIconProps {
    /** The name of the icon. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md). */
    name: IconName;
}

/**
 * A vector icon from the Airtable icon set.
 *
 * @example
 * ```js
 * import {Icon} from '@airtable/blocks/ui';
 *
 * const MyIcon = (
 *     <Icon
 *         name="heart"
 *     />
 * );
 * ```
 */
function Icon(props: IconProps, ref: React.Ref<SVGSVGElement>) {
    const {
        name,
        size = 16,
        fillColor = 'currentColor',
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        pathClassName,
        pathStyle,
        ...styleProps
    } = props;

    const classNameForStyleProps = useStyledSystem<IconStyleProps & WidthProps & HeightProps>(
        {...styleProps, width: size, height: size},
        styleParser,
    );

    const isMicro = typeof size === 'string' ? false : size <= 12;
    const iconName = `${name}${isMicro ? 'Micro' : ''}` as AllIconName;
    const pathData = allIconPaths[iconName];
    if (!pathData) {
        return null;
    }

    const originalSize = isMicro ? 12 : 16;

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${originalSize} ${originalSize}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(classNameForStyleProps, className)}
            style={{
                shapeRendering: 'geometricPrecision',
                ...style,
            }}
        >
            <path
                fillRule="evenodd"
                className={pathClassName}
                style={pathStyle}
                fill={fillColor}
                d={pathData}
            />
        </svg>
    );
}

const ForwardedRefIcon = React.forwardRef<SVGSVGElement, IconProps>(Icon);

ForwardedRefIcon.propTypes = {
    name: iconNamePropType.isRequired,
    ...sharedIconPropTypes,
};

ForwardedRefIcon.displayName = 'Icon';

export default ForwardedRefIcon;
