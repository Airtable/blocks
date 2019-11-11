/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as heightConfig, HeightProps} from './height';
import {config as maxHeightConfig, MaxHeightProps} from './max_height';
import {config as maxWidthConfig, MaxWidthProps} from './max_width';
import {config as minHeightConfig, MinHeightProps} from './min_height';
import {config as minWidthConfig, MinWidthProps} from './min_width';
import {config as widthConfig, WidthProps} from './width';

/**
 * Style props for the dimensions of an element.
 */
export interface DimensionsSetProps
    extends HeightProps,
        MaxHeightProps,
        MaxWidthProps,
        MinHeightProps,
        MinWidthProps,
        WidthProps {}

export const dimensionsSet = system({
    ...heightConfig,
    ...maxWidthConfig,
    ...maxHeightConfig,
    ...minHeightConfig,
    ...minWidthConfig,
    ...widthConfig,
});

export const dimensionsSetPropTypes = createStylePropTypes(dimensionsSet.propNames);
