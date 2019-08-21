// @flow
import {system} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {config as flexConfig, type FlexProps} from './flex';
import {config as flexGrowConfig, type FlexGrowProps} from './flex_grow';
import {config as flexShrinkConfig, type FlexShrinkProps} from './flex_shrink';
import {config as flexBasisConfig, type FlexBasisProps} from './flex_basis';
import {config as alignSelfConfig, type AlignSelfProps} from './align_self';
import {config as justifySelfConfig, type JustifySelfProps} from './justify_self';
import {config as orderConfig, type OrderProps} from './order';

export type FlexItemSetProps = {|
    ...FlexProps,
    ...FlexGrowProps,
    ...FlexShrinkProps,
    ...FlexBasisProps,
    ...JustifySelfProps,
    ...AlignSelfProps,
    ...OrderProps,
|};

export const flexItemSet = system({
    ...flexConfig,
    ...flexGrowConfig,
    ...flexShrinkConfig,
    ...flexBasisConfig,
    ...alignSelfConfig,
    ...justifySelfConfig,
    ...orderConfig,
});

export const flexItemSetPropTypes = createPropTypes(flexItemSet.propNames);
