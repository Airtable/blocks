/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system} from '@styled-system/core';
import {config as heightConfig, type HeightProps} from './height';
import {config as maxHeightConfig, type MaxHeightProps} from './max_height';
import {config as maxWidthConfig, type MaxWidthProps} from './max_width';
import {config as minHeightConfig, type MinHeightProps} from './min_height';
import {config as minWidthConfig, type MinWidthProps} from './min_width';
import {config as widthConfig, type WidthProps} from './width';

/**
 * Style props for the dimensions of an element.
 *
 * @docsPath UI/Style System/Dimensions
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
