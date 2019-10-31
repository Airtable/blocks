import * as tokens from './tokens';
import * as controlSizes from './control_sizes';
// Typography sizes and variants
import textStyles from './text_styles';
import headingStyles from './heading_styles';
// Component variants
import buttonVariants from './button_variants';
import linkVariants from './link_variants';
import inputVariants from './input_variants';
import textButtonVariants from './text_button_variants';
import selectVariants from './select_variants';

const theme = {
    ...tokens,
    ...controlSizes,
    textStyles,
    headingStyles,
    // We create CSS class names for variants when the UI kit gets loaded.
    // This means `textButtonVariants.default` is just a CSS class name.
    // This has the benefit over exporting a style object
    // of not having to create a class name manually in the render function.
    buttonVariants,
    linkVariants,
    inputVariants,
    textButtonVariants,
    selectVariants,
};

export default theme;
