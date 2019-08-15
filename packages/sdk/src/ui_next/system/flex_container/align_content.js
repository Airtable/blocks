// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type AlignContentProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type AlignContentProps = {|
    alignContent?: Prop<AlignContentProperty>,
|};

export const config: Config = {alignContent: true};

export const alignContent = system(config);
export const alignContentPropTypes = createPropTypes(alignContent.propNames);
