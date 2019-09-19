// @flow
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as fontSizeConfig, type FontSizeProps} from './font_size';
import {config as fontStyleConfig, type FontStyleProps} from './font_style';
import {config as fontFamilyConfig, type FontFamilyProps} from './font_family';
import {config as fontWeightConfig, type FontWeightProps} from './font_weight';
import {config as letterSpacingConfig, type LetterSpacingProps} from './letter_spacing';
import {config as lineHeightConfig, type LineHeightProps} from './line_height';
import {config as textAlignConfig, type TextAlignProps} from './text_align';
import {config as textTransformConfig, type TextTransformProps} from './text_transform';
import {config as textColorConfig, type TextColorProps} from './text_color';

export type TypographySetProps = {|
    ...FontSizeProps,
    ...FontStyleProps,
    ...FontFamilyProps,
    ...FontWeightProps,
    ...LetterSpacingProps,
    ...LineHeightProps,
    ...TextAlignProps,
    ...TextTransformProps,
    ...TextColorProps,
|};

export const typographySet = system({
    ...fontSizeConfig,
    ...fontStyleConfig,
    ...fontFamilyConfig,
    ...fontWeightConfig,
    ...letterSpacingConfig,
    ...lineHeightConfig,
    ...textAlignConfig,
    ...textTransformConfig,
    ...textColorConfig,
});

export const typographySetPropTypes = createStylePropTypes(typographySet.propNames);
