/** @module @airtable/blocks/ui/system: Spacing */ /** */
import {system, Config} from '@styled-system/core';
import {
    MarginProperty,
    MarginTopProperty,
    MarginRightProperty,
    MarginBottomProperty,
    MarginLeftProperty,
} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import createStylePropTypes from '../utils/create_style_prop_types';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface MarginProps {
    /** Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`, `marginRight`, `marginBottom`, and `marginLeft`. */
    margin?: OptionalResponsiveProp<MarginProperty<Length>>;
    /** Sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginTop?: OptionalResponsiveProp<MarginTopProperty<Length>>;
    /** Sets the margin area on the right of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginRight?: OptionalResponsiveProp<MarginRightProperty<Length>>;
    /** Sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginBottom?: OptionalResponsiveProp<MarginBottomProperty<Length>>;
    /** Sets the margin area on the left of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginLeft?: OptionalResponsiveProp<MarginLeftProperty<Length>>;
    /** Sets the margin area on the top and bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginX?: OptionalResponsiveProp<MarginProperty<Length>>;
    /** Sets the margin area on the left and right of an element. A positive value places it farther from its neighbors, while a negative value places it closer. */
    marginY?: OptionalResponsiveProp<MarginProperty<Length>>;
}

export const config: Config = {
    margin: {
        property: 'margin',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'margin',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginTop: {
        property: 'marginTop',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginTop',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginRight: {
        property: 'marginRight',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginRight',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginBottom: {
        property: 'marginBottom',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginBottom',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginLeft: {
        property: 'marginLeft',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginLeft',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginX: {
        properties: ['marginLeft', 'marginRight'],
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginX',
            shouldAllowNegativeNumbers: true,
        }),
    },
    marginY: {
        properties: ['marginTop', 'marginBottom'],
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'marginY',
            shouldAllowNegativeNumbers: true,
        }),
    },
};

export const margin = system(config);
export const marginPropTypes = createStylePropTypes(margin.propNames);
