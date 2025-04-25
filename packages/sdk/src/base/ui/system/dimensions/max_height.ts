/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {MaxHeightProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

/** */
export interface MaxHeightProps {
    /** Sets the maximum height of an element. It prevents the used value of the `height` property from becoming larger than the value specified for `maxHeight`. */
    maxHeight?: OptionalResponsiveProp<MaxHeightProperty<Length>>;
}

export const config: Config = {
    maxHeight: {
        property: 'maxHeight',
        scale: 'dimensions',
    },
};

export const maxHeight = system(config);
export const maxHeightPropTypes = createStylePropTypes(maxHeight.propNames);
