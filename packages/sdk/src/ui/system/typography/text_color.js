// @flow
import {system, Config} from '@styled-system/core';
import {type ColorProperty} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type Prop} from '../utils/types';

export type TextColorProps = {|
    textColor?: Prop<ColorProperty>,
|};

export const config: Config = {
    textColor: {
        property: 'color',
        scale: 'textColors',
    },
};

export const textColor = system(config);
export const textColorPropTypes = createStylePropTypes(textColor.propNames);
