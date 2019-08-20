// @flow
import {system, Config} from '@styled-system/core';
import {type ZIndexProperty} from '../utils/csstype';
import createPropTypes from '../utils/create_prop_types';
import {type Prop} from '../utils/types';

export type ZIndexProps = {|
    zIndex?: Prop<ZIndexProperty>,
|};

export const config: Config = {
    zIndex: {
        property: 'zIndex',
        scale: 'zIndices',
    },
};

export const zIndex = system(config);
export const zIndexPropTypes = createPropTypes(zIndex.propNames);
