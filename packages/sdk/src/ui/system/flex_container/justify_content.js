// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type JustifyContentProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type JustifyContentProps = {|
    justifyContent?: Prop<JustifyContentProperty>,
|};

export const config: Config = {justifyContent: true};

export const justifyContent = system(config);
export const justifyContentPropTypes = createPropTypes(justifyContent.propNames);
