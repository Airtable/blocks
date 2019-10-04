// @flow
import * as tokens from './tokens';
import textSizesByVariant from './text_sizes_by_variant';
import headingSizesByVariant from './heading_sizes_by_variant';

const theme = {
    ...tokens,
    textSizesByVariant,
    headingSizesByVariant,
};

export default theme;
