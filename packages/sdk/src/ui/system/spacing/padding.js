// @flow
import {system, Config} from '@styled-system/core';
import {
    type PaddingProperty,
    type PaddingTopProperty,
    type PaddingRightProperty,
    type PaddingBottomProperty,
    type PaddingLeftProperty,
} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type Prop, type Length} from '../utils/types';

export type PaddingProps = {|
    padding?: Prop<PaddingProperty<Length>>,
    paddingTop?: Prop<PaddingTopProperty<Length>>,
    paddingRight?: Prop<PaddingRightProperty<Length>>,
    paddingBottom?: Prop<PaddingBottomProperty<Length>>,
    paddingLeft?: Prop<PaddingLeftProperty<Length>>,
    paddingX?: Prop<PaddingProperty<Length>>,
    paddingY?: Prop<PaddingProperty<Length>>,
|};

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
export const paddingPropTypes = createStylePropTypes(padding.propNames);
