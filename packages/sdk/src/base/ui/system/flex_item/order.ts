/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import {GlobalsNumber} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface OrderProps {
    /** Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value and then by their source code order. */
    order?: OptionalResponsiveProp<GlobalsNumber>;
}

export const config: Config = {order: true};

export const order = system(config);
