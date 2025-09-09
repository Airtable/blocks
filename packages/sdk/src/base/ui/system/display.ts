/** @module @airtable/blocks/ui/system: Display */ /** */
import {system, type Config} from '@styled-system/core';
import {type DisplayProperty} from './utils/csstype';
import {type OptionalResponsiveProp} from './utils/types';

/**
 * Style prop for the display type of an element.
 *
 * @docsPath UI/Style System/Display
 */
export interface DisplayProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<DisplayProperty>;
}

const config: Config = {display: true};

export const display = system(config);
