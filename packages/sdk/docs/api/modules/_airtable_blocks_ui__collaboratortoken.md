[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md)

# External module: @airtable/blocks/ui: CollaboratorToken

## Index

### Interfaces

-   [CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops)
-   [CollaboratorTokenStyleProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenstyleprops)

### Functions

-   [CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md#const-collaboratortoken)

## Interfaces

### CollaboratorTokenProps

• **CollaboratorTokenProps**:

_Defined in
[src/ui/collaborator_token.tsx:55](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L55)_

Props for the [CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md#const-collaboratortoken)
component. Also accepts:

-   [CollaboratorTokenStyleProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenstyleprops)

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/collaborator_token.tsx:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L59)_

Additional class names to apply to the collaborator token.

### collaborator

• **collaborator**: _Partial‹[CollaboratorData](_airtable_blocks_models__base.md#collaboratordata)›_

_Defined in
[src/ui/collaborator_token.tsx:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L57)_

An object representing a collaborator. You should not create these objects from scratch, but should
instead grab them from base data.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/collaborator_token.tsx:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L61)_

Additional styles to apply to the collaborator token.

---

### CollaboratorTokenStyleProps

• **CollaboratorTokenStyleProps**:

_Defined in
[src/ui/collaborator_token.tsx:35](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L35)_

Style props for the
[CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md#const-collaboratortoken) component.
Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)

## Functions

### `Const` CollaboratorToken

▸ **CollaboratorToken**(`props`:
[CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops)):
_Element_

_Defined in
[src/ui/collaborator_token.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/collaborator_token.tsx#L82)_

A component that shows a single collaborator in a small token, to be displayed inline or in a list
of choices.

**Parameters:**

| Name    | Type                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| `props` | [CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops) |

**Returns:** _Element_
