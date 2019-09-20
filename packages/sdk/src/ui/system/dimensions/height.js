// @flow
import {system, Config} from '@styled-system/core';
import {type HeightProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type HeightProps = {|
    height?: Prop<HeightProperty<Length>>,
|};

export const config: Config = {
    height: {
        property: 'height',
        scale: 'dimensions',
    },
};

export const height = system(config);
export const heightPropTypes = createStylePropTypes(height.propNames);
