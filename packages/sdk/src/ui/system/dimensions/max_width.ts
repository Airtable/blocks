import {system, Config} from '@styled-system/core';
import {MaxWidthProperty} from '../utils/csstype';
import {Prop, Length} from '../utils/types';
import createStylePropTypes from '../utils/create_style_prop_types';

export type MaxWidthProps = {
    maxWidth?: Prop<MaxWidthProperty<Length>>;
};

export const config: Config = {
    maxWidth: {
        property: 'maxWidth',
        scale: 'dimensions',
    },
};

export const maxWidth = system(config);
export const maxWidthPropTypes = createStylePropTypes(maxWidth.propNames);
