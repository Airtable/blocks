/** @module @airtable/blocks/ui/system: Position */ /** */
import {system} from '@styled-system/core';
import {config as positionConfig, type PositionProps} from './position';
import {config as topConfig, type TopProps} from './top';
import {config as rightConfig, type RightProps} from './right';
import {config as bottomConfig, type BottomProps} from './bottom';
import {config as leftConfig, type LeftProps} from './left';
import {config as zIndexConfig, type ZIndexProps} from './z_index';

/**
 * Style props for the position of an element.
 *
 * @docsPath UI/Style System/Position
 */
export interface PositionSetProps
    extends PositionProps,
        TopProps,
        RightProps,
        BottomProps,
        LeftProps,
        ZIndexProps {}

export const positionSet = system({
    ...positionConfig,
    ...topConfig,
    ...rightConfig,
    ...bottomConfig,
    ...leftConfig,
    ...zIndexConfig,
});
