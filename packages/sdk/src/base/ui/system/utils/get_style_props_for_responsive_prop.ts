import {invariant} from '../../../../shared/error_utils';
import {values, has, ObjectMap, keys} from '../../../../shared/private_utils';
import {AllStylesProps} from '..';
import {ResponsivePropObject} from './types';

/**
 * Given a styled system scale, convert a responsive prop object into a style props object.
 * Typically used for variant APIs that compose multiple style props.
 *
 * @internal
 */
export default function getStylePropsForResponsiveProp<T extends string>(
    responsivePropObject: ResponsivePropObject<T>,
    scale: ObjectMap<T, {[styleProp: string]: unknown} | null | undefined>,
): Partial<AllStylesProps> {
    const responsiveStyleProps: ObjectMap<string, any> = {};

    for (const viewportKey of keys(responsivePropObject)) {
        const scaleValueForViewport = responsivePropObject[viewportKey];
        invariant(scaleValueForViewport, 'scaleValueForViewport');
        const propsForViewport: {[styleProp: string]: unknown} | null | undefined =
            scale[scaleValueForViewport];

        invariant(propsForViewport !== undefined && propsForViewport !== null, 'propsForViewport');

        for (const propForViewportKey of keys(propsForViewport)) {
            if (!has(responsiveStyleProps, propForViewportKey)) {
                responsiveStyleProps[propForViewportKey] = {};
            }
            responsiveStyleProps[propForViewportKey][viewportKey] =
                propsForViewport[propForViewportKey];
        }
    }

    /**
     * @internal
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
