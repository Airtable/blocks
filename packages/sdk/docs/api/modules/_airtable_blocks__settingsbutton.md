[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: settingsButton](_airtable_blocks__settingsbutton.md)

# External module: @airtable/blocks: settingsButton

## Index

### Classes

-   [SettingsButton](_airtable_blocks__settingsbutton.md#settingsbutton)

### Type aliases

-   [WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)

## Classes

### SettingsButton

• **SettingsButton**:

_Defined in
[src/settings_button.ts:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/settings_button.ts#L37)_

Interface to the settings button that lives outside the block's viewport.

The [useSettingsButton](_airtable_blocks_ui__usesettingsbutton.md#usesettingsbutton) hook is the
recommend way to watch the settings button, but you can also use it directly as per below example.

Watch `click` to handle click events on the button.

**Alias:** settingsButton

**Example:**

```js
import {settingsButton} from '@airtable/blocks';
// Button is not visible by default
settingsButton.show();
settingsButton.watch('click', () => {
    alert('Clicked!');
});
```

### isVisible

• **isVisible**:

_Defined in
[src/settings_button.ts:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/settings_button.ts#L60)_

Whether the settings button is being shown. Can be watched.

### hide

▸ **hide**(): _void_

_Defined in
[src/settings_button.ts:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/settings_button.ts#L83)_

Hide the settings button.

Note: A count of calls to `show()` and `hide()` is maintained internally. The button will stay
visible if there are more calls to `show()` than `hide()`.

**Returns:** _void_

### show

▸ **show**(): _void_

_Defined in
[src/settings_button.ts:67](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/settings_button.ts#L67)_

Show the settings button.

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`:
[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey) |
ReadonlyArray‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›,
`callback`: Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                                                                                                                                                            | Description                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey) &#124; ReadonlyArray‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)› | the keys to unwatch                                         |
| `callback` | Object                                                                                                                                                                                                          | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                       | the context that was passed to `.watch` for this `callback` |

**Returns:**
_Array‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`:
[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey) |
ReadonlyArray‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›,
`callback`: Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                                                                                                                                                            | Description                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey) &#124; ReadonlyArray‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)› | the keys to watch                             |
| `callback` | Object                                                                                                                                                                                                          | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                       | an optional context for `this` in `callback`. |

**Returns:**
_Array‹[WatchableSettingsButtonKey](_airtable_blocks__settingsbutton.md#watchablesettingsbuttonkey)›_

the array of keys that were watched

## Type aliases

### WatchableSettingsButtonKey

Ƭ **WatchableSettingsButtonKey**: _"isVisible" | "click"_

_Defined in
[src/settings_button.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/settings_button.ts#L16)_

A watchable key in [SettingsButton](_airtable_blocks__settingsbutton.md#settingsbutton).

-   `isVisible`
-   `click`
