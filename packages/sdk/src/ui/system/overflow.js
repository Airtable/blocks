// @flow
import {system, Config} from '@styled-system/core';
import {
    type OverflowProperty,
    type OverflowXProperty,
    type OverflowYProperty,
} from './utils/csstype';
import {type Prop} from './utils/types';
import createStylePropTypes from './utils/create_style_prop_types';

export type OverflowProps = {|
    overflow?: Prop<OverflowProperty>,
    overflowY?: Prop<OverflowXProperty>,
    overflowX?: Prop<OverflowYProperty>,
|};

const config: Config = {overflow: true, overflowY: true, overflowX: true};

export const overflow = system(config);
export const overflowPropTypes = createStylePropTypes(overflow.propNames);
