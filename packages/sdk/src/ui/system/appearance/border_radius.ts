import {system, Config} from '@styled-system/core';
import {BorderRadiusProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type BorderRadiusProps = {
    borderRadius?: Prop<BorderRadiusProperty<Length>>;
};

export const config: Config = {
    borderRadius: {
        property: 'borderRadius',
        scale: 'radii',
    },
};

export const borderRadius = system(config);
export const borderRadiusPropTypes = createStylePropTypes(borderRadius.propNames);
