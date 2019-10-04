// @flow
import PropTypes from 'prop-types';

/** @private */
export default function createResponsivePropType(propType: ReactPropsCheckType) {
    return PropTypes.oneOfType([
        propType,
        PropTypes.shape({
            xsmallViewport: propType,
            smallViewport: propType,
            mediumViewport: propType,
            largeViewport: propType,
        }),
    ]);
}
