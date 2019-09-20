// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type FontFamilyProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type FontFamilyProps = {|
    fontFamily?: Prop<FontFamilyProperty>,
|};

export const config: Config = {
    fontFamily: {
        property: 'fontFamily',
        scale: 'fonts',
    },
};

export const fontFamily = system(config);
export const fontFamilyPropTypes = createStylePropTypes(fontFamily.propNames);
