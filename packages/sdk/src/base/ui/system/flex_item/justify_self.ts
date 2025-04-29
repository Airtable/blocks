/** @hidden */ /** */

import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {JustifySelfProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

/** @hidden */
export interface JustifySelfProps {
    /** @hidden */
    justifySelf?: OptionalResponsiveProp<JustifySelfProperty>;
}

export const config: Config = {justifySelf: true};

export const justifySelf = system(config);
export const justifySelfPropTypes = createStylePropTypes(justifySelf.propNames);
