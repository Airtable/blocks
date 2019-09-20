// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type JustifyItemsProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type JustifyItemsProps = {|
    justifyItems?: Prop<JustifyItemsProperty>,
|};

export const config: Config = {justifyItems: true};

export const justifyItems = system(config);
export const justifyItemsPropTypes = createStylePropTypes(justifyItems.propNames);
