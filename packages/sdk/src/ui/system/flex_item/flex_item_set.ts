import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as flexConfig, FlexProps} from './flex';
import {config as flexGrowConfig, FlexGrowProps} from './flex_grow';
import {config as flexShrinkConfig, FlexShrinkProps} from './flex_shrink';
import {config as flexBasisConfig, FlexBasisProps} from './flex_basis';
import {config as alignSelfConfig, AlignSelfProps} from './align_self';
import {config as justifySelfConfig, JustifySelfProps} from './justify_self';
import {config as orderConfig, OrderProps} from './order';

export type FlexItemSetProps = (FlexProps) &
    (FlexGrowProps) &
    (FlexShrinkProps) &
    (FlexBasisProps) &
    (JustifySelfProps) &
    (AlignSelfProps) &
    (OrderProps);

export const flexItemSet = system({
    ...flexConfig,
    ...flexGrowConfig,
    ...flexShrinkConfig,
    ...flexBasisConfig,
    ...alignSelfConfig,
    ...justifySelfConfig,
    ...orderConfig,
});

export const flexItemSetPropTypes = createStylePropTypes(flexItemSet.propNames);
