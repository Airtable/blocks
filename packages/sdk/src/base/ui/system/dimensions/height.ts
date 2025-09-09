/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, type Config} from '@styled-system/core';
import {type HeightProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
