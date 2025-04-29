/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {TextTransformProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextTransformProps {
    /** Specifies how to capitalize an element's text. It can be used to make text appear in all-uppercase or all-lowercase, or with each word capitalized. */
    textTransform?: OptionalResponsiveProp<TextTransformProperty>;
}

export const config: Config = {
    textTransform: true,
};

export const textTransform = system(config);
export const textTransformPropTypes = createStylePropTypes(textTransform.propNames);
