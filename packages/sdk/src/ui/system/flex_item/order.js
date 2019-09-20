// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type OrderProps = {|
    order?: Prop<GlobalsNumber>,
|};

export const config: Config = {order: true};

export const order = system(config);
export const orderPropTypes = createStylePropTypes(order.propNames);
