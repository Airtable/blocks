/** @module @airtable/blocks/ui/system: All style props */ /** */
// TODO (stephen): write full description
import {compose} from '@styled-system/core';
import {
    appearanceSet,
    appearanceSetPropTypes,
    AppearanceSetProps,
    dimensionsSet,
    dimensionsSetPropTypes,
    DimensionsSetProps,
    flexContainerSet,
    flexContainerSetPropTypes,
    FlexContainerSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
    typographySet,
    typographySetPropTypes,
    TypographySetProps,
    display,
    displayPropTypes,
    DisplayProps,
    overflow,
    overflowPropTypes,
    OverflowProps,
} from './index';

/**
 * All supported style props:
 * * [[AppearanceSetProps|Appearance]]
 * * [[DimensionsSetProps|Dimensions]]
 * * [[FlexContainerSetProps|Flex container]]
 * * [[FlexItemSetProps|Flex item]]
 * * [[PositionSetProps|Position]]
 * * [[SpacingSetProps|Spacing]]
 * * [[TypographySetProps|Typography]]
 * * [[DisplayProps|Display]]
 * * [[OverflowProps|Overflow]]
 * @noInheritDoc
 */
export interface AllStylesProps
    extends AppearanceSetProps,
        DimensionsSetProps,
        FlexContainerSetProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps,
        TypographySetProps,
        DisplayProps,
        OverflowProps {}

export const allStylesParser = compose(
    appearanceSet,
    dimensionsSet,
    flexContainerSet,
    flexItemSet,
    positionSet,
    spacingSet,
    typographySet,
    display,
    overflow,
);

export const allStylesPropTypes = {
    ...appearanceSetPropTypes,
    ...dimensionsSetPropTypes,
    ...flexContainerSetPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
    ...typographySetPropTypes,
    ...displayPropTypes,
    ...overflowPropTypes,
};
