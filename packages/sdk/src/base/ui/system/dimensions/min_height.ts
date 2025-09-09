/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, type Config} from '@styled-system/core';
import {type MinHeightProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
