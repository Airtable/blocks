/** @module @airtable/blocks/ui/system: Appearance */ /** */
import {system, Config} from '@styled-system/core';
import {
    BorderProperty,
    BorderWidthProperty,
    BorderStyleProperty,
    BorderColorProperty,
    BorderTopProperty,
    BorderRightProperty,
    BorderBottomProperty,
    BorderLeftProperty,
} from '../utils/csstype';
import createStylePropTypes from '../utils/create_style_prop_types';
import {OptionalResponsiveProp, Length} from '../utils/types';

/** */
export interface BorderProps {
    /** Sets an element's border. It's a shorthand for `borderWidth`, `borderStyle`, and `borderColor`. */
    border?: OptionalResponsiveProp<BorderProperty<Length>>;
    /** Sets the widths of all four sides of an element's border. */
    borderWidth?: OptionalResponsiveProp<BorderWidthProperty<Length>>;
    /** Sets the line style for all four sides of an element's border. */
    borderStyle?: OptionalResponsiveProp<BorderStyleProperty>;
    /** Sets the color of all sides of an element's border. */
    borderColor?: OptionalResponsiveProp<BorderColorProperty>;
    /** Sets the width, line style, and color for an element's top border. */
    borderTop?: OptionalResponsiveProp<BorderTopProperty<Length>>;
    /** Sets the width, line style, and color for an element's right border. */
    borderRight?: OptionalResponsiveProp<BorderRightProperty<Length>>;
    /** Sets the width, line style, and color for an element's bottom border. */
    borderBottom?: OptionalResponsiveProp<BorderBottomProperty<Length>>;
    /** Sets the width, line style, and color for an element's left border. */
    borderLeft?: OptionalResponsiveProp<BorderLeftProperty<Length>>;
    /** Sets the width, line style, and color for an element's left and right borders. */
    borderX?: OptionalResponsiveProp<BorderProperty<Length>>;
    /** Sets the width, line style, and color for an element's top and bottom borders. */
    borderY?: OptionalResponsiveProp<BorderProperty<Length>>;
}

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
