// @flow
import {system, Config} from '@styled-system/core';
import {type ColorProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import {type Prop} from '../utils/types';

export type TextColorProps = {|
    textColor?: Prop<ColorProperty>,
|};

export const config: Config = {
    textColor: {
        property: 'color',
        scale: 'colors',
    },
};

export const textColor = system(config);
export const textColorPropTypes = createPropTypes(textColor.propNames);
