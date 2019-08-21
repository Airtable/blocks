// @flow
import {system, Config} from '@styled-system/core';
import {
    type MarginProperty,
    type MarginTopProperty,
    type MarginRightProperty,
    type MarginBottomProperty,
    type MarginLeftProperty,
} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import createPropTypes from '../utils/create_prop_types';
import {type Prop, type Length} from '../utils/types';

export type MarginProps = {|
    margin?: Prop<MarginProperty<Length>>,
    marginTop?: Prop<MarginTopProperty<Length>>,
    marginRight?: Prop<MarginRightProperty<Length>>,
    marginBottom?: Prop<MarginBottomProperty<Length>>,
    marginLeft?: Prop<MarginLeftProperty<Length>>,
    marginX?: Prop<MarginProperty<Length>>,
    marginY?: Prop<MarginProperty<Length>>,
|};

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
export const marginPropTypes = createPropTypes(margin.propNames);
