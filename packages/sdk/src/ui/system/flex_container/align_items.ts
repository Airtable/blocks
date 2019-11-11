/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {AlignItemsProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface AlignItemsProps {
    /** Sets the alignment of flex items on the cross-axis of a flex container. */
    alignItems?: OptionalResponsiveProp<AlignItemsProperty>;
}

export const config: Config = {alignItems: true};

export const alignItems = system(config);
export const alignItemsPropTypes = createStylePropTypes(alignItems.propNames);
