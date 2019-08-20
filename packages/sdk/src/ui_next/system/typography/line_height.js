// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
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
export const lineHeightPropTypes = createPropTypes(lineHeight.propNames);
