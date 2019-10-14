/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {JustifyContentProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

/** */
export interface JustifyContentProps {
    /** Sets the alignment of flex items on the main axis of a flex container. */
    justifyContent?: Prop<JustifyContentProperty>;
}

export const config: Config = {justifyContent: true};

export const justifyContent = system(config);
export const justifyContentPropTypes = createStylePropTypes(justifyContent.propNames);
