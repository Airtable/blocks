/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {BoxShadowProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface BoxShadowProps {
    /** Adds shadow effects around an element's frame. You can set multiple effects separated by commas. A box shadow is described by X and Y offsets relative to the element, blur and spread radii, and color. */
    boxShadow?: OptionalResponsiveProp<BoxShadowProperty>;
}

export const config: Config = {
    boxShadow: {
        property: 'boxShadow',
        scale: 'shadows',
    },
};

export const boxShadow = system(config);
export const boxShadowPropTypes = createStylePropTypes(boxShadow.propNames);
