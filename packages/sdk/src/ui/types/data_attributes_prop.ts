/** @hidden */ /** */
import PropTypes from 'prop-types';

/**
 * Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.
 *
 * @hidden
 */

export interface DataAttributesProp {
    readonly [key: string]: unknown;
}

export const dataAttributesPropType = PropTypes.object as PropTypes.Requireable<{
    readonly [key: string]: unknown;
}>;
