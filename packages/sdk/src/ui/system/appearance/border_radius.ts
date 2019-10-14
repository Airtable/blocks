/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import {BorderRadiusProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

/** */
export interface BorderRadiusProps {
    /** Rounds the corners of an element's outer border edge. You can set a single radius to make circular corners, or two radii to make elliptical corners. */
    borderRadius?: Prop<BorderRadiusProperty<Length>>;
}

export const config: Config = {
    borderRadius: {
        property: 'borderRadius',
        scale: 'radii',
    },
};

export const borderRadius = system(config);
export const borderRadiusPropTypes = createStylePropTypes(borderRadius.propNames);
