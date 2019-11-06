/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as alignContentConfig, AlignContentProps} from './align_content';
import {config as alignItemsConfig, AlignItemsProps} from './align_items';
import {config as flexDirectionConfig, FlexDirectionProps} from './flex_direction';
import {config as flexWrapConfig, FlexWrapProps} from './flex_wrap';
import {config as justifyContentConfig, JustifyContentProps} from './justify_content';
import {config as justifyItemsConfig, JustifyItemsProps} from './justify_items';

/**
 * Style props for a flex container element.
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

export const flexContainerSetPropTypes = createStylePropTypes(flexContainerSet.propNames);
