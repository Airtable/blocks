/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, type Config} from '@styled-system/core';
import {type GlobalsNumber} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface FlexShrinkProps {
    /** Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex container, items shrink to fit according to `flexShrink`. */
    flexShrink?: OptionalResponsiveProp<GlobalsNumber>;
}

export const config: Config = {flexShrink: true};

export const flexShrink = system(config);
