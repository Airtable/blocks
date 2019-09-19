// @flow
import {system, type Config} from '@styled-system/core';
import {type DisplayProperty} from './utils/csstype';
import {type Prop} from './utils/types';
import createStylePropTypes from './utils/create_style_prop_types';

export type DisplayProps = {|
    display?: Prop<DisplayProperty>,
|};

const config: Config = {display: true};

export const display = system(config);
export const displayPropTypes = createStylePropTypes(display.propNames);
