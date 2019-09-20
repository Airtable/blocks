// @flow
import {system, Config} from '@styled-system/core';
import {type WidthProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type WidthProps = {|
    width?: Prop<WidthProperty<Length>>,
|};

export const config: Config = {
    width: {
        property: 'width',
        scale: 'dimensions',
    },
};

export const width = system(config);
export const widthPropTypes = createStylePropTypes(width.propNames);
