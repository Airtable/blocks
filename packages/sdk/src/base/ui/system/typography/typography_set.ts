/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system} from '@styled-system/core';
import {config as fontFamilyConfig, type FontFamilyProps} from './font_family';
import {config as fontSizeConfig, type FontSizeProps} from './font_size';
import {config as fontStyleConfig, type FontStyleProps} from './font_style';
import {config as fontWeightConfig, type FontWeightProps} from './font_weight';
import {config as letterSpacingConfig, type LetterSpacingProps} from './letter_spacing';
import {config as lineHeightConfig, type LineHeightProps} from './line_height';
import {config as textAlignConfig, type TextAlignProps} from './text_align';
import {config as textColorConfig, type TextColorProps} from './text_color';
import {config as textDecorationConfig, type TextDecorationProps} from './text_decoration';
import {config as textTransformConfig, type TextTransformProps} from './text_transform';

/**
 * Style props for the typography of an element.
 *
 * @docsPath UI/Style System/Typography
 */
export interface TypographySetProps
    extends FontFamilyProps,
        FontSizeProps,
        FontStyleProps,
        FontWeightProps,
        LetterSpacingProps,
        LineHeightProps,
        TextAlignProps,
        TextColorProps,
        TextDecorationProps,
        TextTransformProps {}

export const typographySet = system({
    ...fontFamilyConfig,
    ...fontSizeConfig,
    ...fontStyleConfig,
    ...fontWeightConfig,
    ...letterSpacingConfig,
    ...lineHeightConfig,
    ...textAlignConfig,
    ...textColorConfig,
    ...textDecorationConfig,
    ...textTransformConfig,
});
