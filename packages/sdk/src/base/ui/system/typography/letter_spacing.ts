/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, type Config} from '@styled-system/core';
import {type LetterSpacingProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

/** */
export interface LetterSpacingProps {
    /** Sets the spacing behavior between text characters. */
    letterSpacing?: OptionalResponsiveProp<LetterSpacingProperty<Length> | string>;
}

export const config: Config = {
    letterSpacing: {
        property: 'letterSpacing',
        scale: 'letterSpacing',
    },
};

export const letterSpacing = system(config);
