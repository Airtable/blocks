// @flow
import {system, Config} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {type LetterSpacingProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';

export type LetterSpacingProps = {|
    letterSpacing?: Prop<LetterSpacingProperty<Length>>,
|};

export const config: Config = {
    letterSpacing: {
        property: 'letterSpacing',
        scale: 'letterSpacing',
    },
};

export const letterSpacing = system(config);
export const letterSpacingPropTypes = createPropTypes(letterSpacing.propNames);
