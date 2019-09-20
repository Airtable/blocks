// @flow
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as alignContentConfig, type AlignContentProps} from './align_content';
import {config as alignItemsConfig, type AlignItemsProps} from './align_items';
import {config as flexDirectionConfig, type FlexDirectionProps} from './flex_direction';
import {config as flexWrapConfig, type FlexWrapProps} from './flex_wrap';
import {config as justifyContentConfig, type JustifyContentProps} from './justify_content';
import {config as justifyItemsConfig, type JustifyItemsProps} from './justify_items';

export type FlexContainerSetProps = {|
    ...AlignItemsProps,
    ...AlignContentProps,
    ...JustifyItemsProps,
    ...JustifyContentProps,
    ...FlexWrapProps,
    ...FlexDirectionProps,
|};

export const flexContainerSet = system({
    ...alignContentConfig,
    ...alignItemsConfig,
    ...flexDirectionConfig,
    ...flexWrapConfig,
    ...justifyContentConfig,
    ...justifyItemsConfig,
});

export const flexContainerSetPropTypes = createStylePropTypes(flexContainerSet.propNames);
