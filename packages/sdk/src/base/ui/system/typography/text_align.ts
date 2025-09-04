/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import {TextAlignProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextAlignProps {
    /** Sets the horizontal alignment of the text. */
    textAlign?: OptionalResponsiveProp<TextAlignProperty>;
}

export const config: Config = {textAlign: true};

export const textAlign = system(config);
