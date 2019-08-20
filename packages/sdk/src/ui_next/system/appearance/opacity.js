// @flow
import {system, type Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type OpacityProps = {|
    opacity?: Prop<GlobalsNumber | string>,
|};

export const config: Config = {
    opacity: {
        property: 'opacity',
        scale: 'opacities',
    },
};

export const opacity = system(config);
export const opacityPropTypes = createPropTypes(opacity.propNames);
