/** @module @airtable/blocks/ui/system: Overflow */ /** */
import {system, Config} from '@styled-system/core';
import {OverflowProperty, OverflowXProperty, OverflowYProperty} from './utils/csstype';
import {OptionalResponsiveProp} from './utils/types';

/**
 * Style props for the overflow behavior of an element.
 *
 * @docsPath UI/Style System/Overflow
 */
export interface OverflowProps {
    /** Sets what to do when an element's content is too big to fit in its block formatting context. It is a shorthand for `overflowX` and `overflowY`. */
    overflow?: OptionalResponsiveProp<OverflowProperty>;
    /** Sets what shows when content overflows a block-level element's top and bottom edges. This may be nothing, a scroll bar, or the overflow content. */
    overflowY?: OptionalResponsiveProp<OverflowXProperty>;
    /** Sets what shows when content overflows a block-level element's left and right edges. This may be nothing, a scroll bar, or the overflow content. */
    overflowX?: OptionalResponsiveProp<OverflowYProperty>;
}

const config: Config = {overflow: true, overflowY: true, overflowX: true};

export const overflow = system(config);
