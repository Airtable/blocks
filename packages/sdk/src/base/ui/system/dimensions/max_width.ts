/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, type Config} from '@styled-system/core';
import {type MaxWidthProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
