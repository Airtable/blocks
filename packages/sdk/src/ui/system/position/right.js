// @flow
import {system, Config} from '@styled-system/core';
import {type RightProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {type Prop, type Length} from '../utils/types';

export type RightProps = {|
    right?: Prop<RightProperty<Length>>,
|};

export const config: Config = {
    right: {
        property: 'right',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'right',
            shouldAllowNegativeNumbers: true,
        }),
    },
};

export const right = system(config);
export const rightPropTypes = createPropTypes(right.propNames);
