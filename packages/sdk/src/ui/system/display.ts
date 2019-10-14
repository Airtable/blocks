/** @module @airtable/blocks/ui/system: Display */ /** */
import {system, Config} from '@styled-system/core';
import {DisplayProperty} from './utils/csstype';
import {Prop} from './utils/types';
import createStylePropTypes from './utils/create_style_prop_types';

/** */
export interface DisplayProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: Prop<DisplayProperty>;
}

const config: Config = {display: true};

export const display = system(config);
export const displayPropTypes = createStylePropTypes(display.propNames);
