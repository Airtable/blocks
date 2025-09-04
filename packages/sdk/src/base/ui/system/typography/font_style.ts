/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import {FontStyleProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface FontStyleProps {
    /** Sets whether a font should be styled with a normal, italic, or oblique face. */
    fontStyle?: OptionalResponsiveProp<FontStyleProperty>;
}

export const config: Config = {fontStyle: true};

export const fontStyle = system(config);
