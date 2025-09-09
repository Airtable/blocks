/** @hidden */ /** */

import {system, type Config} from '@styled-system/core';
import {type JustifyItemsProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** @hidden */
export interface JustifyItemsProps {
    /** @hidden */
    justifyItems?: OptionalResponsiveProp<JustifyItemsProperty>;
}

export const config: Config = {justifyItems: true};

export const justifyItems = system(config);
