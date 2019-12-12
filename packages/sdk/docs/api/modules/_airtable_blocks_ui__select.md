[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Select](_airtable_blocks_ui__select.md)

# External module: @airtable/blocks/ui: Select

## Index

### Interfaces

-   [SelectOption](_airtable_blocks_ui__select.md#selectoption)
-   [SelectProps](_airtable_blocks_ui__select.md#selectprops)
-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)
-   [SelectSyncedProps](_airtable_blocks_ui__select.md#selectsyncedprops)
-   [SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops)
-   [SharedSelectProps](_airtable_blocks_ui__select.md#sharedselectprops)

### Type aliases

-   [SelectOptionValue](_airtable_blocks_ui__select.md#selectoptionvalue)

### Functions

-   [Select](_airtable_blocks_ui__select.md#select)
-   [SelectSynced](_airtable_blocks_ui__select.md#selectsynced)

## Interfaces

### SelectOption

• **SelectOption**:

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L26)_

A select option for [Select](_airtable_blocks_ui__select.md#select),
[TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker),
[ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker),
[FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker), and their `Synced` counterparts.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L32)_

If set to `true`, this option will not be selectable.

### label

• **label**: _React.ReactNode_

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L30)_

The label for the select option.

### value

• **value**: _[SelectOptionValue](_airtable_blocks_ui__select.md#selectoptionvalue)_

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L28)_

The value for the select option.

---

### SelectProps

• **SelectProps**:

_Defined in
[src/ui/select.tsx:177](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L177)_

Props for the [Select](_airtable_blocks_ui__select.md#select) component. Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

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
[SharedSelectProps](_airtable_blocks_ui__select.md#sharedselectprops).[onChange](_airtable_blocks_ui__select.md#optional-onchange)_

_Defined in
[src/ui/select.tsx:156](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L156)_

A function to be called when the selected option changes.

### options

• **options**: _Array‹[SelectOption](_airtable_blocks_ui__select.md#selectoption)›_

_Inherited from
[SharedSelectProps](_airtable_blocks_ui__select.md#sharedselectprops).[options](_airtable_blocks_ui__select.md#options)_

_Defined in
[src/ui/select.tsx:154](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L154)_

The list of select options.

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

### value

• **value**: _[SelectOptionValue](_airtable_blocks_ui__select.md#selectoptionvalue)_

_Defined in
[src/ui/select.tsx:179](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L179)_

The value of the selected option.

---

### SelectStyleProps

• **SelectStyleProps**:

_Defined in
[src/ui/select.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L76)_

Style props shared between the following components.

-   [Select](_airtable_blocks_ui__select.md#select),
    [SelectSynced](_airtable_blocks_ui__select.md#selectsynced)
-   [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker),
    [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced)
-   [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker),
    [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced)
-   [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker),
    [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced)

Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"inline-flex"
| "flex" | "none"›_

_Defined in
[src/ui/select.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L84)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

---

### SelectSyncedProps

• **SelectSyncedProps**:

_Defined in
[src/ui/select_synced.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_synced.tsx#L13)_

Props for the [SelectSynced](_airtable_blocks_ui__select.md#selectsynced) component. Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

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
[src/ui/select_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_synced.tsx#L15)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected option will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new option
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
[SharedSelectProps](_airtable_blocks_ui__select.md#sharedselectprops).[onChange](_airtable_blocks_ui__select.md#optional-onchange)_

_Defined in
[src/ui/select.tsx:156](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L156)_

A function to be called when the selected option changes.

### options

• **options**: _Array‹[SelectOption](_airtable_blocks_ui__select.md#selectoption)›_

_Inherited from
[SharedSelectProps](_airtable_blocks_ui__select.md#sharedselectprops).[options](_airtable_blocks_ui__select.md#options)_

_Defined in
[src/ui/select.tsx:154](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L154)_

The list of select options.

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

---

### SharedSelectBaseProps

• **SharedSelectBaseProps**:

_Defined in
[src/ui/select.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L96)_

Props shared between the following components:

-   [Select](_airtable_blocks_ui__select.md#select),
    [SelectSynced](_airtable_blocks_ui__select.md#selectsynced)
-   [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker),
    [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced)
-   [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker),
    [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced)
-   [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker),
    [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

---

### SharedSelectProps

• **SharedSelectProps**:

_Defined in
[src/ui/select.tsx:152](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L152)_

Props shared between the [Select](_airtable_blocks_ui__select.md#select) and
[SelectSynced](_airtable_blocks_ui__select.md#selectsynced) components.

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
[src/ui/select.tsx:156](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L156)_

A function to be called when the selected option changes.

### options

• **options**: _Array‹[SelectOption](_airtable_blocks_ui__select.md#selectoption)›_

_Defined in
[src/ui/select.tsx:154](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L154)_

The list of select options.

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

## Type aliases

### SelectOptionValue

Ƭ **SelectOptionValue**: _string | number | boolean | null | undefined_

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L10)_

Supported value types for [SelectOption](_airtable_blocks_ui__select.md#selectoption).

## Functions

### Select

▸ **Select**(`props`: [SelectProps](_airtable_blocks_ui__select.md#selectprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element‹›_

_Defined in
[src/ui/select.tsx:212](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L212)_

Dropdown menu component. A wrapper around `<select>` that fits in with Airtable's user interface.

**Example:**

```js
import {Select} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function ColorPicker() {
    const [value, setValue] = useState(null);
    return (
        <label>
            <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
            <Select
                onChange={newValue => setValue(newValue)}
                value={value}
                options={[
                    {value: null, label: 'Pick a color...', disabled: true},
                    {value: 'red', label: 'red'},
                    {value: 'green', label: 'green'},
                    {value: 'blue', label: 'blue'},
                ]}
            />
        </label>
    );
}
```

**Parameters:**

| Name    | Type                                                      |
| ------- | --------------------------------------------------------- |
| `props` | [SelectProps](_airtable_blocks_ui__select.md#selectprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                              |

**Returns:** _Element‹›_

---

### SelectSynced

▸ **SelectSynced**(`props`: [SelectSyncedProps](_airtable_blocks_ui__select.md#selectsyncedprops),
`ref`: React.Ref‹HTMLSelectElement›): _Element‹›_

_Defined in
[src/ui/select_synced.tsx:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select_synced.tsx#L44)_

A wrapper around the [Select](_airtable_blocks_ui__select.md#select) component that syncs with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {SelectSynced} from '@airtable/blocks/ui';
import React from 'react';

function ColorPickerSynced() {
    return (
        <label>
            <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
            <SelectSynced
                globalConfigKey="color"
                options={[
                    {value: null, label: 'Pick a color...', disabled: true},
                    {value: 'red', label: 'red'},
                    {value: 'green', label: 'green'},
                    {value: 'blue', label: 'blue'},
                ]}
            />
        </label>
    );
}
```

**Parameters:**

| Name    | Type                                                                  |
| ------- | --------------------------------------------------------------------- |
| `props` | [SelectSyncedProps](_airtable_blocks_ui__select.md#selectsyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                          |

**Returns:** _Element‹›_
