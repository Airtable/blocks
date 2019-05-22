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
};

/** */
const Icon = ({name, size = 16, fillColor, className, style, pathClassName}: IconProps) => {
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
};

export default Icon;
