/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system} from '@styled-system/core';
import {config as flexConfig, type FlexProps} from './flex';
import {config as flexGrowConfig, type FlexGrowProps} from './flex_grow';
import {config as flexShrinkConfig, type FlexShrinkProps} from './flex_shrink';
import {config as flexBasisConfig, type FlexBasisProps} from './flex_basis';
import {config as alignSelfConfig, type AlignSelfProps} from './align_self';
import {config as justifySelfConfig, type JustifySelfProps} from './justify_self';
import {config as orderConfig, type OrderProps} from './order';

/**
 * Style props for a flex item element.
 *
 * @docsPath UI/Style System/FlexItem
 */
export interface FlexItemSetProps
    extends FlexProps,
        FlexGrowProps,
        FlexShrinkProps,
        FlexBasisProps,
        AlignSelfProps,
        JustifySelfProps,
        OrderProps {}

export const flexItemSet = system({
    ...flexConfig,
    ...flexGrowConfig,
    ...flexShrinkConfig,
    ...flexBasisConfig,
    ...alignSelfConfig,
    ...justifySelfConfig,
    ...orderConfig,
});
