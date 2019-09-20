// @flow
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as marginConfig, type MarginProps} from './margin';
import {config as paddingConfig, type PaddingProps} from './padding';

export type SpacingSetProps = {|
    ...MarginProps,
    ...PaddingProps,
|};

export const spacingSet = system({
    ...marginConfig,
    ...paddingConfig,
});

export const spacingSetPropTypes = createStylePropTypes(spacingSet.propNames);
