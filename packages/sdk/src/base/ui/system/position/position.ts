/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, Config} from '@styled-system/core';
import {PositionProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface PositionProps {
    /** Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties determine the final location of positioned elements. */
    position?: OptionalResponsiveProp<PositionProperty>;
}

export const config: Config = {position: true};

export const position = system(config);
