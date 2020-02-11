/** @module @airtable/blocks/ui/system: Spacing */ /** */
import {system} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {config as marginConfig, MarginProps} from './margin';
import {config as paddingConfig, PaddingProps} from './padding';

/**
 * Style props for the spacing of an element.
 *
 * @docsPath UI/Style System/Spacing
 */
export interface SpacingSetProps extends MarginProps, PaddingProps {}

export const spacingSet = system({
    ...marginConfig,
    ...paddingConfig,
});

export const spacingSetPropTypes = createStylePropTypes(spacingSet.propNames);
