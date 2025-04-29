/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {AlignContentProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** */
export interface AlignContentProps {
    /** Sets the alignment of a flex container's lines when there is extra space in the cross-axis. This property has no effect on a single-line flex container. */
    alignContent?: OptionalResponsiveProp<AlignContentProperty>;
}

export const config: Config = {alignContent: true};

export const alignContent = system(config);
export const alignContentPropTypes = createStylePropTypes(alignContent.propNames);
