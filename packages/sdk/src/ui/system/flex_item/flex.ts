import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FlexProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';

export type FlexProps = {
    flex?: Prop<FlexProperty<Length>>;
};

export const config: Config = {flex: true};

export const flex = system(config);
export const flexPropTypes = createStylePropTypes(flex.propNames);
