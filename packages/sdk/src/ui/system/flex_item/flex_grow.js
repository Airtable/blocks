// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type GlobalsNumber} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FlexGrowProps = {|
    flexGrow?: Prop<GlobalsNumber>,
|};

export const config: Config = {flexGrow: true};

export const flexGrow = system(config);
export const flexGrowPropTypes = createStylePropTypes(flexGrow.propNames);
