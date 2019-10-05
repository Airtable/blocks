import {system, Config} from '@styled-system/core';
import {BottomProperty} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {Prop, Length} from '../utils/types';

export type BottomProps = {
    bottom?: Prop<BottomProperty<Length>>;
};

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
export const bottomPropTypes = createStylePropTypes(bottom.propNames);
