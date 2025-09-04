/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {BottomProperty} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface BottomProps {
    /** Specifies the vertical position of a positioned element. It has no effect on non-positioned elements. */
    bottom?: OptionalResponsiveProp<BottomProperty<Length>>;
}

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
