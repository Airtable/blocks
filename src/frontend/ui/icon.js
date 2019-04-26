// @flow
const React = window.__requirePrivateModuleFromAirtable('client_server_shared/react/react');
const PropTypes = require('prop-types');
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

    // DEPRECTED (in favor of size).
    scale?: number,
};

/** */
const Icon = ({name, size, scale, fillColor, className, style, pathClassName}: IconProps) => {
    if (size === undefined) {
        size = 16 * (scale !== undefined ? scale : 1);
    }

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
            <path fillRule="evenodd" className={pathClassName} fill={fillColor} d={pathData} />
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

    // DEPRECATED (in favor of size).
    scale: PropTypes.number,
};

// TODO(jb): once we remove the scale prop type completely, we should add a default
// value for the size prop.

module.exports = Icon;
