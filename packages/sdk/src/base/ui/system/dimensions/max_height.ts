/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, type Config} from '@styled-system/core';
import {type MaxHeightProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
