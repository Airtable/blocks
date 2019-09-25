// @flow
import PropTypes from 'prop-types';
import createResponsivePropType from './create_responsive_prop_type';

export const stylePropValue = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
export const stylePropType = createResponsivePropType(stylePropValue);

/** @private */
export default function createStylePropTypes(propNames: Array<string> = []) {
    const propTypes = {};
    propNames.forEach(propName => {
        propTypes[propName] = stylePropType;
    });
    return propTypes;
}
