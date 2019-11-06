[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Toggle](_airtable_blocks_ui__toggle.md)

# External module: @airtable/blocks/ui: Toggle

## Index

### Classes

-   [Toggle](_airtable_blocks_ui__toggle.md#toggle)
-   [ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced)

### Interfaces

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)
-   [ToggleProps](_airtable_blocks_ui__toggle.md#toggleprops)
-   [ToggleStyleProps](_airtable_blocks_ui__toggle.md#togglestyleprops)
-   [ToggleSyncedProps](_airtable_blocks_ui__toggle.md#togglesyncedprops)

### Type aliases

-   [ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)

## Classes

### Toggle

• **Toggle**:

_Defined in
[src/ui/toggle.tsx:186](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L186)_

A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.

**Example:**

```js
import {Toggle} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function Block() {
    const [isEnabled, setIsEnabled] = useState(false);
    return <Toggle value={isEnabled} onChange={setIsEnabled} label={isEnabled ? 'On' : 'Off'} />;
}
```

---

### ToggleSynced

• **ToggleSynced**:

_Defined in
[src/ui/toggle_synced.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L46)_

A wrapper around the [Toggle](_airtable_blocks_ui__toggle.md#toggle) component that syncs with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {ToggleSynced, useWatchable} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

function Block() {
    useWatchable(globalConfig, ['isEnabled']);
    return (
        <Toggle globalConfigKey="isEnabled" label={globalConfig.get('isEnabled') ? 'On' : 'Off'} />
    );
}
```

## Interfaces

### SharedToggleProps

• **SharedToggleProps**:

_Defined in
[src/ui/toggle.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L72)_

Props shared between the [Toggle](_airtable_blocks_ui__toggle.md#toggle) and
[ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced) components. Also accepts:

-   [ToggleStyleProps](_airtable_blocks_ui__toggle.md#togglestyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L94)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L90)_

The label for the switch. Use this if the switch lacks a visible text label.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L92)_

A space separated list of label element IDs.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L74)_

Additional class names to apply to the switch.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/toggle.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L76)_

If set to `true`, the user cannot interact with the switch.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L86)_

The ID of the switch element.

### `Optional` label

• **label**? : _React.ReactNode_

_Defined in
[src/ui/toggle.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L78)_

The label node for the switch.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/toggle.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L80)_

A function to be called when the switch is toggled.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/toggle.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L88)_

Additional styles to apply to the switch.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/toggle.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L82)_

Indicates if the switch can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` theme

• **theme**? : _[ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)_

_Defined in
[src/ui/toggle.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L84)_

The color theme for the switch. Defaults to Toggle.themes.GREEN.

---

### ToggleProps

• **ToggleProps**:

_Defined in
[src/ui/toggle.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L103)_

Props for the [Toggle](_airtable_blocks_ui__toggle.md#toggle) component. Also accepts:

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)

### value

• **value**: _boolean_

_Defined in
[src/ui/toggle.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L105)_

If set to `true`, the switch will be toggled on.

---

### ToggleStyleProps

• **ToggleStyleProps**:

_Defined in
[src/ui/toggle.tsx:134](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L134)_

Style props shared between the [Toggle](_airtable_blocks_ui__toggle.md#toggle) and
[ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced) components. Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"flex"
| "inline-flex"›_

_Defined in
[src/ui/toggle.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L142)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

---

### ToggleSyncedProps

• **ToggleSyncedProps**:

_Defined in
[src/ui/toggle_synced.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L21)_

Props for the [ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced) component. Also accepts:

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/toggle_synced.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L23)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The switch will always reflect the boolean stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Toggling the switch
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

## Type aliases

### ToggleTheme

Ƭ **ToggleTheme**: _ObjectValues‹object›_

_Defined in
[src/ui/toggle.tsx:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L53)_

Themes for the [Toggle](_airtable_blocks_ui__toggle.md#toggle) component.
