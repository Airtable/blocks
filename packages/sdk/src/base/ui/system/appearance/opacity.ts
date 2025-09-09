/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, type Config} from '@styled-system/core';
import {type GlobalsNumber} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

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
