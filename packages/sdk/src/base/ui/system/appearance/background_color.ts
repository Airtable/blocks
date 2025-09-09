/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, type Config} from '@styled-system/core';
import {type BackgroundColorProperty} from '../utils/csstype';
import {type OptionalResponsiveProp} from '../utils/types';

/** */
export interface BackgroundColorProps {
    /** Sets the background color of an element. */
    backgroundColor?: OptionalResponsiveProp<BackgroundColorProperty>;
}

export const config: Config = {
    backgroundColor: {
        property: 'backgroundColor',
        scale: 'colors',
    },
};

export const backgroundColor = system(config);
