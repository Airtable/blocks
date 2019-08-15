// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type AlignSelfProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type AlignSelfProps = {|
    alignSelf?: Prop<AlignSelfProperty>,
|};

export const config: Config = {alignSelf: true};

export const alignSelf = system(config);
export const alignSelfPropTypes = createPropTypes(alignSelf.propNames);
