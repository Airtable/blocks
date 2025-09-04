/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, Config} from '@styled-system/core';
import {MaxWidthProperty} from '../utils/csstype';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface MaxWidthProps {
    /** Sets the maximum width of an element. It prevents the used value of the `width` property from becoming larger than the value specified by `maxWidth`. */
    maxWidth?: OptionalResponsiveProp<MaxWidthProperty<Length>>;
}

export const config: Config = {
    maxWidth: {
        property: 'maxWidth',
        scale: 'dimensions',
    },
};

export const maxWidth = system(config);
