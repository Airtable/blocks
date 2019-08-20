// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FontWeightProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FontWeightProps = {|
    fontWeight?: Prop<FontWeightProperty | string>,
|};

export const config: Config = {
    fontWeight: {
        property: 'fontWeight',
        scale: 'fontWeights',
    },
};

export const fontWeight = system(config);
export const fontWeightPropTypes = createPropTypes(fontWeight.propNames);
