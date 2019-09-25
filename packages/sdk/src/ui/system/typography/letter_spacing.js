// @flow
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type LetterSpacingProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type LetterSpacingProps = {|
    letterSpacing?: Prop<LetterSpacingProperty<Length> | string>,
|};

export const config: Config = {
    letterSpacing: {
        property: 'letterSpacing',
        scale: 'letterSpacing',
    },
};

export const letterSpacing = system(config);
export const letterSpacingPropTypes = createStylePropTypes(letterSpacing.propNames);
