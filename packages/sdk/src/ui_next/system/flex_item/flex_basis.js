// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FlexBasisProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type FlexBasisProps = {|
    flexBasis?: Prop<FlexBasisProperty<Length>>,
|};

export const config: Config = {flexBasis: true};

export const flexBasis = system(config);
export const flexBasisPropTypes = createPropTypes(flexBasis.propNames);
