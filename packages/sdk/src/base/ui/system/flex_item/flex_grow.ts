/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import {GlobalsNumber} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface FlexGrowProps {
    /** Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex container, items grow to fit according to `flexGrow`. */
    flexGrow?: OptionalResponsiveProp<GlobalsNumber>;
}

export const config: Config = {flexGrow: true};

export const flexGrow = system(config);
