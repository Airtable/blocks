[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ViewPicker](_airtable_blocks_ui__viewpicker.md)

# External module: @airtable/blocks/ui: ViewPicker

## Index

### Interfaces

-   [SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops)
-   [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops)
-   [ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops)

### Functions

-   [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker)
-   [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced)

## Interfaces

### SharedViewPickerProps

• **SharedViewPickerProps**:

_Defined in
[src/ui/view_picker.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L16)_

Props shared between the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) and
[ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced) components.

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)›_

_Defined in
[src/ui/view_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L20)_

An array indicating which view types can be selected.

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
[src/ui/view_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L26)_

A function to be called when the selected view changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/view_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L24)_

The placeholder text when no view is selected. Defaults to `'Pick a view...'`

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/view_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L22)_

If set to `true`, the user can unset the selected view.

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
[src/ui/view_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L18)_

The parent table model to select views from. If `null` or `undefined`, the picker won't render.

---

### ViewPickerProps

• **ViewPickerProps**:

_Defined in
[src/ui/view_picker.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L43)_

Props for the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) component. Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)›_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[allowedTypes](_airtable_blocks_ui__viewpicker.md#optional-allowedtypes)_

_Defined in
[src/ui/view_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L20)_

An array indicating which view types can be selected.

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

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[onChange](_airtable_blocks_ui__viewpicker.md#optional-onchange)_

_Defined in
[src/ui/view_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L26)_

A function to be called when the selected view changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[placeholder](_airtable_blocks_ui__viewpicker.md#optional-placeholder)_

_Defined in
[src/ui/view_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L24)_

The placeholder text when no view is selected. Defaults to `'Pick a view...'`

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__viewpicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/view_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L22)_

If set to `true`, the user can unset the selected view.

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
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[table](_airtable_blocks_ui__viewpicker.md#optional-table)_

_Defined in
[src/ui/view_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L18)_

The parent table model to select views from. If `null` or `undefined`, the picker won't render.

### `Optional` view

• **view**? : _[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/ui/view_picker.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L45)_

The selected view model.

---

### ViewPickerSyncedProps

• **ViewPickerSyncedProps**:

_Defined in
[src/ui/view_picker_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker_synced.tsx#L15)_

Props for the [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced) component.
Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)›_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[allowedTypes](_airtable_blocks_ui__viewpicker.md#optional-allowedtypes)_

_Defined in
[src/ui/view_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L20)_

An array indicating which view types can be selected.

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
[src/ui/view_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker_synced.tsx#L17)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected view will always reflect the view id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new view
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
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[onChange](_airtable_blocks_ui__viewpicker.md#optional-onchange)_

_Defined in
[src/ui/view_picker.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L26)_

A function to be called when the selected view changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[placeholder](_airtable_blocks_ui__viewpicker.md#optional-placeholder)_

_Defined in
[src/ui/view_picker.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L24)_

The placeholder text when no view is selected. Defaults to `'Pick a view...'`

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__viewpicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/view_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L22)_

If set to `true`, the user can unset the selected view.

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
[SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops).[table](_airtable_blocks_ui__viewpicker.md#optional-table)_

_Defined in
[src/ui/view_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L18)_

The parent table model to select views from. If `null` or `undefined`, the picker won't render.

## Functions

### ViewPicker

▸ **ViewPicker**(`props`: [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _null | Element‹›_

_Defined in
[src/ui/view_picker.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker.tsx#L96)_

Dropdown menu component for selecting views.

**Example:**

```js
import {TablePicker, ViewPicker, useBase, useRecords} from '@airtable/blocks/ui';
import {viewTypes} from '@airtable/blocks/models';
import React, {Fragment, useState} from 'react';

function Block() {
    useBase();
    const [table, setTable] = useState(null);
    const [view, setView] = useState(null);
    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);

    const summaryText = view
        ? `${view.name} has ${records.length} record(s).`
        : 'No view selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePicker
                    table={table}
                    onChange={newTable => {
                        setTable(newTable);
                        setView(null);
                    }}
                    shouldAllowPickingNone={true}
                />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
                    <ViewPicker
                        table={table}
                        view={view}
                        onChange={newView => setView(newView)}
                        allowedTypes={[viewTypes.GRID]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                  |
| ------- | --------------------------------------------------------------------- |
| `props` | [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                          |

**Returns:** _null | Element‹›_

---

### ViewPickerSynced

▸ **ViewPickerSynced**(`props`:
[ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element‹›_

_Defined in
[src/ui/view_picker_synced.tsx:67](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/view_picker_synced.tsx#L67)_

A wrapper around the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) component that
syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {
    TablePickerSynced,
    ViewPickerSynced,
    useBase,
    useRecords,
    useWatchable,
} from '@airtable/blocks/ui';
import {viewTypes} from '@airtable/blocks/models';
import {globalConfig} from '@airtable/blocks';
import React, {Fragment} from 'react';

function Block() {
    const base = useBase();
    const tableId = globalConfig.get('tableId');
    const table = base.getTableByIdIfExists(tableId);
    const viewId = globalConfig.get('viewId');
    const view = table.getViewByIdIfExists(viewId);
    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);
    useWatchable(globalConfig, ['tableId', 'viewId']);

    const summaryText = view
        ? `${view.name} has ${records.length} record(s).`
        : 'No view selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePickerSynced globalConfigKey="tableId" shouldAllowPickingNone={true} />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
                    <ViewPickerSynced
                        table={table}
                        globalConfigKey="viewId"
                        allowedTypes={[viewTypes.GRID]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| `props` | [ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                                      |

**Returns:** _Element‹›_
