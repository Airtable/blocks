/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
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
export const textDecorationPropTypes = createStylePropTypes(textDecoration.propNames);
