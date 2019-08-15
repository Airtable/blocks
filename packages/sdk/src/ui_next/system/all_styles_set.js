// @flow
import {compose} from '@styled-system/core';
import {
    appearanceSet,
    appearanceSetPropTypes,
    type AppearanceSetProps,
    dimensionsSet,
    dimensionsSetPropTypes,
    type DimensionsSetProps,
    flexContainerSet,
    flexContainerSetPropTypes,
    type FlexContainerSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    type SpacingSetProps,
    typographySet,
    typographySetPropTypes,
    type TypographySetProps,
    display,
    displayPropTypes,
    type DisplayProps,
    overflow,
    overflowPropTypes,
    type OverflowProps,
} from './index';

export type AllStylesProps = {|
    ...AppearanceSetProps,
    ...DimensionsSetProps,
    ...FlexContainerSetProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...SpacingSetProps,
    ...TypographySetProps,
    ...DisplayProps,
    ...OverflowProps,
|};

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
