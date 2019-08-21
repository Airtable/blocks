// @flow
import {system, Config} from '@styled-system/core';
import {type BackgroundColorProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import {type Prop} from '../utils/types';

export type BackgroundColorProps = {|
    backgroundColor?: Prop<BackgroundColorProperty>,
|};

export const config: Config = {
    backgroundColor: {
        property: 'backgroundColor',
        scale: 'colors',
    },
};

export const backgroundColor = system(config);
export const backgroundColorPropTypes = createPropTypes(backgroundColor.propNames);
