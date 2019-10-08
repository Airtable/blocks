[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md)

# External module: @airtable/blocks/ui: CollaboratorToken

## Index

### Type aliases

-   [CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops)

### Functions

-   [CollaboratorToken](_airtable_blocks_ui__collaboratortoken.md#const-collaboratortoken)

## Type aliases

### CollaboratorTokenProps

Ƭ **CollaboratorTokenProps**: _object & TooltipAnchorProps & object & object & object & object &
object & object & object & object & object & object & object & object & object & object_

_Defined in
[src/ui/collaborator_token.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/collaborator_token.tsx#L51)_

**`typedef`** {object} CollaboratorTokenProps

**`property`** {object} collaborator An object representing a collaborator. You should not create
these objects from scratch, but should instead grab them from base data.

**`property`** {string} [collaborator.id] The user ID of the collaborator.

**`property`** {string} [collaborator.email] The email address of the collaborator.

**`property`** {string} [collaborator.name] The name of the collaborator.

**`property`** {string} [collaborator.status] The status of the collaborator.

**`property`** {string} [collaborator.profilePicUrl] The URL of the collaborator's profile picture.

**`property`** {string} [className] Additional class names to apply to the collaborator token.

**`property`** {string} [style] Additional styles to apply to the collaborator token.

## Functions

### `Const` CollaboratorToken

▸ **CollaboratorToken**(`props`:
[CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops)):
_Element_

_Defined in
[src/ui/collaborator_token.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/collaborator_token.tsx#L79)_

A component that shows a single collaborator in a small token, to be displayed inline or in a list
of choices.

**Parameters:**

| Name    | Type                                                                                       | Description |
| ------- | ------------------------------------------------------------------------------------------ | ----------- |
| `props` | [CollaboratorTokenProps](_airtable_blocks_ui__collaboratortoken.md#collaboratortokenprops) |             |

**Returns:** _Element_
