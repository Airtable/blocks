import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FontWeightProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export type FontWeightProps = {
    // Add `string` to support properties from theme scale.
    fontWeight?: Prop<FontWeightProperty | string>;
};

export const config: Config = {
    fontWeight: {
        property: 'fontWeight',
        scale: 'fontWeights',
    },
};

export const fontWeight = system(config);
export const fontWeightPropTypes = createStylePropTypes(fontWeight.propNames);
