// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FontSizeProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type FontSizeProps = {|
    fontSize?: Prop<FontSizeProperty<Length>>,
|};

export const config: Config = {
    fontSize: {
        property: 'fontSize',
        scale: 'fontSizes',
    },
};

export const fontSize = system(config);
export const fontSizePropTypes = createStylePropTypes(fontSize.propNames);
