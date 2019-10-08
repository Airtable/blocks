[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Link](_airtable_blocks_ui__link.md)

# External module: @airtable/blocks/ui: Link

## Index

### Type aliases

-   [LinkProps](_airtable_blocks_ui__link.md#linkprops)

### Functions

-   [Link](_airtable_blocks_ui__link.md#const-link)

## Type aliases

### LinkProps

Ƭ **LinkProps**: _object & TooltipAnchorProps_

_Defined in
[src/ui/link.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L14)_

**`typedef`** {object} LinkProps

**`property`** {string} href The target URL or URL fragment for the link.

**`property`** {string} [target] Specifies where to display the linked URL.

**`property`** {number} [tabIndex] Indicates if the link can be focused and if/where it participates
in sequential keyboard navigation.

**`property`** {string} [className] Additional class names to apply to the link.

**`property`** {object} [style] Additional styles to apply to the link.

## Functions

### `Const` Link

▸ **Link**(`props`: [LinkProps](_airtable_blocks_ui__link.md#linkprops)): _Element_

_Defined in
[src/ui/link.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L54)_

A wrapper around the `<a>` tag that offers a few security benefits:

-   Limited XSS protection. If the `href` starts with `javascript:` or `data:`, `http://` will be
    prepended.
-   There is [reverse tabnabbing prevention](https://www.owasp.org/index.php/Reverse_Tabnabbing). If
    `target` is set, the `rel` attribute will be set to `noopener noreferrer`.

Developers should use `Link` instead of `a` when possible.

**Parameters:**

| Name    | Type                                                | Description |
| ------- | --------------------------------------------------- | ----------- |
| `props` | [LinkProps](_airtable_blocks_ui__link.md#linkprops) |             |

**Returns:** _Element_
