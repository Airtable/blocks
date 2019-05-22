// @flow
import PropTypes from 'prop-types';
import * as React from 'react';

// TODO(kasra): don't depend on liveapp components.
const _Loader = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/ui/loader/loader',
);

type LoaderPropTypes = {fillColor: string, scale: number};

// Override the default props and then just proxy through to our loader.
/** */
const Loader = ({fillColor = '#888', scale = 0.3}: LoaderPropTypes) => {
    return <_Loader fillColor={fillColor} scale={scale} />;
};

Loader.propTypes = {
    fillColor: PropTypes.string,
    scale: PropTypes.number,
};

export default Loader;
