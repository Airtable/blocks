[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ChoiceToken](_airtable_blocks_ui__choicetoken.md)

# External module: @airtable/blocks/ui: ChoiceToken

## Index

### Type aliases

-   [ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops)

### Functions

-   [ChoiceToken](_airtable_blocks_ui__choicetoken.md#const-choicetoken)

## Type aliases

### ChoiceTokenProps

Ƭ **ChoiceTokenProps**: _object & TooltipAnchorProps & object & object & object & object & object &
object & object & object & object & object & object & object & object & object_

_Defined in
[src/ui/choice_token.tsx:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/choice_token.tsx#L49)_

**`typedef`** {object} ChoiceTokenProps

**`property`** {object} choice An object representing a select option. You should not create these
objects from scratch, but should instead grab them from base data.

**`property`** {string} choice.id The ID of the select option.

**`property`** {string} choice.name The name of the select option.

**`property`** {string} [choice.color] The color of the select option.

**`property`** {string} [style] Additional styles to apply to the choice token.

**`property`** {string} [className] Additional class names to apply to the choice token.

## Functions

### `Const` ChoiceToken

▸ **ChoiceToken**(`props`:
[ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops)): _Element_

_Defined in
[src/ui/choice_token.tsx:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/choice_token.tsx#L87)_

A component that shows a single choice in a small token, to be displayed inline or in a list of
choices.

**Parameters:**

| Name    | Type                                                                     | Description |
| ------- | ------------------------------------------------------------------------ | ----------- |
| `props` | [ChoiceTokenProps](_airtable_blocks_ui__choicetoken.md#choicetokenprops) |             |

**Returns:** _Element_
