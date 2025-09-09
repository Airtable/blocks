/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type TextAlignProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextAlignProps {
    /** Sets the horizontal alignment of the text. */
    textAlign?: OptionalResponsiveProp<TextAlignProperty>;
}

export const config: Config = {textAlign: true};

export const textAlign = system(config);
