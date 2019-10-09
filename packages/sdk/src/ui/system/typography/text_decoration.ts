import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {TextDecorationProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export interface TextDecorationProps {
    textDecoration?: Prop<TextDecorationProperty>;
}

export const config: Config = {
    textDecoration: true,
};

export const textDecoration = system(config);
export const textDecorationPropTypes = createStylePropTypes(textDecoration.propNames);
