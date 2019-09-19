// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type AlignContentProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type AlignContentProps = {|
    alignContent?: Prop<AlignContentProperty>,
|};

export const config: Config = {alignContent: true};

export const alignContent = system(config);
export const alignContentPropTypes = createStylePropTypes(alignContent.propNames);
