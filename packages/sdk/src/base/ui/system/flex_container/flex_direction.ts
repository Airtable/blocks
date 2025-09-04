/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import {FlexDirectionProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface FlexDirectionProps {
    /** Sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed). */
    flexDirection?: OptionalResponsiveProp<FlexDirectionProperty>;
}

export const config: Config = {flexDirection: true};

export const flexDirection = system(config);
