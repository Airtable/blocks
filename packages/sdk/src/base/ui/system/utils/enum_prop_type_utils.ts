import PropTypes from 'prop-types';
import {values} from '../../../../shared/private_utils';
import createResponsivePropType from './create_responsive_prop_type';

/**
 * Creates a React propType for a provided enum.
 *
 * @hidden
 */
export function createPropTypeFromEnum<T extends string>(
    enumData: {[K in T]: T},
): PropTypes.Requireable<T> {
    return PropTypes.oneOf(values(enumData));
}

/**
 * Creates a responsive React propType for a provided enum.
 *
 * This allows the prop to be either a valid enum property, or a map of viewport sizes to valid enum
 * properties.
 *
 * @hidden
 */
export function createResponsivePropTypeFromEnum<T extends string>(
    enumData: {[K in T]: T},
): PropTypes.Validator<any> {
    const propType: PropTypes.Requireable<T> = createPropTypeFromEnum(enumData);
    return createResponsivePropType(propType);
}
