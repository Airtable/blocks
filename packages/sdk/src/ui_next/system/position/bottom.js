// @flow
import {system, Config} from '@styled-system/core';
import {type BottomProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {type Prop, type Length} from '../utils/types';

export type BottomProps = {|
    bottom?: Prop<BottomProperty<Length>>,
|};

export const config: Config = {
    bottom: {
        property: 'bottom',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'bottom',
            shouldAllowNegativeNumbers: true,
        }),
    },
};

export const bottom = system(config);
export const bottomPropTypes = createPropTypes(bottom.propNames);
