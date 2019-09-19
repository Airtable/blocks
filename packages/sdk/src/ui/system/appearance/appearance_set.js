// @flow
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as backgroundColorConfig, type BackgroundColorProps} from './background_color';
import {config as borderRadiusConfig, type BorderRadiusProps} from './border_radius';
import {config as borderConfig, type BorderProps} from './border';
import {config as boxShadowConfig, type BoxShadowProps} from './box_shadow';
import {config as opacityConfig, type OpacityProps} from './opacity';

export type AppearanceSetProps = {|
    ...BackgroundColorProps,
    ...BorderRadiusProps,
    ...BorderProps,
    ...BoxShadowProps,
    ...OpacityProps,
|};

export const appearanceSet = system({
    ...backgroundColorConfig,
    ...borderRadiusConfig,
    ...borderConfig,
    ...boxShadowConfig,
    ...opacityConfig,
});

export const appearanceSetPropTypes = createStylePropTypes(appearanceSet.propNames);
