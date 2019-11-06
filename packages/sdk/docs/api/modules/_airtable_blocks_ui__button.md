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
[src/ui/button.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L117)_

Props for the [Button](_airtable_blocks_ui__button.md#button) component. Also accepts:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [ButtonStyleProps](_airtable_blocks_ui__button.md#buttonstyleprops)

### `Optional` aria-selected

• **aria-selected**? : _undefined | false | true_

_Defined in
[src/ui/button.tsx:143](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L143)_

The `aria-selected` attribute.

### children

• **children**: _React.ReactNode | string_

_Defined in
[src/ui/button.tsx:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L133)_

The contents of the button.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/button.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L139)_

Extra `className`s to apply to the button, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/button.tsx:129](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L129)_

Indicates whether or not the user can interact with the button.

### `Optional` icon

• **icon**? : _IconName | ReactElement_

_Defined in
[src/ui/button.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L123)_

The name of the icon or a React node. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/button.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L127)_

The `id` attribute.

### `Optional` onClick

• **onClick**? : _undefined | function_

_Overrides void_

_Defined in
[src/ui/button.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L137)_

Click event handler. Also handles Space and Enter keypress events.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/button.tsx:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L119)_

The size of the button. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/button.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L141)_

Extra styles to apply to the button.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/button.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L131)_

Indicates if the button can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` type

• **type**? : _"button" | "submit" | "reset"_

_Defined in
[src/ui/button.tsx:125](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L125)_

The type of the button. Defaults to `button`.

### `Optional` variant

• **variant**? : _[ButtonVariant](_airtable_blocks_ui__button.md#buttonvariant)_

_Defined in
[src/ui/button.tsx:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L121)_

The variant of the button. Defaults to `default`.

---

### ButtonStyleProps

• **ButtonStyleProps**:

_Defined in
[src/ui/button.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L50)_

Style props for the [Button](_airtable_blocks_ui__button.md#button) component. Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"inline-flex"
| "flex" | "none"›_

_Defined in
[src/ui/button.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L58)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

## Type aliases

### ButtonVariant

Ƭ **ButtonVariant**: _"default" | "primary" | "secondary" | "danger"_

_Defined in
[src/ui/button.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L100)_

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
React.Ref‹HTMLButtonElement›): _Element_

_Defined in
[src/ui/button.tsx:164](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L164)_

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

**Returns:** _Element_
