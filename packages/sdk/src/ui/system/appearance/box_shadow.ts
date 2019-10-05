import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {BoxShadowProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

export type BoxShadowProps = {
    boxShadow?: Prop<BoxShadowProperty>;
};

export const config: Config = {
    boxShadow: {
        property: 'boxShadow',
        scale: 'shadows',
    },
};

export const boxShadow = system(config);
export const boxShadowPropTypes = createStylePropTypes(boxShadow.propNames);
