// @flow
import {system, Config} from '@styled-system/core';
import {type PositionProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import {type Prop} from '../utils/types';

export type PositionProps = {|
    position?: Prop<PositionProperty>,
|};

export const config: Config = {position: true};

export const position = system(config);
export const positionPropTypes = createPropTypes(position.propNames);
