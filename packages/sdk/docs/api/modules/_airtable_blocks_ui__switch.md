[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Switch](_airtable_blocks_ui__switch.md)

# External module: @airtable/blocks/ui: Switch

## Index

### Interfaces

-   [SharedSwitchProps](_airtable_blocks_ui__switch.md#sharedswitchprops)
-   [SwitchProps](_airtable_blocks_ui__switch.md#switchprops)
-   [SwitchStyleProps](_airtable_blocks_ui__switch.md#switchstyleprops)
-   [SwitchSyncedProps](_airtable_blocks_ui__switch.md#switchsyncedprops)

### Type aliases

-   [SwitchVariant](_airtable_blocks_ui__switch.md#switchvariant)

### Functions

-   [Switch](_airtable_blocks_ui__switch.md#switch)
-   [SwitchSynced](_airtable_blocks_ui__switch.md#switchsynced)

## Interfaces

### SharedSwitchProps

• **SharedSwitchProps**:

_Defined in
[src/ui/switch.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L64)_

Props shared between the [Switch](_airtable_blocks_ui__switch.md#switch) and
[SwitchSynced](_airtable_blocks_ui__switch.md#switchsynced) components. Also accepts:

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/switch.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L88)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Defined in
[src/ui/switch.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L84)_

The label for the switch. Use this if the switch lacks a visible text label.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/switch.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L86)_

A space separated list of label element IDs.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/switch.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L66)_

Additional class names to apply to the switch.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/switch.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L68)_

If set to `true`, the user cannot interact with the switch.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/switch.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L80)_

The ID of the switch element.

### `Optional` label

• **label**? : _React.ReactNode | string_

_Defined in
[src/ui/switch.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L70)_

The label node for the switch.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/switch.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L72)_

A function to be called when the switch is toggled.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/switch.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L78)_

The size of the switch. Defaults to `default`.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/switch.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L82)_

Additional styles to apply to the switch.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/switch.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L74)_

Indicates if the switch can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` variant

• **variant**? : _[SwitchVariant](_airtable_blocks_ui__switch.md#switchvariant)_

_Defined in
[src/ui/switch.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L76)_

The variant of the switch. Defaults to `default` (green).

---

### SwitchProps

• **SwitchProps**:

_Defined in
[src/ui/switch.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L97)_

Props for the [Switch](_airtable_blocks_ui__switch.md#switch) component. Also accepts:

-   [SharedSwitchProps](_airtable_blocks_ui__switch.md#sharedswitchprops)

### value

• **value**: _boolean_

_Defined in
[src/ui/switch.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L99)_

If set to `true`, the switch will be switchd on.

---

### SwitchStyleProps

• **SwitchStyleProps**:

_Defined in
[src/ui/switch.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L142)_

Style props for the [Switch](_airtable_blocks_ui__switch.md#switch) component. Also accepts:

-   [BackgroundColorProps](_airtable_blocks_ui_system__appearance.md#backgroundcolorprops)
-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"flex"
| "inline-flex"›_

_Defined in
[src/ui/switch.tsx:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L151)_

---

### SwitchSyncedProps

• **SwitchSyncedProps**:

_Defined in
[src/ui/switch_synced.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch_synced.tsx#L14)_

Props for the [SwitchSynced](_airtable_blocks_ui__switch.md#switchsynced) component. Also accepts:

-   [SharedSwitchProps](_airtable_blocks_ui__switch.md#sharedswitchprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/switch_synced.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch_synced.tsx#L16)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The switch option will always reflect the boolean value stored in `globalConfig` for this key.
Toggling the switch will update `globalConfig`.

## Type aliases

### SwitchVariant

Ƭ **SwitchVariant**: _"default" | "danger"_

_Defined in
[src/ui/switch.tsx:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L49)_

Variants for the [Switch](_airtable_blocks_ui__switch.md#switch) component:

• **default**

Green switch for toggling a setting or other boolean property.

• **danger**

Red switch for toggling a dangerous or infrequently-used setting.

## Functions

### Switch

▸ **Switch**(`props`: [SwitchProps](_airtable_blocks_ui__switch.md#switchprops), `ref`:
React.Ref‹HTMLDivElement›): _Element_

_Defined in
[src/ui/switch.tsx:190](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch.tsx#L190)_

A toggle switch for controlling boolean values. Similar to a checkbox.

**Example:**

```js
import React, {useState} from 'react';
import {Switch} from '@airtable/blocks/ui';

function Block() {
    const [isShowingImage, setIsShowingImage] = useState(false);
    return (
        <div>
            <Switch value={isShowingImage} onChange={setIsShowingImage} label="Show image" />
            {isShowingImage && <img src="cat.png" />}
        </div>
    );
}
```

**Parameters:**

| Name    | Type                                                      |
| ------- | --------------------------------------------------------- |
| `props` | [SwitchProps](_airtable_blocks_ui__switch.md#switchprops) |
| `ref`   | React.Ref‹HTMLDivElement›                                 |

**Returns:** _Element_

---

### SwitchSynced

▸ **SwitchSynced**(`props`: [SwitchSyncedProps](_airtable_blocks_ui__switch.md#switchsyncedprops),
`ref`: React.Ref‹HTMLDivElement›): _Element_

_Defined in
[src/ui/switch_synced.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/switch_synced.tsx#L40)_

A toggleable switch for controlling boolean values, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). Similar to a checkbox.

**Example:**

```js
import React from 'react';
import {SwitchSynced, useGlobalConfig} from '@airtable/blocks/ui';

function Block() {
    const globalConfig = useGlobalConfig();
    return (
        <div>
            <SwitchSynced globalConfigKey="isShowingImage" label="Show image" />
            {globalConfig.get('isShowingImage') && <img src="cat.png" />}
        </div>
    );
}
```

**Parameters:**

| Name    | Type                                                                  |
| ------- | --------------------------------------------------------------------- |
| `props` | [SwitchSyncedProps](_airtable_blocks_ui__switch.md#switchsyncedprops) |
| `ref`   | React.Ref‹HTMLDivElement›                                             |

**Returns:** _Element_
