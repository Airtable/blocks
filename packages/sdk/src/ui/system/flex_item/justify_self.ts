/** @internal */
// TODO (stephen): This property does nothing in a flex container, consider deprecating
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {JustifySelfProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export interface JustifySelfProps {
    justifySelf?: Prop<JustifySelfProperty>;
}

export const config: Config = {justifySelf: true};

export const justifySelf = system(config);
export const justifySelfPropTypes = createStylePropTypes(justifySelf.propNames);
