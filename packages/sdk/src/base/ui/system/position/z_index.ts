/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {ZIndexProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface ZIndexProps {
    /** Sets the z-order of a positioned element and its descendants or flex items. Overlapping elements with larger z-indexes cover those with smaller ones. */
    zIndex?: OptionalResponsiveProp<ZIndexProperty>;
}

export const config: Config = {
    zIndex: {
        property: 'zIndex',
        scale: 'zIndices',
    },
};

export const zIndex = system(config);
