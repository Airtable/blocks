// @flow
import {system, type Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type BoxShadowProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type BoxShadowProps = {|
    boxShadow?: Prop<BoxShadowProperty>,
|};

export const config: Config = {
    boxShadow: {
        property: 'boxShadow',
        scale: 'shadows',
    },
};

export const boxShadow = system(config);
export const boxShadowPropTypes = createPropTypes(boxShadow.propNames);
