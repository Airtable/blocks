// @flow
import {system, Config} from '@styled-system/core';
import {type MinWidthProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type MinWidthProps = {|
    minWidth?: Prop<MinWidthProperty<Length>>,
|};

export const config: Config = {
    minWidth: {
        property: 'minWidth',
        scale: 'dimensions',
    },
};

export const minWidth = system(config);
export const minWidthPropTypes = createStylePropTypes(minWidth.propNames);
