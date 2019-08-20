// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type TextTransformProperty} from '../utils/csstype';
import {type Prop} from '../utils/types';

export type TextTransformProps = {|
    textTransform?: Prop<TextTransformProperty>,
|};

export const config: Config = {
    textTransform: true,
};

export const textTransform = system(config);
export const textTransformPropTypes = createPropTypes(textTransform.propNames);
