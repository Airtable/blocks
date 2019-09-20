// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FontStyleProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FontStyleProps = {|
    fontStyle?: Prop<FontStyleProperty>,
|};

export const config: Config = {fontStyle: true};

export const fontStyle = system(config);
export const fontStylePropTypes = createStylePropTypes(fontStyle.propNames);
