import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {AlignItemsProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export type AlignItemsProps = {
    alignItems?: Prop<AlignItemsProperty>;
};

export const config: Config = {alignItems: true};

export const alignItems = system(config);
export const alignItemsPropTypes = createStylePropTypes(alignItems.propNames);
