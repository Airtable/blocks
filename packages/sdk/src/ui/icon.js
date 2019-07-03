// @flow
import PropTypes from 'prop-types';

const React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');
const Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); 
const iconConfig = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/assets/icon_config',
);

/**
 * @typedef {object} IconProps
 * @property {string} name The name of the icon. For a comprehensive list, refer to the "Icon" section of the [styleguide](https://airtable.com/styleguide).
 * @property {number} [size=16] The width/height of the icon.
 * @property {string} [fillColor] The color of the icon.
 * @property {string} [className] Additional class names to apply to the icon.
 * @property {object} [style] Additional styles to apply to the icon.
 * @property {string} [pathClassName] Additional class names to apply to the icon path.
 * @property {object} [pathStyle] Additional styles to apply to the icon path.
 */
type IconProps = {
    name: string,
    size: number,
    fillColor?: string,
    className?: string,
    style?: Object,
    pathClassName?: string,
    pathStyle?: Object,
};

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
    const {name, size, fillColor, className, style, pathClassName, pathStyle} = props;

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
            className={className}
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
    size: PropTypes.number.isRequired,
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
