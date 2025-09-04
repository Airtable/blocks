/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import {FlexWrapProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface FlexWrapProps {
    /** Sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked. */
    flexWrap?: OptionalResponsiveProp<FlexWrapProperty>;
}

export const config: Config = {flexWrap: true};

export const flexWrap = system(config);
