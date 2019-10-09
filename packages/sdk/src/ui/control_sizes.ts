import PropTypes from 'prop-types';
import {values, ObjectValues} from '../private_utils';
import useTheme from './theme/use_theme';
import {ResponsivePropObject} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
import useStyledSystem from './use_styled_system';

// Controls are things such as `Button`, `Input`, `Select` and `SelectButtons`.
// Currently only `Button` uses this.
export const ControlSizes = Object.freeze({
    SMALL: 'small',
    DEFAULT: 'default',
    LARGE: 'large',
} as const);
export type ControlSize = ObjectValues<typeof ControlSizes>;
export type ControlSizeProp = ResponsivePropObject<ControlSize> | ControlSize;
export const controlSizePropType = createResponsivePropType(PropTypes.oneOf(values(ControlSizes)));

/** @internal */
export function useButtonSize(controlSizeProp: ControlSizeProp): string {
    const {buttonSizes} = useTheme();
    let styleProps;
    if (typeof controlSizeProp === 'string') {
        styleProps = buttonSizes[controlSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<ControlSize>(controlSizeProp, buttonSizes);
    }
    return useStyledSystem(styleProps);
}
