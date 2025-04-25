import PropTypes from 'prop-types';
import {ObjectMap} from '../../../../shared/private_utils';
import createResponsivePropType from './create_responsive_prop_type';

export const stylePropValue = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
export const stylePropType = createResponsivePropType(stylePropValue);

/** @internal */
export default function createStylePropTypes<Key extends string>(
    propNames: Array<Key> = [],
): ObjectMap<Key, typeof stylePropType> {
    const propTypes = {} as ObjectMap<Key, typeof stylePropType>;
    propNames.forEach(propName => {
        propTypes[propName] = stylePropType;
    });
    return propTypes;
}
