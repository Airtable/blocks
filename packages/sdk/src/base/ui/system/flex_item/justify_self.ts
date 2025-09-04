/** @hidden */ /** */

import {system, Config} from '@styled-system/core';
import {JustifySelfProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** @hidden */
export interface JustifySelfProps {
    /** @hidden */
    justifySelf?: OptionalResponsiveProp<JustifySelfProperty>;
}

export const config: Config = {justifySelf: true};

export const justifySelf = system(config);
