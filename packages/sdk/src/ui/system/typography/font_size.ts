/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FontSizeProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface FontSizeProps {
    /** Sets the size of the font. This property is also used to compute the size of `em`, `ex`, and other relative length units. */
    fontSize?: OptionalResponsiveProp<FontSizeProperty<Length>>;
}

export const config: Config = {
    fontSize: {
        property: 'fontSize',
        scale: 'fontSizes',
    },
};

export const fontSize = system(config);
export const fontSizePropTypes = createStylePropTypes(fontSize.propNames);
