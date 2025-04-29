/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {GlobalsNumber} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface OpacityProps {
    /** Sets the transparency of an element or the degree to which content behind an element is visible. */
    opacity?: OptionalResponsiveProp<GlobalsNumber | string>;
}

export const config: Config = {
    opacity: {
        property: 'opacity',
        scale: 'opacities',
    },
};

export const opacity = system(config);
export const opacityPropTypes = createStylePropTypes(opacity.propNames);
