// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FlexBasisProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type FlexBasisProps = {|
    flexBasis?: Prop<FlexBasisProperty<Length>>,
|};

export const config: Config = {flexBasis: true};

export const flexBasis = system(config);
export const flexBasisPropTypes = createStylePropTypes(flexBasis.propNames);
