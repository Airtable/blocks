/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FontFamilyProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

/** */
export interface FontFamilyProps {
    /** Specifies a prioritized list of one or more font family names and/or generic family names for the selected element. */
    fontFamily?: Prop<FontFamilyProperty>;
}

export const config: Config = {
    fontFamily: {
        property: 'fontFamily',
        scale: 'fontFamilies',
    },
};

export const fontFamily = system(config);
export const fontFamilyPropTypes = createStylePropTypes(fontFamily.propNames);
