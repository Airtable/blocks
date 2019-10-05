import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {TextTransformProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export type TextTransformProps = {
    textTransform?: Prop<TextTransformProperty>;
};

export const config: Config = {
    textTransform: true,
};

export const textTransform = system(config);
export const textTransformPropTypes = createStylePropTypes(textTransform.propNames);
