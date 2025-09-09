/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system} from '@styled-system/core';
import {config as alignContentConfig, type AlignContentProps} from './align_content';
import {config as alignItemsConfig, type AlignItemsProps} from './align_items';
import {config as flexDirectionConfig, type FlexDirectionProps} from './flex_direction';
import {config as flexWrapConfig, type FlexWrapProps} from './flex_wrap';
import {config as justifyContentConfig, type JustifyContentProps} from './justify_content';
import {config as justifyItemsConfig, type JustifyItemsProps} from './justify_items';

/**
 * Style props for a flex container element.
 *
 * @docsPath UI/Style System/FlexContainer
 */
export interface FlexContainerSetProps
    extends AlignContentProps,
        AlignItemsProps,
        FlexDirectionProps,
        FlexWrapProps,
        JustifyContentProps,
        JustifyItemsProps {}

export const flexContainerSet = system({
    ...alignContentConfig,
    ...alignItemsConfig,
    ...flexDirectionConfig,
    ...flexWrapConfig,
    ...justifyContentConfig,
    ...justifyItemsConfig,
});
