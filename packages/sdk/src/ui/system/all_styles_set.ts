/** @module @airtable/blocks/ui/system: All style props */ /** */
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
 * In the Blocks SDK, UI components can be styled via a set of supported style props.
 * These style props (e.g. `width`, `margin`, `backgroundColor`) take a subset of
 * supported CSS properties and expose them as explicit React component props.
 *
 * Here is an example that uses the {@link Box} layout primitive:
 *
 * ```
 * <Box
 *     display="flex"
 *     alignItems="center"
 *     justifyContent="center"
 *     width="200px"
 *     height="200px"
 * >
 *     Hello world
 * </Box>
 * ```
 *
 * This is equivalent to the following:
 *
 * ```
 * <div style={{
 *     display: 'flex',
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *     width: '200px',
 *     height: '200px',
 * }}>
 *     Hello world
 * </div>
 * ```
 *
 * Style props also provide access to Airtable's design tokens, including our color
 * palette, typographic scale, and spacing scale. This allows developers to quickly
 * build UIs that adhere to the Airtable design system. As an example, numbers passed
 * to the `margin` or `padding` props are converted to our spacing scale, based on
 * powers of two.
 *
 * ```
 * <Box margin={0} /> // margin: 0;
 * <Box margin={1} /> // margin: 4px;
 * <Box margin={2} /> // margin: 8px;
 * <Box margin={3} /> // margin: 16px;
 *
 * // Negative margins are also supported
 * <Box margin={-1} /> // margin: -4px;
 * <Box margin={-2} /> // margin: -8px;
 * <Box margin={-3} /> // margin: -16px;
 * ```
 *
 * To override this behavior and use a specific pixel value (or other units, like percentages
 * or ems/rems), you may pass a string like `200px`. However, this is generally discouraged,
 * as these values don't adhere to the same grid/vertical rhythm as the rest of our components.
 *
 * As another example, style props like `backgroundColor` and `textColor` accept
 * {@link Colors|color names} that ensure visual consistency with the Airtable styleguide.
 * Like the spacing scale, you can always opt out by passing in hex/rgb/hsl strings directly.
 *
 * ```
 * <Box backgroundColor="blue" textColor="white" />
 * ```
 *
 * Each component in our UI library exposes a particular subset of style props, documented as
 * style prop interfaces. For more information, refer to the API reference for the specific
 * component that you're trying to use.
 *
 * All supported style props:
 * * {@link AppearanceSetProps|Appearance}
 * * {@link DimensionsSetProps|Dimensions}
 * * {@link FlexContainerSetProps|Flex container}
 * * {@link FlexItemSetProps|Flex item}
 * * {@link PositionSetProps|Position}
 * * {@link SpacingSetProps|Spacing}
 * * {@link TypographySetProps|Typography}
 * * {@link DisplayProps|Display}
 * * {@link OverflowProps|Overflow}
 *
 * @docsPath UI/Style System/All styles
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
