/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {MinWidthProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface MinWidthProps {
    /** Sets the minimum width of an element. It prevents the used value of the `width` property from becoming smaller than the value specified for `minWidth`. */
    minWidth?: OptionalResponsiveProp<MinWidthProperty<Length>>;
}

export const config: Config = {
    minWidth: {
        property: 'minWidth',
        scale: 'dimensions',
    },
};

export const minWidth = system(config);
