// @flow
import PropTypes from 'prop-types';
import {compose} from '@styled-system/core';
import {cx} from 'emotion';
import {invariant} from '../error_utils';
import useStyledSystem from './use_styled_system';
import {
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

const React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');
const Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); 
const iconConfig = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/assets/icon_config',
);

export type StyleProps = {|
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
);

export const stylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

export type SharedIconProps = {|
    size?: number,
    fillColor?: string,
    className?: string,
    style?: {[string]: mixed},
    pathClassName?: string,
    pathStyle?: {[string]: mixed},
    ...StyleProps,
|};

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
type IconProps = {|
    name: string,
    ...SharedIconProps,
|};

/**
 * A vector icon from the Airtable icon set.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {IconProps} props
 *
 * @example
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
 */
const Icon = (props: IconProps) => {
    const {
        name,
        size,
        fillColor,
        className,
        style,
        pathClassName,
        pathStyle,
        ...styleProps
    } = props;
    const classNameForStyleProps = useStyledSystem(styleProps, styleParser);

    invariant(size, 'icon size');
    const isMicro = size <= 12;
    const pathData = iconConfig[`${name}${isMicro ? 'Micro' : ''}`];
    if (!pathData) {
        return null;
    }

    return (
        <Svg
            width={size}
            height={size}
            originalWidth={isMicro ? 12 : 16}
            originalHeight={isMicro ? 12 : 16}
            className={cx(classNameForStyleProps, className)}
            style={style}
        >
            <path
                fillRule="evenodd"
                className={pathClassName}
                style={pathStyle}
                fill={fillColor}
                d={pathData}
            />
        </Svg>
    );
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    fillColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    pathClassName: PropTypes.string,
    pathStyle: PropTypes.object,
};

Icon.defaultProps = {
    size: 16,
};

export default Icon;
