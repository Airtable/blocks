/** @module @airtable/blocks/ui/system: Typography */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {LineHeightProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface LineHeightProps {
    /** Sets the amount of space used for lines, such as in text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height. */
    lineHeight?: OptionalResponsiveProp<LineHeightProperty<Length>>;
}

export const config: Config = {
    lineHeight: true,
};

export const lineHeight = system(config);
export const lineHeightPropTypes = createStylePropTypes(lineHeight.propNames);
