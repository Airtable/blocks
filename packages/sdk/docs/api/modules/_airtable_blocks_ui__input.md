[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Input](_airtable_blocks_ui__input.md)

# External module: @airtable/blocks/ui: Input

## Index

### Classes

-   [Input](_airtable_blocks_ui__input.md#input)
-   [InputSynced](_airtable_blocks_ui__input.md#inputsynced)

### Type aliases

-   [InputProps](_airtable_blocks_ui__input.md#inputprops)
-   [InputSyncedProps](_airtable_blocks_ui__input.md#inputsyncedprops)

## Classes

### Input

• **Input**:

_Defined in
[src/ui/input.tsx:189](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L189)_

An input component. A wrapper around `<input>` that fits in with Airtable's user interface.

**`example`**

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

### `Static` contextType

▪ **contextType**: _Context‹string›_ = FormFieldIdContext

_Overrides void_

_Defined in
[src/ui/input.tsx:198](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L198)_

### `Static` validTypesSet

▪ **validTypesSet**: _Object_ = validTypesSet

_Defined in
[src/ui/input.tsx:191](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L191)_

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/input.tsx:214](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L214)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/input.tsx:221](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L221)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/input.tsx:207](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L207)_

**Returns:** _void_

### select

▸ **select**(): _void_

_Defined in
[src/ui/input.tsx:228](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L228)_

**Returns:** _void_

---

### InputSynced

• **InputSynced**:

_Defined in
[src/ui/input_synced.tsx:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L57)_

A wrapper around the `UI.Input` component that syncs with global config.

**`example`**

```js
import {UI} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

function ApiKeyInput() {
    return <UI.InputSynced globalConfigKey="apiKey" disabled={!canEditApiKey} />;
}
```

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/input_synced.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L85)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/input_synced.tsx:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L92)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/input_synced.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L78)_

**Returns:** _void_

### select

▸ **select**(): _void_

_Defined in
[src/ui/input_synced.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L99)_

**Returns:** _void_

## Type aliases

### InputProps

Ƭ **InputProps**: _object & object & object & object_

_Defined in
[src/ui/input.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input.tsx#L137)_

**`typedef`** {object} InputProps

**`property`** {string} value The input's current value.

**`property`** {Function} onChange A function to be called when the input changes.

**`property`** {string} [type='text'] The `type` for the input. Defaults to `text`.

**`property`** {string} [placeholder] The placeholder for the input.

**`property`** {object} [style] Additional styles to apply to the input.

**`property`** {string} [className] Additional class names to apply to the input, separated by
spaces.

**`property`** {boolean} [disabled] The `disabled` attribute.

**`property`** {boolean} [required] The `required` attribute.

**`property`** {boolean} [spellCheck] The `spellcheck` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {string} [id] The `id` attribute.

**`property`** {boolean} [autoFocus] The `autoFocus` attribute.

**`property`** {number | string} [max] The `max` attribute.

**`property`** {number} [maxLength] The `maxLength` attribute.

**`property`** {number | string} [min] The `min` attribute.

**`property`** {number} [minLength] The `minLength` attribute.

**`property`** {number | string} [step] The `step` attribute.

**`property`** {string} [pattern] The `pattern` attribute.

**`property`** {boolean} [readOnly] The `readOnly` attribute.

**`property`** {string} [autoComplete] The `autoComplete` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### InputSyncedProps

Ƭ **InputSyncedProps**: _object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/input_synced.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/input_synced.tsx#L36)_

**`typedef`** {object} InputSyncedProps

**`property`** {string|Array<string>} globalConfigKey The key, or path to a key, in global config.

**`property`** {Function} onChange A function to be called when the input changes.

**`property`** {string} [type='text'] The `type` for the input. Defaults to `text`.

**`property`** {string} [placeholder] The placeholder for the input.

**`property`** {object} [style] Additional styles to apply to the input.

**`property`** {string} [className] Additional class names to apply to the input, separated by
spaces.

**`property`** {boolean} [disabled] The `disabled` attribute.

**`property`** {boolean} [required] The `required` attribute.

**`property`** {boolean} [spellCheck] The `spellcheck` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {string} [id] The `id` attribute.

**`property`** {boolean} [autoFocus] The `autoFocus` attribute.

**`property`** {number | string} [max] The `max` attribute.

**`property`** {number} [maxLength] The `maxLength` attribute.

**`property`** {number | string} [min] The `min` attribute.

**`property`** {number} [minLength] The `minLength` attribute.

**`property`** {number | string} [step] The `step` attribute.

**`property`** {string} [pattern] The `pattern` attribute.

**`property`** {boolean} [readOnly] The `readOnly` attribute.

**`property`** {string} [autoComplete] The `autoComplete` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.
