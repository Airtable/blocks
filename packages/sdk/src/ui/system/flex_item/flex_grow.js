// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexGrowProps = {|
    flexGrow?: Prop<GlobalsNumber>,
|};

export const config: Config = {flexGrow: true};

export const flexGrow = system(config);
export const flexGrowPropTypes = createPropTypes(flexGrow.propNames);
