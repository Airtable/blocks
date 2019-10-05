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

export type AllStylesProps = (AppearanceSetProps) &
    (DimensionsSetProps) &
    (FlexContainerSetProps) &
    (FlexItemSetProps) &
    (PositionSetProps) &
    (SpacingSetProps) &
    (TypographySetProps) &
    (DisplayProps) &
    (OverflowProps);

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
