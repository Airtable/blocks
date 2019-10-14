/** @module @airtable/blocks/ui/system: Flex container */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {FlexWrapProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

/** */
export interface FlexWrapProps {
    /** Sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked. */
    flexWrap?: Prop<FlexWrapProperty>;
}

export const config: Config = {flexWrap: true};

export const flexWrap = system(config);
export const flexWrapPropTypes = createStylePropTypes(flexWrap.propNames);
