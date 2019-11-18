[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: FieldPicker](_airtable_blocks_ui__fieldpicker.md)

# External module: @airtable/blocks/ui: FieldPicker

## Index

### Interfaces

-   [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops)
-   [FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops)
-   [SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops)

### Functions

-   [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker)
-   [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced)

## Interfaces

### FieldPickerProps

• **FieldPickerProps**:

_Defined in
[src/ui/field_picker.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L43)_

Props for the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) component. Also
accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[FieldType](_airtable_blocks_models__field.md#fieldtype)›_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[allowedTypes](_airtable_blocks_ui__fieldpicker.md#optional-allowedtypes)_

_Defined in
[src/ui/field_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L20)_

An array indicating which field types can be selected.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### `Optional` field

• **field**? : _[Field](_airtable_blocks_models__field.md#field) | null_

_Defined in
[src/ui/field_picker.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L45)_

The selected field model.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[onChange](_airtable_blocks_ui__fieldpicker.md#optional-onchange)_

_Defined in
[src/ui/field_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L26)_

A function to be called when the selected field changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[placeholder](_airtable_blocks_ui__fieldpicker.md#optional-placeholder)_

_Defined in
[src/ui/field_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L24)_

The placeholder text when no field is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__fieldpicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/field_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L22)_

If set to `true`, the user can unset the selected field.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[table](_airtable_blocks_ui__fieldpicker.md#optional-table)_

_Defined in
[src/ui/field_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L18)_

The parent table model to select fields from. If `null` or `undefined`, the picker won't render.

---

### FieldPickerSyncedProps

• **FieldPickerSyncedProps**:

_Defined in
[src/ui/field_picker_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker_synced.tsx#L15)_

Props for the [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced) component.
Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[FieldType](_airtable_blocks_models__field.md#fieldtype)›_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[allowedTypes](_airtable_blocks_ui__fieldpicker.md#optional-allowedtypes)_

_Defined in
[src/ui/field_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L20)_

An array indicating which field types can be selected.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/field_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker_synced.tsx#L17)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected field will always reflect the field id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new field
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[onChange](_airtable_blocks_ui__fieldpicker.md#optional-onchange)_

_Defined in
[src/ui/field_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L26)_

A function to be called when the selected field changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[placeholder](_airtable_blocks_ui__fieldpicker.md#optional-placeholder)_

_Defined in
[src/ui/field_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L24)_

The placeholder text when no field is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__fieldpicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/field_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L22)_

If set to `true`, the user can unset the selected field.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Inherited from
[SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops).[table](_airtable_blocks_ui__fieldpicker.md#optional-table)_

_Defined in
[src/ui/field_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L18)_

The parent table model to select fields from. If `null` or `undefined`, the picker won't render.

---

### SharedFieldPickerProps

• **SharedFieldPickerProps**:

_Defined in
[src/ui/field_picker.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L16)_

Props shared between the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) and
[FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced) components.

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[FieldType](_airtable_blocks_models__field.md#fieldtype)›_

_Defined in
[src/ui/field_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L20)_

An array indicating which field types can be selected.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/field_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L26)_

A function to be called when the selected field changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/field_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L24)_

The placeholder text when no field is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/field_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L22)_

If set to `true`, the user can unset the selected field.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Defined in
[src/ui/field_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L18)_

The parent table model to select fields from. If `null` or `undefined`, the picker won't render.

## Functions

### FieldPicker

▸ **FieldPicker**(`props`: [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _null | Element_

_Defined in
[src/ui/field_picker.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker.tsx#L100)_

Dropdown menu component for selecting fields.

**Example:**

```js
import {TablePicker, FieldPicker, useBase} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';
import React, {Fragment, useState} from 'react';

function Block() {
    useBase();
    const [table, setTable] = useState(null);
    const [field, setField] = useState(null);

    const summaryText = field
        ? `The field type for ${field.name} is ${field.type}.`
        : 'No field selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePicker
                    table={table}
                    onChange={newTable => {
                        setTable(newTable);
                        setField(null);
                    }}
                    shouldAllowPickingNone={true}
                />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
                    <FieldPicker
                        table={table}
                        field={field}
                        onChange={newField => setField(newField)}
                        allowedTypes={[
                            fieldTypes.SINGLE_LINE_TEXT,
                            fieldTypes.MULTILINE_TEXT,
                            fieldTypes.EMAIL,
                            fieldTypes.URL,
                            fieldTypes.PHONE_NUMBER,
                        ]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `props` | [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                             |

**Returns:** _null | Element_

---

### FieldPickerSynced

▸ **FieldPickerSynced**(`props`:
[FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element_

_Defined in
[src/ui/field_picker_synced.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_picker_synced.tsx#L71)_

A wrapper around the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) component that
syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {TablePickerSynced, FieldPickerSynced, useBase, useWatchable} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';
import {globalConfig} from '@airtable/blocks';
import React, {Fragment} from 'react';

function Block() {
    const base = useBase();
    const tableId = globalConfig.get('tableId');
    const table = base.getTableByIdIfExists(tableId);
    const fieldId = globalConfig.get('fieldId');
    const field = table.getFieldByIdIfExists(fieldId);
    useWatchable(globalConfig, ['tableId', 'fieldId']);

    const summaryText = field
        ? `The field type for ${field.name} is ${field.type}.`
        : 'No field selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePickerSynced globalConfigKey="tableId" shouldAllowPickingNone={true} />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey="fieldId"
                        allowedTypes={[
                            fieldTypes.SINGLE_LINE_TEXT,
                            fieldTypes.MULTILINE_TEXT,
                            fieldTypes.EMAIL,
                            fieldTypes.URL,
                            fieldTypes.PHONE_NUMBER,
                        ]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                                 |
| ------- | ------------------------------------------------------------------------------------ |
| `props` | [FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                                         |

**Returns:** _Element_
