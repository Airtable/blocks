/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {LeftProperty} from '../utils/csstype';
import ensureNumbersAreWithinScale from '../utils/ensure_numbers_are_within_scale';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface LeftProps {
    /** Specifies the horizontal position of a positioned element. It has no effect on non-positioned elements. */
    left?: OptionalResponsiveProp<LeftProperty<Length>>;
}

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
