import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as positionConfig, PositionProps} from './position';
import {config as zIndexConfig, ZIndexProps} from './z_index';
import {config as topConfig, TopProps} from './top';
import {config as rightConfig, RightProps} from './right';
import {config as bottomConfig, BottomProps} from './bottom';
import {config as leftConfig, LeftProps} from './left';

export type PositionSetProps = (PositionProps) &
    (ZIndexProps) &
    (TopProps) &
    (RightProps) &
    (BottomProps) &
    (LeftProps);

export const positionSet = system({
    ...positionConfig,
    ...zIndexConfig,
    ...topConfig,
    ...rightConfig,
    ...bottomConfig,
    ...leftConfig,
});

export const positionSetPropTypes = createStylePropTypes(positionSet.propNames);
