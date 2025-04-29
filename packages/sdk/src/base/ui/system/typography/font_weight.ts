/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FontWeightProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

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
export const fontWeightPropTypes = createStylePropTypes(fontWeight.propNames);
