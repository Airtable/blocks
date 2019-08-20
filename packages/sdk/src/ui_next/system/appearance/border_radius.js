// @flow
import {system, type Config} from '@styled-system/core';
import {type BorderRadiusProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createPropTypes from '../utils/create_prop_types';

export type BorderRadiusProps = {|
    borderRadius?: Prop<BorderRadiusProperty<Length>>,
|};

export const config: Config = {
    borderRadius: {
        property: 'borderRadius',
        scale: 'radii',
    },
};

export const borderRadius = system(config);
export const borderRadiusPropTypes = createPropTypes(borderRadius.propNames);
