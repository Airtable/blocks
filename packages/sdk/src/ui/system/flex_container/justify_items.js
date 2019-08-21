// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type JustifyItemsProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type JustifyItemsProps = {|
    justifyItems?: Prop<JustifyItemsProperty>,
|};

export const config: Config = {justifyItems: true};

export const justifyItems = system(config);
export const justifyItemsPropTypes = createPropTypes(justifyItems.propNames);
