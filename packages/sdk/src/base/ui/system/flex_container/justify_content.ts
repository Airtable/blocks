/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, type Config} from '@styled-system/core';
import {type JustifyContentProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface JustifyContentProps {
    /** Sets the alignment of flex items on the main axis of a flex container. */
    justifyContent?: OptionalResponsiveProp<JustifyContentProperty>;
}

export const config: Config = {justifyContent: true};

export const justifyContent = system(config);
