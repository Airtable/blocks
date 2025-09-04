/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import {BackgroundColorProperty} from '../utils/csstype';
import {OptionalResponsiveProp} from '../utils/types';

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
