import {system, Config} from '@styled-system/core';
import {MaxHeightProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type MaxHeightProps = {
    maxHeight?: Prop<MaxHeightProperty<Length>>;
};

export const config: Config = {
    maxHeight: {
        property: 'maxHeight',
        scale: 'dimensions',
    },
};

export const maxHeight = system(config);
export const maxHeightPropTypes = createStylePropTypes(maxHeight.propNames);
