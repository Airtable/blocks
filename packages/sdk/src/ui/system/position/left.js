// @flow
import {system, Config} from '@styled-system/core';
import {type LeftProperty} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {type Prop, type Length} from '../utils/types';

export type LeftProps = {|
    left?: Prop<LeftProperty<Length>>,
|};

export const config: Config = {
    left: {
        property: 'left',
        scale: 'space',
        transform: ensureNumbersAreWithinScale({
            propertyName: 'left',
            shouldAllowNegativeNumbers: true,
        }),
    },
};

export const left = system(config);
export const leftPropTypes = createStylePropTypes(left.propNames);
