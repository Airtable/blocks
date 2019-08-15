// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FlexDirectionProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexDirectionProps = {|
    flexDirection?: Prop<FlexDirectionProperty>,
|};

export const config: Config = {flexDirection: true};

export const flexDirection = system(config);
export const flexDirectionPropTypes = createPropTypes(flexDirection.propNames);
