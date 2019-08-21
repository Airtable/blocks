// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type OrderProps = {|
    order?: Prop<GlobalsNumber>,
|};

export const config: Config = {order: true};

export const order = system(config);
export const orderPropTypes = createPropTypes(order.propNames);
