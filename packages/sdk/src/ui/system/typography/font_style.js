// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FontStyleProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FontStyleProps = {|
    fontStyle?: Prop<FontStyleProperty>,
|};

export const config: Config = {fontStyle: true};

export const fontStyle = system(config);
export const fontStylePropTypes = createPropTypes(fontStyle.propNames);
