// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FlexWrapProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexWrapProps = {|
    flexWrap?: Prop<FlexWrapProperty>,
|};

export const config: Config = {flexWrap: true};

export const flexWrap = system(config);
export const flexWrapPropTypes = createPropTypes(flexWrap.propNames);
