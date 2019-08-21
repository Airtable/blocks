// @flow
import {system, Config} from '@styled-system/core';
import {type MinWidthProperty} from '../utils/csstype';
import {type Prop, type Length} from '../utils/types';
import createPropTypes from '../utils/create_prop_types';

export type MinWidthProps = {|
    minWidth?: Prop<MinWidthProperty<Length>>,
|};

export const config: Config = {
    minWidth: {
        property: 'minWidth',
        scale: 'dimensions',
    },
};

export const minWidth = system(config);
export const minWidthPropTypes = createPropTypes(minWidth.propNames);
