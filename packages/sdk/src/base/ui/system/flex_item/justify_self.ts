/** @hidden */ /** */

import {system, type Config} from '@styled-system/core';
import {type JustifySelfProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** @hidden */
export interface JustifySelfProps {
    /** @hidden */
    justifySelf?: OptionalResponsiveProp<JustifySelfProperty>;
}

export const config: Config = {justifySelf: true};

export const justifySelf = system(config);
