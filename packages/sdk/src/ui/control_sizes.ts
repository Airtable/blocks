/** @module @airtable/blocks/ui/system: Core */ /** */
import {createEnum, createResponsivePropTypeFromEnum, EnumType} from '../private_utils';
import useTheme from './theme/use_theme';
import {ResponsiveProp} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useStyledSystem from './use_styled_system';

// Controls are things such as `Button`, `Input`, `Select` and `SelectButtons`.
// Currently only `Button` uses this.
/** */
export type ControlSize = EnumType<typeof ControlSize>;
export const ControlSize = createEnum('small', 'default', 'large');

/** */
export type ControlSizeProp = ResponsiveProp<ControlSize>;
export const controlSizePropType = createResponsivePropTypeFromEnum(ControlSize);

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
