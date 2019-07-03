// @flow
import PropTypes from 'prop-types';
import * as React from 'react';

const _Loader = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/react/ui/loader/loader',
);

/**
 * @typedef {object} LoaderProps
 * @property {string} [fillColor='#888'] The color of the loading spinner.
 * @property {number} [scale=0.3] A scalar for the loader. Increasing the scale increases the size of the loader.
 */
type LoaderProps = {|
    fillColor: string,
    scale: number,
|};

/**
 * A loading spinner component.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {LoaderProps} props
 *
 * @example
 * import {Loader} from '@airtable/blocks/ui';
 *
 * function MyDataComponent() {
 *     if (myDataHasLoaded) {
 *         return <div>Here's your data!</div>;
 *     } else {
 *         return <Loader />
 *     }
 * }
 */
const Loader = (props: LoaderProps) => {
    const {fillColor, scale} = props;
    return <_Loader fillColor={fillColor} scale={scale} />;
};

Loader.propTypes = {
    fillColor: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
};

Loader.defaultProps = {
    fillColor: '#888',
    scale: 0.3,
};

export default Loader;
