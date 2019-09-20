// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type TextAlignProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type TextAlignProps = {|
    textAlign?: Prop<TextAlignProperty>,
|};

export const config: Config = {textAlign: true};

export const textAlign = system(config);
export const textAlignPropTypes = createStylePropTypes(textAlign.propNames);
