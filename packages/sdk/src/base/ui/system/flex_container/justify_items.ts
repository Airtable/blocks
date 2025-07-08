/** @hidden */ /** */

import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {JustifyItemsProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** @hidden */
export interface JustifyItemsProps {
    /** @hidden */
    justifyItems?: OptionalResponsiveProp<JustifyItemsProperty>;
}

export const config: Config = {justifyItems: true};

export const justifyItems = system(config);
export const justifyItemsPropTypes = createStylePropTypes(justifyItems.propNames);
