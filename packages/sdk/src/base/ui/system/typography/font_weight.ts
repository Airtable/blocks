/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type FontWeightProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface FontWeightProps {
    /** Specifies the weight (or boldness) of the font. */
    fontWeight?: OptionalResponsiveProp<FontWeightProperty | string>;
}

export const config: Config = {
    fontWeight: {
        property: 'fontWeight',
        scale: 'fontWeights',
    },
};

export const fontWeight = system(config);
