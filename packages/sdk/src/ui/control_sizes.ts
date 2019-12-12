/** @module @airtable/blocks/ui/system: Control sizes */ /** */
import {compose, system} from '@styled-system/core';
import {createEnum, createResponsivePropTypeFromEnum, EnumType} from '../private_utils';
import useTheme from './theme/use_theme';
import {ResponsiveProp} from './system/utils/types';
import getStylePropsForResponsiveProp from './system/utils/get_style_props_for_responsive_prop';
import useStyledSystem from './use_styled_system';
import {allStylesParser} from './system/';

/**
 * Sizes for the {@link Button}, {@link Input}, {@link Select}, {@link SelectButtons}, and {@link Switch} components.
 */
export type ControlSize = EnumType<typeof ControlSize>;
export const ControlSize = createEnum('small', 'default', 'large');

/**
 * Size prop for the {@link Button}, {@link Input}, {@link Select}, {@link SelectButtons}, and {@link Switch} components.
 */
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

const selectSizeStyleParser = compose(allStylesParser, system({backgroundPosition: true}));

/** @internal */
export function useSelectSize(controlSizeProp: ControlSizeProp): string {
    const {selectSizes} = useTheme();
    let styleProps;
    if (typeof controlSizeProp === 'string') {
        styleProps = selectSizes[controlSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<ControlSize>(controlSizeProp, selectSizes);
    }
    return useStyledSystem(styleProps, selectSizeStyleParser);
}

/** @internal */
export function useInputSize(controlSizeProp: ControlSizeProp): string {
    const {inputSizes} = useTheme();
    let styleProps;
    if (typeof controlSizeProp === 'string') {
        styleProps = inputSizes[controlSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<ControlSize>(controlSizeProp, inputSizes);
    }
    return useStyledSystem(styleProps);
}

/** @internal */
export function useSelectButtonsSize(controlSizeProp: ControlSizeProp): string {
    const {selectButtonsSizes} = useTheme();
    let styleProps;
    if (typeof controlSizeProp === 'string') {
        styleProps = selectButtonsSizes[controlSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<ControlSize>(
            controlSizeProp,
            selectButtonsSizes,
        );
    }
    return useStyledSystem(styleProps);
}

/** @internal */
export function useSwitchSize(controlSizeProp: ControlSizeProp): string {
    const {switchSizes} = useTheme();
    let styleProps;
    if (typeof controlSizeProp === 'string') {
        styleProps = switchSizes[controlSizeProp];
    } else {
        styleProps = getStylePropsForResponsiveProp<ControlSize>(controlSizeProp, switchSizes);
    }
    return useStyledSystem(styleProps);
}
