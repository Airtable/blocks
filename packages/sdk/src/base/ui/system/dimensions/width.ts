/** @module @airtable/blocks/ui/system: Dimensions */ /** */
import {system, type Config} from '@styled-system/core';
import {type WidthProperty} from '../utils/csstype';
import {type OptionalResponsiveProp, type Length} from '../utils/types';

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
