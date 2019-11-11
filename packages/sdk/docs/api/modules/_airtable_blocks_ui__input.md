[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Input](_airtable_blocks_ui__input.md)

# External module: @airtable/blocks/ui: Input

## Index

### Interfaces

-   [InputProps](_airtable_blocks_ui__input.md#inputprops)
-   [InputStyleProps](_airtable_blocks_ui__input.md#inputstyleprops)
-   [InputSyncedProps](_airtable_blocks_ui__input.md#inputsyncedprops)
-   [SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops)

### Type aliases

-   [SupportedInputType](_airtable_blocks_ui__input.md#supportedinputtype)
-   [ValidInputType](_airtable_blocks_ui__input.md#validinputtype)

### Functions

-   [Input](_airtable_blocks_ui__input.md#input)
-   [InputSynced](_airtable_blocks_ui__input.md#inputsynced)

## Interfaces

### InputProps

• **InputProps**:

_Defined in
[src/ui/input.tsx:205](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L205)_

Props for the [Input](_airtable_blocks_ui__input.md#input) component. Also accepts:

-   [SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops)

### value

• **value**: _string_

_Defined in
[src/ui/input.tsx:207](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L207)_

The input's current value.

---

### InputStyleProps

• **InputStyleProps**:

_Defined in
[src/ui/input.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L71)_

Style props shared between the [Input](_airtable_blocks_ui__input.md#input) and
[InputSynced](_airtable_blocks_ui__input.md#inputsynced) components. Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

---

### InputSyncedProps

• **InputSyncedProps**:

_Defined in
[src/ui/input_synced.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input_synced.tsx#L16)_

Props for the [Input](_airtable_blocks_ui__input.md#input) and
[InputSynced](_airtable_blocks_ui__input.md#inputsynced) components. Also accepts:

-   [SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/input_synced.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input_synced.tsx#L18)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The input value will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Changing the input
value will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

---

### SharedInputProps

• **SharedInputProps**:

_Defined in
[src/ui/input.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L104)_

Props shared between the [Input](_airtable_blocks_ui__input.md#input) and
[InputSynced](_airtable_blocks_ui__input.md#inputsynced) components. Also accepts:

-   [InputStyleProps](_airtable_blocks_ui__input.md#inputstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/input.tsx:148](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L148)_

A space separated list of description element IDs.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/input.tsx:146](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L146)_

A space separated list of label element IDs.

### `Optional` autoComplete

• **autoComplete**? : _undefined | string_

_Defined in
[src/ui/input.tsx:138](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L138)_

The `autoComplete` attribute.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L122)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/input.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L142)_

Additional class names to apply to the input, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L110)_

The `disabled` attribute.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/input.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L120)_

The `id` attribute.

### `Optional` max

• **max**? : _number | string_

_Defined in
[src/ui/input.tsx:124](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L124)_

The `max` attribute.

### `Optional` maxLength

• **maxLength**? : _undefined | number_

_Defined in
[src/ui/input.tsx:126](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L126)_

The `maxLength` attribute.

### `Optional` min

• **min**? : _number | string_

_Defined in
[src/ui/input.tsx:150](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L150)_

The `min` attribute.

### `Optional` minLength

• **minLength**? : _undefined | number_

_Defined in
[src/ui/input.tsx:130](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L130)_

The `minLength` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Defined in
[src/ui/input.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L118)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/input.tsx:144](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L144)_

A function to be called when the input changes.

### `Optional` pattern

• **pattern**? : _undefined | string_

_Defined in
[src/ui/input.tsx:134](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L134)_

The `pattern` attribute.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/input.tsx:128](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L128)_

The placeholder for the input.

### `Optional` readOnly

• **readOnly**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:136](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L136)_

The `readOnly` attribute.

### `Optional` required

• **required**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L112)_

The `required` attribute.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/input.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L106)_

The size of the input. Defaults to `default`.

### `Optional` spellCheck

• **spellCheck**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L114)_

The `spellcheck` attribute.

### `Optional` step

• **step**? : _number | string_

_Defined in
[src/ui/input.tsx:132](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L132)_

The `step` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/input.tsx:140](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L140)_

Additional styles to apply to the input.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/input.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L116)_

The `tabindex` attribute.

### `Optional` type

• **type**? : _undefined | "number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L108)_

The `type` for the input. Defaults to `text`.

## Type aliases

### SupportedInputType

Ƭ **SupportedInputType**: _"number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:170](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L170)_

Supported types for the [Input](_airtable_blocks_ui__input.md#input) component. See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types) for more
information.

---

### ValidInputType

Ƭ **ValidInputType**: _"number" | "time" | "text" | "date" | "datetime-local" | "email" | "month" |
"password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L58)_

## Functions

### Input

▸ **Input**(`props`: [InputProps](_airtable_blocks_ui__input.md#inputprops), `ref`:
React.Ref‹HTMLInputElement›): _Element_

_Defined in
[src/ui/input.tsx:235](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input.tsx#L235)_

An input component. A wrapper around `<input>` that fits in with Airtable's user interface.

**Example:**

```js
import {Input} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';

function HelloSomeone() {
    const [value, setValue] = useState('world');

    return (
        <Fragment>
            <div>Hello, {value}!</div>

            <Input
                value={value}
                onChange={event => setValue(event.target.value)}
                placeholder="world"
            />
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                   |
| ------- | ------------------------------------------------------ |
| `props` | [InputProps](_airtable_blocks_ui__input.md#inputprops) |
| `ref`   | React.Ref‹HTMLInputElement›                            |

**Returns:** _Element_

---

### InputSynced

▸ **InputSynced**(`props`: [InputSyncedProps](_airtable_blocks_ui__input.md#inputsyncedprops),
`ref`: React.Ref‹HTMLInputElement›): _Element_

_Defined in
[src/ui/input_synced.tsx:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/input_synced.tsx#L39)_

A wrapper around the [Input](_airtable_blocks_ui__input.md#input) component that syncs with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {InputSynced} from '@airtable/blocks/ui';
import React from 'react';

function ApiKeyInput() {
    return <InputSynced globalConfigKey="apiKey" disabled={!canEditApiKey} />;
}
```

**Parameters:**

| Name    | Type                                                               |
| ------- | ------------------------------------------------------------------ |
| `props` | [InputSyncedProps](_airtable_blocks_ui__input.md#inputsyncedprops) |
| `ref`   | React.Ref‹HTMLInputElement›                                        |

**Returns:** _Element_
