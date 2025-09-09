/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type TextTransformProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextTransformProps {
    /** Specifies how to capitalize an element's text. It can be used to make text appear in all-uppercase or all-lowercase, or with each word capitalized. */
    textTransform?: OptionalResponsiveProp<TextTransformProperty>;
}

export const config: Config = {
    textTransform: true,
};

export const textTransform = system(config);
