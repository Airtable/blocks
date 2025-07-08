/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {WidthProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

/** */
export interface WidthProps {
    /** Specifies the width of an element. */
    width?: OptionalResponsiveProp<WidthProperty<Length>>;
}

export const config: Config = {
    width: {
        property: 'width',
        scale: 'dimensions',
    },
};

export const width = system(config);
export const widthPropTypes = createStylePropTypes(width.propNames);
