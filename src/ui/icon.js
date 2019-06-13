// @flow
import PropTypes from 'prop-types';

const React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');
const Svg = window.__requirePrivateModuleFromAirtable('client_server_shared/react/assets/svg'); // TODO(kasra): don't depend on liveapp components.
const iconConfig = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/assets/icon_config',
);

type IconProps = {
    name: string,
    size?: number,
    fillColor?: string,
    className?: string,
    style?: Object,
    pathClassName?: string,
    pathStyle?: Object,
};

/**
 * A vector icon from the Airtable icon set.
 *
 * @param {object} props The props for the component.
 * @param {string} props.name The name of the icon. For a comprehensive list, refer to the "Icon" section of the [styleguide](https://airtable.com/styleguide).
 * @param {number} [props.size=16] The width/height of the icon.
 * @param {string} [props.fillColor] The color of the icon.
 * @param {string} [props.className] Additional class names to apply to the icon.
 * @param {object} [props.style] Additional styles to apply to the icon.
 * @param {string} [props.pathClassName] Additional class names to apply to the icon path.
 * @param {object} [props.pathStyle] Additional styles to apply to the icon path.
 * @returns A React node.
 *
 * @example
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
const Icon = ({
    name,
    size = 16,
    fillColor,
    className,
    style,
    pathClassName,
    pathStyle,
}: IconProps) => {
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
    size: PropTypes.number,
    fillColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    pathClassName: PropTypes.string,
    pathStyle: PropTypes.object,
};

export default Icon;
