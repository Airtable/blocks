/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import {FontFamilyProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

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
