// @flow
import {invariant} from '../../../error_utils';
import {values, has} from '../../../private_utils';
import {type AllStylesProps} from '../';
import {type ResponsivePropObject} from './types';

/**
 * Given a styled system scale, convert a responsive prop object into a style props object.
 * Typically used for variant APIs that compose multiple style props.
 * @private
 */
export default function getStylePropsForResponsiveProp<T>(
    responsivePropObject: ResponsivePropObject<T>,
    scale: {[option: T]: {[styleProp: string]: mixed}},
): $Shape<AllStylesProps> {
    const responsiveStyleProps = {};

    for (const viewportKey of Object.keys(responsivePropObject)) {
        const scaleValueForViewport = responsivePropObject[viewportKey];
        invariant(scaleValueForViewport, 'scaleValueForViewport');
        const propsForViewport = scale[scaleValueForViewport];

        for (const propForViewportKey of Object.keys(propsForViewport)) {
            if (!has(responsiveStyleProps, propForViewportKey)) {
                responsiveStyleProps[propForViewportKey] = {};
            }
            responsiveStyleProps[propForViewportKey][viewportKey] =
                propsForViewport[propForViewportKey];
        }
    }

    /**
     * @private
     * If multiple values are the same for each viewport, just use a string value.
     *
     * For example turn the following object:
     *
     * ```
     *  "fontSize": {
     *      "smallViewport": "13px",
     *      "mediumViewport": "15px"
     *  },
     *  "fontFamily": {
     *      "smallViewport": "default",
     *      "mediumViewport": "default"
     *  },
     * ```
     *
     * Into:
     *
     * ```
     *  "fontSize": {
     *      "smallViewport": "13px",
     *      "mediumViewport": "15px"
     *  },
     *  "fontFamily": "default"
     * ```
     */
    for (const stylePropKey of Object.keys(responsiveStyleProps)) {
        let shouldConsolidateValue = true;
        let prevValue;

        for (const value of values(responsiveStyleProps[stylePropKey])) {
            if (prevValue === undefined) {
                prevValue = value;
            } else if (prevValue !== value) {
                shouldConsolidateValue = false;
                break;
            }
        }

        if (shouldConsolidateValue) {
            responsiveStyleProps[stylePropKey] = prevValue;
        }
    }

    return responsiveStyleProps;
}
