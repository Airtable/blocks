/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type ColorProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface TextColorProps {
    /**
     * Sets the foreground color value of an element's text and text decorations, and sets the `currentcolor` value.
     *
     * @see {@link colors}
     */
    textColor?: OptionalResponsiveProp<ColorProperty>;
}

export const config: Config = {
    textColor: {
        property: 'color',
        scale: 'textColors',
    },
};

export const textColor = system(config);
