/** @module @airtable/blocks/ui/system: Spacing */ /** */
import {system, type Config} from '@styled-system/core';
import {
    type PaddingProperty,
    type PaddingTopProperty,
    type PaddingRightProperty,
    type PaddingBottomProperty,
    type PaddingLeftProperty,
} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

/** */
export interface PaddingProps {
    /** Sets the padding area on all four sides of an element. It is a shorthand for `paddingTop`, `paddingRight`, `paddingBottom`, and `paddingLeft`. */
    padding?: OptionalResponsiveProp<PaddingProperty<Length>>;
    /** Sets the height of the padding area on the top side of an element. */
    paddingTop?: OptionalResponsiveProp<PaddingTopProperty<Length>>;
    /** Sets the width of the padding area on the right side of an element. */
    paddingRight?: OptionalResponsiveProp<PaddingRightProperty<Length>>;
    /** Sets the height of the padding area on the bottom side of an element. */
    paddingBottom?: OptionalResponsiveProp<PaddingBottomProperty<Length>>;
    /** Sets the width of the padding area on the left side of an element. */
    paddingLeft?: OptionalResponsiveProp<PaddingLeftProperty<Length>>;
    /** Sets the width of the padding area on the left and right sides of an element. */
    paddingX?: OptionalResponsiveProp<PaddingProperty<Length>>;
    /** Sets the height of the padding area on the top and bottom sides of an element. */
    paddingY?: OptionalResponsiveProp<PaddingProperty<Length>>;
}

export const config: Config = {
    padding: {
        property: 'padding',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'padding',
        }),
    },
    paddingTop: {
        property: 'paddingTop',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingTop',
        }),
    },
    paddingRight: {
        property: 'paddingRight',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingRight',
        }),
    },
    paddingBottom: {
        property: 'paddingBottom',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingBottom',
        }),
    },
    paddingLeft: {
        property: 'paddingLeft',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingLeft',
        }),
    },
    paddingX: {
        properties: ['paddingLeft', 'paddingRight'],
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingX',
        }),
    },
    paddingY: {
        properties: ['paddingTop', 'paddingBottom'],
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'paddingY',
        }),
    },
};

export const padding = system(config);
