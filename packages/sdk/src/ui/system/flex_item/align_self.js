// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type AlignSelfProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type AlignSelfProps = {|
    alignSelf?: Prop<AlignSelfProperty>,
|};

export const config: Config = {alignSelf: true};

export const alignSelf = system(config);
export const alignSelfPropTypes = createStylePropTypes(alignSelf.propNames);
