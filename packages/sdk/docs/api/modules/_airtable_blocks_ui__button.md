[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Button](_airtable_blocks_ui__button.md)

# External module: @airtable/blocks/ui: Button

## Index

### Classes

-   [Button](_airtable_blocks_ui__button.md#button)

### Interfaces

-   [ButtonProps](_airtable_blocks_ui__button.md#buttonprops)

## Classes

### Button

• **Button**:

_Defined in
[src/ui/button.tsx:124](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L124)_

Clickable button component.

**`example`**

```js
import {Button} from '@airtable/blocks/ui';

const button = (
    <Button onClick={() => alert('Clicked!')} disabled={false} theme={Button.themes.BLUE}>
        Click here!
    </Button>
);
```

### `Static` themes

▪ **themes**: _Object_ = themes

_Defined in
[src/ui/button.tsx:145](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L145)_

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/button.tsx:162](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L162)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/button.tsx:169](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L169)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/button.tsx:155](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L155)_

**Returns:** _void_

## Interfaces

### ButtonProps

• **ButtonProps**:

_Defined in
[src/ui/button.tsx:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L56)_

**`typedef`** {object} ButtonProps

**`property`** {Button.themes.RED | Button.themes.GREEN | Button.themes.BLUE | Button.themes.YELLOW
| Button.themes.WHITE | Button.themes.GRAY | Button.themes.DARK | Button.themes.TRANSPARENT}
[theme=Button.themes.BLUE] The color theme for the button.

**`property`** {string} [className] Extra `className`s to apply to the button, separated by spaces.

**`property`** {object} [style] Extra styles to apply to the button.

**`property`** {Function} [onClick] Click event handler. Also handles Space and Enter keypress
events.

**`property`** {string} [type='button'] The type of the button.

**`property`** {boolean} [disabled] Indicates whether or not the user can interact with the button.

**`property`** {number} [tabIndex] Indicates if the button can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {string} [aria-label] The label for the button. Use this if the button lacks a
visible text label.
