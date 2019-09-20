// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type LineHeightProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type LineHeightProps = {|
    lineHeight?: Prop<LineHeightProperty<Length>>,
|};

export const config: Config = {
    lineHeight: {
        property: 'lineHeight',
        scale: 'lineHeights',
    },
};

export const lineHeight = system(config);
export const lineHeightPropTypes = createStylePropTypes(lineHeight.propNames);
