/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {RightProperty} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface RightProps {
    /** Specifies the horizontal position of a positioned element. It has no effect on non-positioned elements. */
    right?: OptionalResponsiveProp<RightProperty<Length>>;
}

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
export const rightPropTypes = createStylePropTypes(right.propNames);
