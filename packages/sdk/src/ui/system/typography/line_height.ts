import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {LineHeightProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';

export type LineHeightProps = {
    lineHeight?: Prop<LineHeightProperty<Length>>;
};

export const config: Config = {
    lineHeight: true,
};

export const lineHeight = system(config);
export const lineHeightPropTypes = createStylePropTypes(lineHeight.propNames);
