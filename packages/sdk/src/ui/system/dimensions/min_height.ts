/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {MinHeightProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

/** */
export interface MinHeightProps {
    /** Sets the minimum height of an element. It prevents the used value of the `height` property from becoming smaller than the value specified for `minHeight`. */
    minHeight?: OptionalResponsiveProp<MinHeightProperty<Length>>;
}

export const config: Config = {
    minHeight: {
        property: 'minHeight',
        scale: 'dimensions',
    },
};

export const minHeight = system(config);
export const minHeightPropTypes = createStylePropTypes(minHeight.propNames);
