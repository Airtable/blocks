// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexShrinkProps = {|
    flexShrink?: Prop<GlobalsNumber>,
|};

export const config: Config = {flexShrink: true};

export const flexShrink = system(config);
export const flexShrinkPropTypes = createStylePropTypes(flexShrink.propNames);
