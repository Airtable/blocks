/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import {FlexBasisProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface FlexBasisProps {
    /** Sets the initial main size of a flex item. */
    flexBasis?: OptionalResponsiveProp<FlexBasisProperty<Length>>;
}

export const config: Config = {flexBasis: true};

export const flexBasis = system(config);
