/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, type Config} from '@styled-system/core';
import {type BorderRadiusProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
