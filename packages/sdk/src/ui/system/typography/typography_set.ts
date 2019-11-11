/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as fontFamilyConfig, FontFamilyProps} from './font_family';
import {config as fontSizeConfig, FontSizeProps} from './font_size';
import {config as fontStyleConfig, FontStyleProps} from './font_style';
import {config as fontWeightConfig, FontWeightProps} from './font_weight';
import {config as letterSpacingConfig, LetterSpacingProps} from './letter_spacing';
import {config as lineHeightConfig, LineHeightProps} from './line_height';
import {config as textAlignConfig, TextAlignProps} from './text_align';
import {config as textColorConfig, TextColorProps} from './text_color';
import {config as textDecorationConfig, TextDecorationProps} from './text_decoration';
import {config as textTransformConfig, TextTransformProps} from './text_transform';

/**
 * Style props for the typography of an element.
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

export const typographySetPropTypes = createStylePropTypes(typographySet.propNames);
