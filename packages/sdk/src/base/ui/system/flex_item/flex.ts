/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, type Config} from '@styled-system/core';
import {type FlexProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

/** */
export interface FlexProps {
    /** Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a shorthand for `flexGrow`, `flexShrink`, and `flexBasis`. */
    flex?: OptionalResponsiveProp<FlexProperty<Length>>;
}

export const config: Config = {flex: true};

export const flex = system(config);
