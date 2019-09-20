// @flow
import {system, Config} from '@styled-system/core';
import {type TopProperty} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {type Prop, type Length} from '../utils/types';

export type TopProps = {|
    top?: Prop<TopProperty<Length>>,
|};

export const config: Config = {
    top: {
        property: 'top',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'top',
            shouldAllowNegativeNumbers: true,
        }),
    },
};

export const top = system(config);
export const topPropTypes = createStylePropTypes(top.propNames);
