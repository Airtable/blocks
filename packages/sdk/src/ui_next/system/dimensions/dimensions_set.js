// @flow
import {system} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {config as heightConfig, type HeightProps} from './height';
import {config as maxWidthConfig, type MaxWidthProps} from './max_width';
import {config as maxHeightConfig, type MaxHeightProps} from './max_height';
import {config as minHeightConfig, type MinHeightProps} from './min_height';
import {config as minWidthConfig, type MinWidthProps} from './min_width';
import {config as widthConfig, type WidthProps} from './width';

export type DimensionsSetProps = {|
    ...HeightProps,
    ...MaxWidthProps,
    ...MaxHeightProps,
    ...MinHeightProps,
    ...MinWidthProps,
    ...WidthProps,
|};

export const dimensionsSet = system({
    ...heightConfig,
    ...maxWidthConfig,
    ...maxHeightConfig,
    ...minHeightConfig,
    ...minWidthConfig,
    ...widthConfig,
});

export const dimensionsSetPropTypes = createPropTypes(dimensionsSet.propNames);
