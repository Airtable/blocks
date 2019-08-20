// @flow
import {system} from '@styled-system/core';
import createPropTypes from '../utils/create_prop_types';
import {config as positionConfig, type PositionProps} from './position';
import {config as zIndexConfig, type ZIndexProps} from './z_index';
import {config as topConfig, type TopProps} from './top';
import {config as rightConfig, type RightProps} from './right';
import {config as bottomConfig, type BottomProps} from './bottom';
import {config as leftConfig, type LeftProps} from './left';

export type PositionSetProps = {|
    ...PositionProps,
    ...ZIndexProps,
    ...TopProps,
    ...RightProps,
    ...BottomProps,
    ...LeftProps,
|};

export const positionSet = system({
    ...positionConfig,
    ...zIndexConfig,
    ...topConfig,
    ...rightConfig,
    ...bottomConfig,
    ...leftConfig,
});

export const positionSetPropTypes = createPropTypes(positionSet.propNames);
