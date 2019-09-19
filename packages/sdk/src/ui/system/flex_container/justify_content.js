// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type JustifyContentProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type JustifyContentProps = {|
    justifyContent?: Prop<JustifyContentProperty>,
|};

export const config: Config = {justifyContent: true};

export const justifyContent = system(config);
export const justifyContentPropTypes = createStylePropTypes(justifyContent.propNames);
