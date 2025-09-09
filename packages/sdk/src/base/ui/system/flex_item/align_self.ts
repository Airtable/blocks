/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, type Config} from '@styled-system/core';
import {type AlignSelfProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface AlignSelfProps {
    /** Aligns flex items of the current flex line, overriding the `alignItems` value. */
    alignSelf?: OptionalResponsiveProp<AlignSelfProperty>;
}

export const config: Config = {alignSelf: true};

export const alignSelf = system(config);
