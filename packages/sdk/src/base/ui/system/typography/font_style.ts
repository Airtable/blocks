/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type FontStyleProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface FontStyleProps {
    /** Sets whether a font should be styled with a normal, italic, or oblique face. */
    fontStyle?: OptionalResponsiveProp<FontStyleProperty>;
}

export const config: Config = {fontStyle: true};

export const fontStyle = system(config);
