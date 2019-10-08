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
import iconConfig from './icon_config';

export interface StyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
    width,
    height,
);

export const stylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

export interface SharedIconProps extends TooltipAnchorProps<SVGElement>, StyleProps {
    size?: number | string;
    fillColor?: string;
    className?: string;
    style?: React.CSSProperties;
    pathClassName?: string;
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
    ...stylePropTypes,
};

/**
 * @typedef {object} IconProps
 * @property {string} name The name of the icon. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md).
 * @property {number} [size=16] The width/height of the icon.
 * @property {string} [fillColor] The color of the icon.
 * @property {string} [className] Additional class names to apply to the icon.
 * @property {object} [style] Additional styles to apply to the icon.
 * @property {string} [pathClassName] Additional class names to apply to the icon path.
 * @property {object} [pathStyle] Additional styles to apply to the icon path.
 */
interface IconProps extends SharedIconProps {
    name: string;
}

/**
 * A vector icon from the Airtable icon set.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {IconProps} props
 *
 * @example
 * ```js
 * import {Button, Icon} from '@airtable/blocks/ui';
 *
 * const LikeButton = (
 *     <Button
 *         theme={Button.themes.RED}
 *         onClick={() => alert('Liked!')}
 *     >
 *         <Icon
 *             name="heart"
 *             fillColor="#fff"
 *             style={{marginRight: 8}}
 *         />
 *         Like
 *     </Button>
 * );
 * ```
 */
function Icon({
    name,
    size = 16,
    fillColor = 'currentColor',
    onMouseEnter,
    onMouseLeave,
    onClick,
    hasOnClick,
    className,
    style,
    pathClassName,
    pathStyle,
    ...styleProps
}: IconProps) {
    const classNameForStyleProps = useStyledSystem<StyleProps & WidthProps & HeightProps>(
        {...styleProps, width: size, height: size},
        styleParser,
    );

    const isMicro = size <= 12;
    const pathData = iconConfig[`${name}${isMicro ? 'Micro' : ''}`];
    if (!pathData) {
        return null;
    }

    const originalSize = isMicro ? 12 : 16;

    return (
        <svg
            viewBox={`0 0 ${originalSize} ${originalSize}`}
            // TODO (stephen): remove tooltip anchor props
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

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    ...sharedIconPropTypes,
};

export default Icon;
