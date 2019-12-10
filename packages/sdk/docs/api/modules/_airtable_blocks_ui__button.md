[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Button](_airtable_blocks_ui__button.md)

# External module: @airtable/blocks/ui: Button

## Index

### Interfaces

-   [ButtonProps](_airtable_blocks_ui__button.md#buttonprops)
-   [ButtonStyleProps](_airtable_blocks_ui__button.md#buttonstyleprops)

### Type aliases

-   [ButtonVariant](_airtable_blocks_ui__button.md#buttonvariant)

### Functions

-   [Button](_airtable_blocks_ui__button.md#button)

## Interfaces

### ButtonProps

• **ButtonProps**:

_Defined in
[src/ui/button.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L118)_

Props for the [Button](_airtable_blocks_ui__button.md#button) component. Also accepts:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [ButtonStyleProps](_airtable_blocks_ui__button.md#buttonstyleprops)

### `Optional` aria-selected

• **aria-selected**? : _undefined | false | true_

_Defined in
[src/ui/button.tsx:146](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L146)_

The `aria-selected` attribute.

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/button.tsx:136](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L136)_

The contents of the button.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/button.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L142)_

Extra `className`s to apply to the button, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/button.tsx:130](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L130)_

Indicates whether or not the user can interact with the button.

### `Optional` icon

• **icon**? : _IconName | ReactElement_

_Defined in
[src/ui/button.tsx:124](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L124)_

The name of the icon or a React node. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/button.tsx:128](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L128)_

The `id` attribute.

### `Optional` onClick

• **onClick**? : _undefined | function_

_Overrides void_

_Defined in
[src/ui/button.tsx:140](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L140)_

Click event handler. Also handles Space and Enter keypress events.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/button.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L120)_

The size of the button. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/button.tsx:144](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L144)_

Extra styles to apply to the button.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/button.tsx:132](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L132)_

Indicates if the button can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` type

• **type**? : _"button" | "submit" | "reset"_

_Defined in
[src/ui/button.tsx:126](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L126)_

The type of the button. Defaults to `button`.

### `Optional` variant

• **variant**? : _[ButtonVariant](_airtable_blocks_ui__button.md#buttonvariant)_

_Defined in
[src/ui/button.tsx:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L122)_

The variant of the button. Defaults to `default`.

---

### ButtonStyleProps

• **ButtonStyleProps**:

_Defined in
[src/ui/button.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L51)_

Style props for the [Button](_airtable_blocks_ui__button.md#button) component. Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"inline-flex"
| "flex" | "none"›_

_Defined in
[src/ui/button.tsx:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L59)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

## Type aliases

### ButtonVariant

Ƭ **ButtonVariant**: _"default" | "primary" | "secondary" | "danger"_

_Defined in
[src/ui/button.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L101)_

Variants for the [Button](_airtable_blocks_ui__button.md#button) component:

• **default**

Gray button for toolbars and other generic actions.

• **primary**

Blue button used for primary actions and CTAs. There should only be one primary button present at a
time. Often used in [Dialog](_airtable_blocks_ui__dialog.md#dialog) and bottom bars.

• **secondary**

Transparent button that pairs with the primary button. This is typically used for cancel or back
buttons.

• **danger**

Red button that replaces primary buttons for dangerous or otherwise difficult-to-reverse actions
like record deletion.

## Functions

### Button

▸ **Button**(`props`: [ButtonProps](_airtable_blocks_ui__button.md#buttonprops), `ref`:
React.Ref‹HTMLButtonElement›): _Element‹›_

_Defined in
[src/ui/button.tsx:167](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/button.tsx#L167)_

Clickable button component.

**Example:**

```js
import {Button} from '@airtable/blocks/ui';

const button = (
    <Button onClick={() => alert('Clicked!')} disabled={false} variant="primary">
        Click here!
    </Button>
);
```

**Parameters:**

| Name    | Type                                                      |
| ------- | --------------------------------------------------------- |
| `props` | [ButtonProps](_airtable_blocks_ui__button.md#buttonprops) |
| `ref`   | React.Ref‹HTMLButtonElement›                              |

**Returns:** _Element‹›_
