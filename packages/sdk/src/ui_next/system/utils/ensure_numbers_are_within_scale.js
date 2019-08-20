// @flow
import {get} from '@styled-system/core';
import {spawnError} from '../../../error_utils';

/** @private */
function isNumber(n: mixed): boolean %checks {
    return typeof n === 'number' && !isNaN(n);
}

/** @private */
export default function ensureNumbersAreWithinScale(params: {
    propertyName: string,
    shouldAllowNegativeNumbers?: boolean,
}) {
    return (value: mixed, scale: Array<number>) => {
        if (!Array.isArray(scale)) {
            throw spawnError('The scale for "%s" should be an Array', params.propertyName);
        }

        if (!isNumber(value)) {
            return get(scale, value, value);
        }

        if (!Number.isInteger(value)) {
            throw spawnError(
                'The number you passed for "%s" is not supported. To use a pixel value, pass the string "%spx" instead.',
                params.propertyName,
                value,
            );
        }

        const isValueNegative = value < 0;

        if (isValueNegative && !params.shouldAllowNegativeNumbers) {
            throw spawnError(
                'The scale for the "%s" property does not support negative values. To use a pixel value, pass the string "%spx" instead.',
                params.propertyName,
                value,
            );
        }

        const absoluteValue = Math.abs(value);

        if (absoluteValue >= scale.length) {
            throw spawnError(
                'The number you passed for "%s" falls out the scale. To use a pixel value, pass the string "%spx" instead.',
                params.propertyName,
                value,
            );
        }

        const valueFromScale = scale[absoluteValue];
        return valueFromScale * (isValueNegative ? -1 : 1);
    };
}
