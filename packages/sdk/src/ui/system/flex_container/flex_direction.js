// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FlexDirectionProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexDirectionProps = {|
    flexDirection?: Prop<FlexDirectionProperty>,
|};

export const config: Config = {flexDirection: true};

export const flexDirection = system(config);
export const flexDirectionPropTypes = createStylePropTypes(flexDirection.propNames);
