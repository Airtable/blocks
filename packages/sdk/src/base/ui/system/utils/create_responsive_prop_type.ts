import PropTypes from 'prop-types';

/** @internal */
export default function createResponsivePropType(
    propType: PropTypes.Validator<any>,
): PropTypes.Validator<any> {
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
