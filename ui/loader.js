// @flow
const React = require('client/blocks/sdk/ui/react');
const _Loader = require('client_server_shared/react/ui/loader/loader');

type LoaderPropTypes = {fillColor: string, scale: number};

// Override the default props and then just proxy through to our loader.
const Loader = ({fillColor = '#888', scale = 0.3}: LoaderPropTypes) => {
    return <_Loader fillColor={fillColor} scale={scale} />;
};

Loader.propTypes = {
    fillColor: React.PropTypes.string,
    scale: React.PropTypes.number,
};

module.exports = Loader;
