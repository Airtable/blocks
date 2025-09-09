/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, type Config} from '@styled-system/core';
import {type FlexDirectionProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface FlexDirectionProps {
    /** Sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed). */
    flexDirection?: OptionalResponsiveProp<FlexDirectionProperty>;
}

export const config: Config = {flexDirection: true};

export const flexDirection = system(config);
