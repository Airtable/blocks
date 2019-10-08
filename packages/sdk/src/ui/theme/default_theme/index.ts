import * as tokens from './tokens';
import textSizesByVariant from './text_sizes_by_variant';
import headingSizesByVariant from './heading_sizes_by_variant';
import textButtonVariants from './text_button_variants';

const theme = {
    ...tokens,
    textSizesByVariant,
    headingSizesByVariant,
    // We create CSS class names for variants when the UI kit gets loaded.
    // This means `textButtonVariants.default` is just a CSS class name.
    // This has the benefit over exporting a style object
    // of not having to create a class name manually in the render function.
    textButtonVariants,
};

export default theme;
