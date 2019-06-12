// @flow
import PropTypes from 'prop-types';
import * as React from 'react';

// TODO(kasra): don't depend on liveapp components.
const _Loader = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/ui/loader/loader',
);

type LoaderProps = {|
    fillColor?: string,
    scale?: number,
|};

// Override the default props and then just proxy through to our loader.
/**
 * A loading spinner component.
 *
 * @param {object} [props] The props for the component.
 * @param {string} [props.fillColor='#888'] Fill color for the loading spinner. Gray by default.
 * @param {number} [props.scale=0.3] A scalar for the loader. Increasing the scale increases the size of the loader.
 * @returns A React node.
 * @example
 * import {UI} from '@airtable/blocks';
 *
 * function MyDataComponent() {
 *     if (myDataHasLoaded) {
 *         return <div>Here's your data!</div>;
 *     } else {
 *         return <UI.Loader />
 *     }
 * }
 */
const Loader = ({fillColor = '#888', scale = 0.3}: LoaderProps) => {
    return <_Loader fillColor={fillColor} scale={scale} />;
};

Loader.propTypes = {
    fillColor: PropTypes.string,
    scale: PropTypes.number,
};

export default Loader;
