[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useSettingsButton](_airtable_blocks_ui__usesettingsbutton.md)

# External module: @airtable/blocks/ui: useSettingsButton

## Index

### Functions

-   [useSettingsButton](_airtable_blocks_ui__usesettingsbutton.md#usesettingsbutton)

## Functions

### useSettingsButton

▸ **useSettingsButton**(`onClickCallback`: FlowAnyFunction): _void_

_Defined in
[src/ui/use_settings_button.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_settings_button.ts#L32)_

A hook for using the settings button that lives outside the block's viewport. It will show the
settings button (hidden by default) and call the provided callback whenever the settings button is
clicked. It will also re-render your component when the settings button is clicked.

**Example:**

```js
import {useSettingsButton} from '@airtable/blocks/ui';
import {useState} from 'react';

function ComponentWithSettings() {
    const [isShowingSettings, setIsShowingSettings] = useState(false);
    useSettingsButton(function() {
        setIsShowingSettings(!isShowingSettings);
    });

    if (isShowingSettings) {
        return <SettingsComponent />;
    }
    return <MainComponent />;
}
```

**Parameters:**

| Name              | Type            | Description                                    |
| ----------------- | --------------- | ---------------------------------------------- |
| `onClickCallback` | FlowAnyFunction | A callback to call when the button is clicked. |

**Returns:** _void_
