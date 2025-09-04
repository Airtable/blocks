/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import {BorderRadiusProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface BorderRadiusProps {
    /** Rounds the corners of an element's outer border edge. You can set a single radius to make circular corners, or two radii to make elliptical corners. */
    borderRadius?: OptionalResponsiveProp<BorderRadiusProperty<Length>>;
}

export const config: Config = {
    borderRadius: {
        property: 'borderRadius',
        scale: 'radii',
    },
};

export const borderRadius = system(config);
