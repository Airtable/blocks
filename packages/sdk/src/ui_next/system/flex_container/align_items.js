// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type AlignItemsProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type AlignItemsProps = {|
    alignItems?: Prop<AlignItemsProperty>,
|};

export const config: Config = {alignItems: true};

export const alignItems = system(config);
export const alignItemsPropTypes = createPropTypes(alignItems.propNames);
