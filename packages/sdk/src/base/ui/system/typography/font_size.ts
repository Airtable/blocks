/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type FontSizeProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

/** */
export interface FontSizeProps {
    /** Sets the size of the font. This property is also used to compute the size of `em`, `ex`, and other relative length units. */
    fontSize?: OptionalResponsiveProp<FontSizeProperty<Length>>;
}

export const config: Config = {
    fontSize: {
        property: 'fontSize',
        scale: 'fontSizes',
    },
};

export const fontSize = system(config);
