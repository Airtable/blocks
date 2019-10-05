import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {GlobalsNumber} from '../utils/csstype';
import {Prop} from '../utils/types';

export type OpacityProps = {
    // Add `string` to support properties from theme scale.
    opacity?: Prop<GlobalsNumber | string>;
};

export const config: Config = {
    opacity: {
        property: 'opacity',
        scale: 'opacities',
    },
};

export const opacity = system(config);
export const opacityPropTypes = createStylePropTypes(opacity.propNames);
