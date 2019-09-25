// @flow
import PropTypes from 'prop-types';

/** @private */
export default function createResponsivePropType(propType: ReactPropsCheckType) {
    return PropTypes.oneOfType([
        propType,
        // Responsive values map to `ResponsivePropObject`
        PropTypes.shape({
            xsmallViewport: propType,
            smallViewport: propType,
            mediumViewport: propType,
            largeViewport: propType,
        }),
    ]);
}
