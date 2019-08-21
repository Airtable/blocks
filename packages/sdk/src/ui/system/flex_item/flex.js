// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type FlexProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type FlexProps = {|
    flex?: Prop<FlexProperty<Length>>,
|};

export const config: Config = {flex: true};

export const flex = system(config);
export const flexPropTypes = createPropTypes(flex.propNames);
