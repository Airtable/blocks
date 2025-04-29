/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FlexBasisProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface FlexBasisProps {
    /** Sets the initial main size of a flex item. */
    flexBasis?: OptionalResponsiveProp<FlexBasisProperty<Length>>;
}

export const config: Config = {flexBasis: true};

export const flexBasis = system(config);
export const flexBasisPropTypes = createStylePropTypes(flexBasis.propNames);
