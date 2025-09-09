/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type TextDecorationProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextDecorationProps {
    /**
     * Sets the appearance of decorative lines on text.
     */
    textDecoration?: OptionalResponsiveProp<TextDecorationProperty>;
}

export const config: Config = {
    textDecoration: true,
};

export const textDecoration = system(config);
