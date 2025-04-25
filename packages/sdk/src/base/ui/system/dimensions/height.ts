/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {HeightProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

/** */
export interface HeightProps {
    /** Specifies the height of an element. */
    height?: OptionalResponsiveProp<HeightProperty<Length>>;
}

export const config: Config = {
    height: {
        property: 'height',
        scale: 'dimensions',
    },
};

export const height = system(config);
export const heightPropTypes = createStylePropTypes(height.propNames);
