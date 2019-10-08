[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Toggle](_airtable_blocks_ui__toggle.md)

# External module: @airtable/blocks/ui: Toggle

## Index

### Classes

-   [Toggle](_airtable_blocks_ui__toggle.md#toggle)
-   [ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced)

### Type aliases

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)
-   [ToggleSyncedProps](_airtable_blocks_ui__toggle.md#togglesyncedprops)

## Classes

### Toggle

• **Toggle**:

_Defined in
[src/ui/toggle.tsx:154](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L154)_

A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.

**`example`**

```js
import {Toggle} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function Block() {
    const [isEnabled, setIsEnabled] = useState(false);
    return <Toggle value={isEnabled} onChange={setIsEnabled} label={isEnabled ? 'On' : 'Off'} />;
}
```

### `Static` themes

▪ **themes**: _Object_ = themes

_Defined in
[src/ui/toggle.tsx:156](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L156)_

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/toggle.tsx:186](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L186)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle.tsx:193](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L193)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle.tsx:179](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L179)_

**Returns:** _void_

---

### ToggleSynced

• **ToggleSynced**:

_Defined in
[src/ui/toggle_synced.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L52)_

A toggleable switch for controlling boolean values, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). Functionally analogous to a
checkbox.

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L75)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L82)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L68)_

**Returns:** _void_

## Type aliases

### SharedToggleProps

Ƭ **SharedToggleProps**: _object & TooltipAnchorProps_

_Defined in
[src/ui/toggle.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L75)_

**`typedef`** {object} ToggleProps

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the switch.

**`property`** {string} [id] The ID of the switch element.

**`property`** {React.Node} [label] The label node for the switch.

**`property`** {Function} [onChange] A function to be called when the switch is toggled.

**`property`** {number} [tabIndex] Indicates if the switch can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW
| Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.

**`property`** {boolean} value If set to `true`, the switch will be toggled on.

**`property`** {string} [className] Additional class names to apply to the switch.

**`property`** {object} [style] Additional styles to apply to the switch.

**`property`** {string} [aria-label] The label for the switch. Use this if the switch lacks a
visible text label.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### ToggleSyncedProps

Ƭ **ToggleSyncedProps**: _object & object & TooltipAnchorProps‹HTMLElement› & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object_

_Defined in
[src/ui/toggle_synced.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L30)_

**`typedef`** {object} ToggleSyncedProps

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the switch.

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The switch option will always
reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update
`globalConfig`.

**`property`** {string} [id] The ID of the switch element.

**`property`** {React.Node} [label] The label node for the switch.

**`property`** {Function} [onChange] A function to be called when the switch is toggled. This should
only be used for side effects.

**`property`** {number} [tabIndex] Indicates if the switch can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW
| Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.

**`property`** {string} [className] Additional class names to apply to the switch.

**`property`** {object} [style] Additional styles to apply to the switch.

**`property`** {string} [aria-label] The label for the switch. Use this if the switch lacks a
visible text label.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.
