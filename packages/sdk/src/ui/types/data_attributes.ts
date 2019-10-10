/** @internal */
import PropTypes from 'prop-types';

export type DataAttributesProp = {readonly [key: string]: unknown};
export const dataAttributesPropType = PropTypes.object as PropTypes.Requireable<DataAttributesProp>;
