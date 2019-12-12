[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ChoiceToken](_airtable_blocks_ui__choicetoken.md)

# External module: @airtable/blocks/ui: ChoiceToken

## Index

### Interfaces

-   [ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops)
-   [ChoiceTokenStyleProps](_airtable_blocks_ui__choicetoken.md#choicetokenstyleprops)
-   [SelectOption](_airtable_blocks_ui__choicetoken.md#selectoption)

### Functions

-   [ChoiceToken](_airtable_blocks_ui__choicetoken.md#const-choicetoken)

## Interfaces

### ChoiceTokenProps

• **ChoiceTokenProps**:

_Defined in
[src/ui/choice_token.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L60)_

Props for the [ChoiceToken](_airtable_blocks_ui__choicetoken.md#const-choicetoken) component. Also
accepts:

-   [ChoiceTokenStyleProps](_airtable_blocks_ui__choicetoken.md#choicetokenstyleprops)

### choice

• **choice**: _[SelectOption](_airtable_blocks_ui__choicetoken.md#selectoption)_

_Defined in
[src/ui/choice_token.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L62)_

An object representing a select option. You should not create these objects from scratch, but should
instead grab them from base data.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/choice_token.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L66)_

Additional class names to apply to the choice token.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/choice_token.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L64)_

Additional styles to apply to the choice token.

---

### ChoiceTokenStyleProps

• **ChoiceTokenStyleProps**:

_Defined in
[src/ui/choice_token.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L32)_

Style props for the [ChoiceToken](_airtable_blocks_ui__choicetoken.md#const-choicetoken) component.
Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)

---

### SelectOption

• **SelectOption**:

_Defined in
[src/ui/choice_token.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L45)_

An option from a select field. You should not create these objects from scratch, but should instead
grab them from base data.

### `Optional` color

• **color**? : _[Color](_airtable_blocks_ui__colors.md#color)_

_Defined in
[src/ui/choice_token.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L51)_

The color of the select option.

### id

• **id**: _string_

_Defined in
[src/ui/choice_token.tsx:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L47)_

The ID of the select option.

### name

• **name**: _string_

_Defined in
[src/ui/choice_token.tsx:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L49)_

The name of the select option.

## Functions

### `Const` ChoiceToken

▸ **ChoiceToken**(`props`:
[ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops)): _Element‹›_

_Defined in
[src/ui/choice_token.tsx:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/choice_token.tsx#L94)_

A component that shows a single choice in a small token, to be displayed inline or in a list of
choices.

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `props` | [ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops) |

**Returns:** _Element‹›_
