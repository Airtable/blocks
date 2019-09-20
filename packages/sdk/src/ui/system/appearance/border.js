// @flow
import {system, Config} from '@styled-system/core';
import {
    type BorderProperty,
    type BorderWidthProperty,
    type BorderStyleProperty,
    type BorderColorProperty,
    type BorderTopProperty,
    type BorderRightProperty,
    type BorderBottomProperty,
    type BorderLeftProperty,
} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import {type Prop, type Length} from '../utils/types';

export type BorderProps = {|
    border?: Prop<BorderProperty<Length>>,
    borderWidth?: Prop<BorderWidthProperty<Length>>,
    borderStyle?: Prop<BorderStyleProperty>,
    borderColor?: Prop<BorderColorProperty>,
    borderTop?: Prop<BorderTopProperty<Length>>,
    borderRight?: Prop<BorderRightProperty<Length>>,
    borderBottom?: Prop<BorderBottomProperty<Length>>,
    borderLeft?: Prop<BorderLeftProperty<Length>>,
    borderX?: Prop<BorderProperty<Length>>,
    borderY?: Prop<BorderProperty<Length>>,
|};

export const config: Config = {
    border: {
        property: 'border',
        scale: 'borders',
    },
    borderWidth: {
        property: 'borderWidth',
        scale: 'borderWidths',
    },
    borderStyle: {
        property: 'borderStyle',
        scale: 'borderStyles',
    },
    borderColor: {
        property: 'borderColor',
        scale: 'colors',
    },
    borderTop: {
        property: 'borderTop',
        scale: 'borders',
    },
    borderRight: {
        property: 'borderRight',
        scale: 'borders',
    },
    borderBottom: {
        property: 'borderBottom',
        scale: 'borders',
    },
    borderLeft: {
        property: 'borderLeft',
        scale: 'borders',
    },
    borderX: {
        properties: ['borderLeft', 'borderRight'],
        scale: 'borders',
    },
    borderY: {
        properties: ['borderTop', 'borderBottom'],
        scale: 'borders',
    },
};

export const border = system(config);
export const borderPropTypes = createStylePropTypes(border.propNames);
