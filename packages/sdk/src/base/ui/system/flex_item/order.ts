/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, type Config} from '@styled-system/core';
import {type GlobalsNumber} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface OrderProps {
    /** Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value and then by their source code order. */
    order?: OptionalResponsiveProp<GlobalsNumber>;
}

export const config: Config = {order: true};

export const order = system(config);
