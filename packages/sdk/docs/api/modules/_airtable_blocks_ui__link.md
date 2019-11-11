[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Link](_airtable_blocks_ui__link.md)

# External module: @airtable/blocks/ui: Link

## Index

### Interfaces

-   [LinkProps](_airtable_blocks_ui__link.md#linkprops)
-   [LinkStyleProps](_airtable_blocks_ui__link.md#linkstyleprops)

### Type aliases

-   [LinkVariant](_airtable_blocks_ui__link.md#linkvariant)

### Functions

-   [Link](_airtable_blocks_ui__link.md#link)

## Interfaces

### LinkProps

• **LinkProps**:

_Defined in
[src/ui/link.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L120)_

Props for the [Link](_airtable_blocks_ui__link.md#link) component. Also supports:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [LinkStyleProps](_airtable_blocks_ui__link.md#linkstyleprops)

### children

• **children**: _React.ReactNode | string_

_Defined in
[src/ui/link.tsx:144](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L144)_

The contents of the link.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/link.tsx:138](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L138)_

Additional class names to apply to the link.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/link.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L142)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### href

• **href**: _string_

_Defined in
[src/ui/link.tsx:130](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L130)_

The target URL or URL fragment for the link.

### `Optional` icon

• **icon**? : _IconName | ReactElement_

_Defined in
[src/ui/link.tsx:126](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L126)_

The name of the icon or a react node. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/link.tsx:134](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L134)_

The `id` attribute.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/link.tsx:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L122)_

The size of the link. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/link.tsx:140](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L140)_

Additional styles to apply to the link.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/link.tsx:136](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L136)_

Indicates if the link can be focused and if/where it participates in sequential keyboard navigation.

### `Optional` target

• **target**? : _undefined | string_

_Defined in
[src/ui/link.tsx:132](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L132)_

Specifies where to display the linked URL.

### `Optional` underline

• **underline**? : _undefined | false | true_

_Defined in
[src/ui/link.tsx:128](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L128)_

Adds an underline to the link when true.

### `Optional` variant

• **variant**? : _[LinkVariant](_airtable_blocks_ui__link.md#linkvariant)_

_Defined in
[src/ui/link.tsx:124](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L124)_

The variant of the link, which defines the color. Defaults to `default`.

---

### LinkStyleProps

• **LinkStyleProps**:

_Defined in
[src/ui/link.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L54)_

Style props for the [Link](_airtable_blocks_ui__link.md#link) component. Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [FontWeightProps](_airtable_blocks_ui_system__typography.md#fontweightprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"inline-flex"
| "flex" | "none"›_

_Defined in
[src/ui/link.tsx:63](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L63)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

## Type aliases

### LinkVariant

Ƭ **LinkVariant**: _"default" | "dark" | "light"_

_Defined in
[src/ui/link.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L103)_

Variants for the [Link](_airtable_blocks_ui__link.md#link) component:

• **default**

Blue text.

• **dark**

Dark gray text.

• **light**

Light gray text.

## Functions

### Link

▸ **Link**(`props`: [LinkProps](_airtable_blocks_ui__link.md#linkprops), `ref`:
React.Ref‹HTMLAnchorElement›): _Element_

_Defined in
[src/ui/link.tsx:200](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/link.tsx#L200)_

A wrapper around the `<a>` tag that offers a few security benefits:

-   Limited XSS protection. If the `href` starts with `javascript:` or `data:`, `http://` will be
    prepended.
-   There is [reverse tabnabbing prevention](https://www.owasp.org/index.php/Reverse_Tabnabbing). If
    `target` is set, the `rel` attribute will be set to `noopener noreferrer`.

Developers should use `Link` instead of `a` when possible.

**Example:**

```js
import {Link} from '@airtable/blocks/ui';

function MyLinkComponent() {
    return <Link href="https://example.com">Check out my homepage!</Link>;
}
```

**Parameters:**

| Name    | Type                                                |
| ------- | --------------------------------------------------- |
| `props` | [LinkProps](_airtable_blocks_ui__link.md#linkprops) |
| `ref`   | React.Ref‹HTMLAnchorElement›                        |

**Returns:** _Element_
