[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui/system: All style props](_airtable_blocks_ui_system__all_style_props.md)

# External module: @airtable/blocks/ui/system: All style props

## Index

### Interfaces

-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)

## Interfaces

### AllStylesProps

• **AllStylesProps**:

_Defined in
[src/ui/system/all_styles_set.ts:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/all_styles_set.ts#L113)_

In the Blocks SDK, UI components can be styled via a set of supported style props. These style props
(e.g. `width`, `margin`, `backgroundColor`) take a subset of supported CSS properties and expose
them as explicit React component props.

Here is an example that uses the [Box](_airtable_blocks_ui__box.md#box) layout primitive:

```
<Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="200px"
    height="200px"
>
    Hello world
</Box>
```

This is equivalent to the following:

```
<Box style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '200px',
    height: '200px',
}}>
    Hello world
</Box>
```

Style props also provide access to Airtable's design tokens, including our color palette,
typographic scale, and spacing scale. This allows developers to quickly build UIs that adhere to the
Airtable design system. As an example, numbers passed to the `margin` or `padding` props are
converted to our spacing scale, based on powers of two.

```
<Box margin={0} /> // margin: 0;
<Box margin={1} /> // margin: 4px;
<Box margin={2} /> // margin: 8px;
<Box margin={3} /> // margin: 16px;

// Negative margins are also supported
<Box margin={-1} /> // margin: -4px;
<Box margin={-2} /> // margin: -8px;
<Box margin={-3} /> // margin: -16px;
```

To override this behavior and use a specific pixel value (or other units, like percentages or
ems/rems), you may pass a string like `200px`. However, this is generally discouraged, as these
values don't adhere to the same grid/vertical rhythm as the rest of our components.

As another example, style props like `backgroundColor` and `textColor` accept
[color names](_airtable_blocks_ui__colors.md#const-colors) that ensure visual consistency with the
Airtable styleguide. Like the spacing scale, you can always opt out by passing in hex/rgb/hsl
strings directly.

```
<Box backgroundColor="blue" textColor="white" />
```

Each component in our UI library exposes a particular subset of style props, documented as style
prop interfaces. For more information, refer to the API reference for the specific component that
you're trying to use.

All supported style props:

-   [Appearance](_airtable_blocks_ui_system__appearance.md#appearancesetprops)
-   [Dimensions](_airtable_blocks_ui_system__dimensions.md#dimensionssetprops)
-   [Flex container](_airtable_blocks_ui_system__flex_container.md#flexcontainersetprops)
-   [Flex item](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [Position](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [Spacing](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [Typography](_airtable_blocks_ui_system__typography.md#typographysetprops)
-   [Display](_airtable_blocks_ui_system__display.md#displayprops)
-   [Overflow](_airtable_blocks_ui_system__overflow.md#overflowprops)
