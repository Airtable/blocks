/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, type Config} from '@styled-system/core';
import {type FlexBasisProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

/** */
export interface FlexBasisProps {
    /** Sets the initial main size of a flex item. */
    flexBasis?: OptionalResponsiveProp<FlexBasisProperty<Length>>;
}

export const config: Config = {flexBasis: true};

export const flexBasis = system(config);
