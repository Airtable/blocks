import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as heightConfig, HeightProps} from './height';
import {config as maxWidthConfig, MaxWidthProps} from './max_width';
import {config as maxHeightConfig, MaxHeightProps} from './max_height';
import {config as minHeightConfig, MinHeightProps} from './min_height';
import {config as minWidthConfig, MinWidthProps} from './min_width';
import {config as widthConfig, WidthProps} from './width';

export type DimensionsSetProps = (HeightProps) &
    (MaxWidthProps) &
    (MaxHeightProps) &
    (MinHeightProps) &
    (MinWidthProps) &
    (WidthProps);

export const dimensionsSet = system({
    ...heightConfig,
    ...maxWidthConfig,
    ...maxHeightConfig,
    ...minHeightConfig,
    ...minWidthConfig,
    ...widthConfig,
});

export const dimensionsSetPropTypes = createStylePropTypes(dimensionsSet.propNames);
