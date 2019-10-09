import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as fontSizeConfig, FontSizeProps} from './font_size';
import {config as fontStyleConfig, FontStyleProps} from './font_style';
import {config as fontFamilyConfig, FontFamilyProps} from './font_family';
import {config as fontWeightConfig, FontWeightProps} from './font_weight';
import {config as letterSpacingConfig, LetterSpacingProps} from './letter_spacing';
import {config as lineHeightConfig, LineHeightProps} from './line_height';
import {config as textAlignConfig, TextAlignProps} from './text_align';
import {config as textDecorationConfig, TextDecorationProps} from './text_decoration';
import {config as textTransformConfig, TextTransformProps} from './text_transform';
import {config as textColorConfig, TextColorProps} from './text_color';

export type TypographySetProps = (FontSizeProps) &
    (FontStyleProps) &
    (FontFamilyProps) &
    (FontWeightProps) &
    (LetterSpacingProps) &
    (LineHeightProps) &
    (TextAlignProps) &
    TextDecorationProps &
    (TextTransformProps) &
    (TextColorProps);

export const typographySet = system({
    ...fontSizeConfig,
    ...fontStyleConfig,
    ...fontFamilyConfig,
    ...fontWeightConfig,
    ...letterSpacingConfig,
    ...lineHeightConfig,
    ...textAlignConfig,
    ...textDecorationConfig,
    ...textTransformConfig,
    ...textColorConfig,
});

export const typographySetPropTypes = createStylePropTypes(typographySet.propNames);
