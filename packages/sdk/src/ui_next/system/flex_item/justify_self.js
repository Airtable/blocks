// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type JustifySelfProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type JustifySelfProps = {|
    justifySelf?: Prop<JustifySelfProperty>,
|};

export const config: Config = {justifySelf: true};

export const justifySelf = system(config);
export const justifySelfPropTypes = createPropTypes(justifySelf.propNames);
