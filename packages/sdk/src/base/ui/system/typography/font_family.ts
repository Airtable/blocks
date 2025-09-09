/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type FontFamilyProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface FontFamilyProps {
    /** Specifies a prioritized list of one or more font family names and/or generic family names for the selected element. */
    fontFamily?: OptionalResponsiveProp<FontFamilyProperty>;
}

export const config: Config = {
    fontFamily: {
        property: 'fontFamily',
        scale: 'fontFamilies',
    },
};

export const fontFamily = system(config);
