/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system} from '@styled-system/core';
import {config as backgroundColorConfig, type BackgroundColorProps} from './background_color';
import {config as borderConfig, type BorderProps} from './border';
import {config as borderRadiusConfig, type BorderRadiusProps} from './border_radius';
import {config as boxShadowConfig, type BoxShadowProps} from './box_shadow';
import {config as opacityConfig, type OpacityProps} from './opacity';

/**
 * Style props for the visual appearance of an element.
 *
 * @docsPath UI/Style System/Appearance
 */
export interface AppearanceSetProps
    extends BackgroundColorProps,
        BorderProps,
        BorderRadiusProps,
        BoxShadowProps,
        OpacityProps {}

export const appearanceSet = system({
    ...backgroundColorConfig,
    ...borderRadiusConfig,
    ...borderConfig,
    ...boxShadowConfig,
    ...opacityConfig,
});
