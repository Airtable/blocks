[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Icon](_airtable_blocks_ui__icon.md)

# External module: @airtable/blocks/ui: Icon

## Index

### Interfaces

-   [IconProps](_airtable_blocks_ui__icon.md#iconprops)

### Functions

-   [Icon](_airtable_blocks_ui__icon.md#icon)

## Interfaces

### IconProps

• **IconProps**:

_Defined in
[src/ui/icon.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/icon.tsx#L71)_

**`typedef`** {object} IconProps

**`property`** {string} name The name of the icon. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

**`property`** {number} [size=16] The width/height of the icon.

**`property`** {string} [fillColor] The color of the icon.

**`property`** {string} [className] Additional class names to apply to the icon.

**`property`** {object} [style] Additional styles to apply to the icon.

**`property`** {string} [pathClassName] Additional class names to apply to the icon path.

**`property`** {object} [pathStyle] Additional styles to apply to the icon path.

## Functions

### Icon

▸ **Icon**(`__namedParameters`: Object): _null | Element_

_Defined in
[src/ui/icon.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/icon.tsx#L100)_

A vector icon from the Airtable icon set.

**`augments`** React.StatelessFunctionalComponent

**`example`**

```js
import {Button, Icon} from '@airtable/blocks/ui';

const LikeButton = (
    <Button variant="danger" onClick={() => alert('Liked!')}>
        <Icon name="heart" fillColor="#fff" style={{marginRight: 8}} />
        Like
    </Button>
);
```

**Parameters:**

| Name                | Type   |
| ------------------- | ------ |
| `__namedParameters` | Object |

**Returns:** _null | Element_
