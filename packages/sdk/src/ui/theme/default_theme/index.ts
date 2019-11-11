import * as tokens from './tokens';
import * as controlSizes from './control_sizes';
import textStyles from './text_styles';
import headingStyles from './heading_styles';
import buttonVariants from './button_variants';
import linkVariants from './link_variants';
import inputVariants from './input_variants';
import switchVariants from './switch_variants';
import selectVariants from './select_variants';
import selectButtonsVariants from './select_buttons_variants';
import textButtonVariants from './text_button_variants';

const theme = {
    ...tokens,
    ...controlSizes,
    textStyles,
    headingStyles,
    buttonVariants,
    linkVariants,
    inputVariants,
    selectVariants,
    selectButtonsVariants,
    switchVariants,
    textButtonVariants,
};

export default theme;
