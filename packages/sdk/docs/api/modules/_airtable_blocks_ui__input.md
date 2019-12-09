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
[src/ui/input.tsx:194](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L194)_

Props for the [Input](_airtable_blocks_ui__input.md#input) component. Also accepts:

-   [InputStyleProps](_airtable_blocks_ui__input.md#inputstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[aria-describedby](_airtable_blocks_ui__input.md#optional-aria-describedby)_

_Defined in
[src/ui/input.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L139)_

A space separated list of description element IDs.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[aria-labelledby](_airtable_blocks_ui__input.md#optional-aria-labelledby)_

_Defined in
[src/ui/input.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L137)_

A space separated list of label element IDs.

### `Optional` autoComplete

• **autoComplete**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[autoComplete](_airtable_blocks_ui__input.md#optional-autocomplete)_

_Defined in
[src/ui/input.tsx:129](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L129)_

The `autoComplete` attribute.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[autoFocus](_airtable_blocks_ui__input.md#optional-autofocus)_

_Defined in
[src/ui/input.tsx:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L113)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[className](_airtable_blocks_ui__input.md#optional-classname)_

_Defined in
[src/ui/input.tsx:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L133)_

Additional class names to apply to the input, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[disabled](_airtable_blocks_ui__input.md#optional-disabled)_

_Defined in
[src/ui/input.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L101)_

The `disabled` attribute.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[id](_airtable_blocks_ui__input.md#optional-id)_

_Defined in
[src/ui/input.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L111)_

The `id` attribute.

### `Optional` max

• **max**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[max](_airtable_blocks_ui__input.md#optional-max)_

_Defined in
[src/ui/input.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L115)_

The `max` attribute.

### `Optional` maxLength

• **maxLength**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[maxLength](_airtable_blocks_ui__input.md#optional-maxlength)_

_Defined in
[src/ui/input.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L117)_

The `maxLength` attribute.

### `Optional` min

• **min**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[min](_airtable_blocks_ui__input.md#optional-min)_

_Defined in
[src/ui/input.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L141)_

The `min` attribute.

### `Optional` minLength

• **minLength**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[minLength](_airtable_blocks_ui__input.md#optional-minlength)_

_Defined in
[src/ui/input.tsx:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L121)_

The `minLength` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[name](_airtable_blocks_ui__input.md#optional-name)_

_Defined in
[src/ui/input.tsx:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L109)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[onChange](_airtable_blocks_ui__input.md#optional-onchange)_

_Defined in
[src/ui/input.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L135)_

A function to be called when the input changes.

### `Optional` pattern

• **pattern**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[pattern](_airtable_blocks_ui__input.md#optional-pattern)_

_Defined in
[src/ui/input.tsx:125](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L125)_

The `pattern` attribute.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[placeholder](_airtable_blocks_ui__input.md#optional-placeholder)_

_Defined in
[src/ui/input.tsx:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L119)_

The placeholder for the input.

### `Optional` readOnly

• **readOnly**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[readOnly](_airtable_blocks_ui__input.md#optional-readonly)_

_Defined in
[src/ui/input.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L127)_

The `readOnly` attribute.

### `Optional` required

• **required**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[required](_airtable_blocks_ui__input.md#optional-required)_

_Defined in
[src/ui/input.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L103)_

The `required` attribute.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[size](_airtable_blocks_ui__input.md#optional-size)_

_Defined in
[src/ui/input.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L97)_

The size of the input. Defaults to `default`.

### `Optional` spellCheck

• **spellCheck**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[spellCheck](_airtable_blocks_ui__input.md#optional-spellcheck)_

_Defined in
[src/ui/input.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L105)_

The `spellcheck` attribute.

### `Optional` step

• **step**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[step](_airtable_blocks_ui__input.md#optional-step)_

_Defined in
[src/ui/input.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L123)_

The `step` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[style](_airtable_blocks_ui__input.md#optional-style)_

_Defined in
[src/ui/input.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L131)_

Additional styles to apply to the input.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[tabIndex](_airtable_blocks_ui__input.md#optional-tabindex)_

_Defined in
[src/ui/input.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L107)_

The `tabindex` attribute.

### `Optional` type

• **type**? : _undefined | "number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[type](_airtable_blocks_ui__input.md#optional-type)_

_Defined in
[src/ui/input.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L99)_

The `type` for the input. Defaults to `text`.

### value

• **value**: _string_

_Defined in
[src/ui/input.tsx:196](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L196)_

The input's current value.

---

### InputStyleProps

• **InputStyleProps**:

_Defined in
[src/ui/input.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L71)_

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
[src/ui/input_synced.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input_synced.tsx#L13)_

Props for the [InputSynced](_airtable_blocks_ui__input.md#inputsynced) component. Also accepts:

-   [InputStyleProps](_airtable_blocks_ui__input.md#inputstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[aria-describedby](_airtable_blocks_ui__input.md#optional-aria-describedby)_

_Defined in
[src/ui/input.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L139)_

A space separated list of description element IDs.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[aria-labelledby](_airtable_blocks_ui__input.md#optional-aria-labelledby)_

_Defined in
[src/ui/input.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L137)_

A space separated list of label element IDs.

### `Optional` autoComplete

• **autoComplete**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[autoComplete](_airtable_blocks_ui__input.md#optional-autocomplete)_

_Defined in
[src/ui/input.tsx:129](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L129)_

The `autoComplete` attribute.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[autoFocus](_airtable_blocks_ui__input.md#optional-autofocus)_

_Defined in
[src/ui/input.tsx:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L113)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[className](_airtable_blocks_ui__input.md#optional-classname)_

_Defined in
[src/ui/input.tsx:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L133)_

Additional class names to apply to the input, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[disabled](_airtable_blocks_ui__input.md#optional-disabled)_

_Defined in
[src/ui/input.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L101)_

The `disabled` attribute.

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/input_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input_synced.tsx#L15)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The input value will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Changing the input
value will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[id](_airtable_blocks_ui__input.md#optional-id)_

_Defined in
[src/ui/input.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L111)_

The `id` attribute.

### `Optional` max

• **max**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[max](_airtable_blocks_ui__input.md#optional-max)_

_Defined in
[src/ui/input.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L115)_

The `max` attribute.

### `Optional` maxLength

• **maxLength**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[maxLength](_airtable_blocks_ui__input.md#optional-maxlength)_

_Defined in
[src/ui/input.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L117)_

The `maxLength` attribute.

### `Optional` min

• **min**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[min](_airtable_blocks_ui__input.md#optional-min)_

_Defined in
[src/ui/input.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L141)_

The `min` attribute.

### `Optional` minLength

• **minLength**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[minLength](_airtable_blocks_ui__input.md#optional-minlength)_

_Defined in
[src/ui/input.tsx:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L121)_

The `minLength` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[name](_airtable_blocks_ui__input.md#optional-name)_

_Defined in
[src/ui/input.tsx:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L109)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[onChange](_airtable_blocks_ui__input.md#optional-onchange)_

_Defined in
[src/ui/input.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L135)_

A function to be called when the input changes.

### `Optional` pattern

• **pattern**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[pattern](_airtable_blocks_ui__input.md#optional-pattern)_

_Defined in
[src/ui/input.tsx:125](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L125)_

The `pattern` attribute.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[placeholder](_airtable_blocks_ui__input.md#optional-placeholder)_

_Defined in
[src/ui/input.tsx:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L119)_

The placeholder for the input.

### `Optional` readOnly

• **readOnly**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[readOnly](_airtable_blocks_ui__input.md#optional-readonly)_

_Defined in
[src/ui/input.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L127)_

The `readOnly` attribute.

### `Optional` required

• **required**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[required](_airtable_blocks_ui__input.md#optional-required)_

_Defined in
[src/ui/input.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L103)_

The `required` attribute.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[size](_airtable_blocks_ui__input.md#optional-size)_

_Defined in
[src/ui/input.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L97)_

The size of the input. Defaults to `default`.

### `Optional` spellCheck

• **spellCheck**? : _undefined | false | true_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[spellCheck](_airtable_blocks_ui__input.md#optional-spellcheck)_

_Defined in
[src/ui/input.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L105)_

The `spellcheck` attribute.

### `Optional` step

• **step**? : _number | string_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[step](_airtable_blocks_ui__input.md#optional-step)_

_Defined in
[src/ui/input.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L123)_

The `step` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[style](_airtable_blocks_ui__input.md#optional-style)_

_Defined in
[src/ui/input.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L131)_

Additional styles to apply to the input.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[tabIndex](_airtable_blocks_ui__input.md#optional-tabindex)_

_Defined in
[src/ui/input.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L107)_

The `tabindex` attribute.

### `Optional` type

• **type**? : _undefined | "number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Inherited from
[SharedInputProps](_airtable_blocks_ui__input.md#sharedinputprops).[type](_airtable_blocks_ui__input.md#optional-type)_

_Defined in
[src/ui/input.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L99)_

The `type` for the input. Defaults to `text`.

---

### SharedInputProps

• **SharedInputProps**:

_Defined in
[src/ui/input.tsx:95](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L95)_

Props shared between the [Input](_airtable_blocks_ui__input.md#input) and
[InputSynced](_airtable_blocks_ui__input.md#inputsynced) components.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/input.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L139)_

A space separated list of description element IDs.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/input.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L137)_

A space separated list of label element IDs.

### `Optional` autoComplete

• **autoComplete**? : _undefined | string_

_Defined in
[src/ui/input.tsx:129](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L129)_

The `autoComplete` attribute.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L113)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/input.tsx:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L133)_

Additional class names to apply to the input, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L101)_

The `disabled` attribute.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/input.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L111)_

The `id` attribute.

### `Optional` max

• **max**? : _number | string_

_Defined in
[src/ui/input.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L115)_

The `max` attribute.

### `Optional` maxLength

• **maxLength**? : _undefined | number_

_Defined in
[src/ui/input.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L117)_

The `maxLength` attribute.

### `Optional` min

• **min**? : _number | string_

_Defined in
[src/ui/input.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L141)_

The `min` attribute.

### `Optional` minLength

• **minLength**? : _undefined | number_

_Defined in
[src/ui/input.tsx:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L121)_

The `minLength` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Defined in
[src/ui/input.tsx:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L109)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/input.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L135)_

A function to be called when the input changes.

### `Optional` pattern

• **pattern**? : _undefined | string_

_Defined in
[src/ui/input.tsx:125](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L125)_

The `pattern` attribute.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/input.tsx:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L119)_

The placeholder for the input.

### `Optional` readOnly

• **readOnly**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L127)_

The `readOnly` attribute.

### `Optional` required

• **required**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L103)_

The `required` attribute.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/input.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L97)_

The size of the input. Defaults to `default`.

### `Optional` spellCheck

• **spellCheck**? : _undefined | false | true_

_Defined in
[src/ui/input.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L105)_

The `spellcheck` attribute.

### `Optional` step

• **step**? : _number | string_

_Defined in
[src/ui/input.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L123)_

The `step` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/input.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L131)_

Additional styles to apply to the input.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/input.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L107)_

The `tabindex` attribute.

### `Optional` type

• **type**? : _undefined | "number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L99)_

The `type` for the input. Defaults to `text`.

## Type aliases

### SupportedInputType

Ƭ **SupportedInputType**: _"number" | "time" | "text" | "date" | "datetime-local" | "email" |
"month" | "password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:161](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L161)_

Supported types for the [Input](_airtable_blocks_ui__input.md#input) component. See
[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types) for more
information.

---

### ValidInputType

Ƭ **ValidInputType**: _"number" | "time" | "text" | "date" | "datetime-local" | "email" | "month" |
"password" | "search" | "tel" | "url" | "week"_

_Defined in
[src/ui/input.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L58)_

## Functions

### Input

▸ **Input**(`props`: [InputProps](_airtable_blocks_ui__input.md#inputprops), `ref`:
React.Ref‹HTMLInputElement›): _Element‹›_

_Defined in
[src/ui/input.tsx:224](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input.tsx#L224)_

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

**Returns:** _Element‹›_

---

### InputSynced

▸ **InputSynced**(`props`: [InputSyncedProps](_airtable_blocks_ui__input.md#inputsyncedprops),
`ref`: React.Ref‹HTMLInputElement›): _Element‹›_

_Defined in
[src/ui/input_synced.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/input_synced.tsx#L36)_

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

**Returns:** _Element‹›_
