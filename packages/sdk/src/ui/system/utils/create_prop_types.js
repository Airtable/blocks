// @flow
import PropTypes from 'prop-types';

export const propType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
]);

/** @private */
export default function createPropTypes(propNames: Array<string> = []) {
    const propTypes = {};
    propNames.forEach(propName => {
        propTypes[propName] = propType;
    });
    return propTypes;
}
