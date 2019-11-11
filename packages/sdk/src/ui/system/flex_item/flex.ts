/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FlexProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface FlexProps {
    /** Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a shorthand for `flexGrow`, `flexShrink`, and `flexBasis`. */
    flex?: OptionalResponsiveProp<FlexProperty<Length>>;
}

export const config: Config = {flex: true};

export const flex = system(config);
export const flexPropTypes = createStylePropTypes(flex.propNames);
