/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {TopProperty} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface TopProps {
    /** Specifies the vertical position of a positioned element. It has no effect on non-positioned elements. */
    top?: OptionalResponsiveProp<TopProperty<Length>>;
}

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
