import * as tokens from './tokens';
import {controlSizes, buttonSizes} from './control_sizes';
import textSizesByVariant from './text_sizes_by_variant';
import headingSizesByVariant from './heading_sizes_by_variant';
import textButtonVariants from './text_button_variants';
import buttonVariants from './button_variants';

const theme = {
    ...tokens,
    controlSizes,
    buttonSizes,
    textSizesByVariant,
    headingSizesByVariant,
    // We create CSS class names for variants when the UI kit gets loaded.
    // This means `textButtonVariants.default` is just a CSS class name.
    // This has the benefit over exporting a style object
    // of not having to create a class name manually in the render function.
    textButtonVariants,
    buttonVariants,
};

export default theme;
