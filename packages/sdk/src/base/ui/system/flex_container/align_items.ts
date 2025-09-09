/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, type Config} from '@styled-system/core';
import {type AlignItemsProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface AlignItemsProps {
    /** Sets the alignment of flex items on the cross-axis of a flex container. */
    alignItems?: OptionalResponsiveProp<AlignItemsProperty>;
}

export const config: Config = {alignItems: true};

export const alignItems = system(config);
