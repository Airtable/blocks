// @flow
import PropTypes from 'prop-types';

export const stylePropValue = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export const stylePropType = PropTypes.oneOfType([
    stylePropValue,
    // Responsive values map to `ResponsivePropObject`
    PropTypes.shape({
        xsmallViewport: stylePropValue,
        smallViewport: stylePropValue,
        mediumViewport: stylePropValue,
        largeViewport: stylePropValue,
    }),
]);

/** @private */
export default function createStylePropTypes(propNames: Array<string> = []) {
    const propTypes = {};
    propNames.forEach(propName => {
        propTypes[propName] = stylePropType;
    });
    return propTypes;
}
