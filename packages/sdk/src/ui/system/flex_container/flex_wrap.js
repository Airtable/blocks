// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FlexWrapProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexWrapProps = {|
    flexWrap?: Prop<FlexWrapProperty>,
|};

export const config: Config = {flexWrap: true};

export const flexWrap = system(config);
export const flexWrapPropTypes = createStylePropTypes(flexWrap.propNames);
