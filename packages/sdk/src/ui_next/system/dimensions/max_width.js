// @flow
import {system, Config} from '@styled-system/core';
import {type MaxWidthProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createPropTypes from '../utils/create_prop_types';

export type MaxWidthProps = {|
    maxWidth?: Prop<MaxWidthProperty<Length>>,
|};

export const config: Config = {
    maxWidth: {
        property: 'maxWidth',
        scale: 'dimensions',
    },
};

export const maxWidth = system(config);
export const maxWidthPropTypes = createPropTypes(maxWidth.propNames);
