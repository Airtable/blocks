/** @module @airtable/blocks/ui/system: Position */ /** */
import {system, type Config} from '@styled-system/core';
import {type PositionProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface PositionProps {
    /** Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties determine the final location of positioned elements. */
    position?: OptionalResponsiveProp<PositionProperty>;
}

export const config: Config = {position: true};

export const position = system(config);
