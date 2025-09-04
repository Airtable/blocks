/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import {TextDecorationProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

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
