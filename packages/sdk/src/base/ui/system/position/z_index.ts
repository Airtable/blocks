/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, type Config} from '@styled-system/core';
import {type ZIndexProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

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
