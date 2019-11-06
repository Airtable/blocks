/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {LetterSpacingProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

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
export const letterSpacingPropTypes = createStylePropTypes(letterSpacing.propNames);
