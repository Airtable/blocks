[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Dialog](_airtable_blocks_ui__dialog.md)

# External module: @airtable/blocks/ui: Dialog

## Index

### Classes

-   [ConfirmationDialog](_airtable_blocks_ui__dialog.md#confirmationdialog)
-   [Dialog](_airtable_blocks_ui__dialog.md#dialog)
-   [DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton)

### Interfaces

-   [ConfirmationDialogProps](_airtable_blocks_ui__dialog.md#confirmationdialogprops)
-   [DialogCloseButtonProps](_airtable_blocks_ui__dialog.md#dialogclosebuttonprops)
-   [DialogProps](_airtable_blocks_ui__dialog.md#dialogprops)

## Classes

### ConfirmationDialog

• **ConfirmationDialog**:

_Defined in
[src/ui/confirmation_dialog.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L74)_

A styled modal dialog component that prompts the user to confirm or cancel an action. By default,
this component will focus the "Confirm" button on mount, so that pressing the Enter key will confirm
the action.

**`example`**

```js
import {Button, Dialog, ConfirmationDialog} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';

function Block() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Fragment>
            <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                Open dialog
            </Button>
            {isDialogOpen && (
                <ConfirmationDialog
                    title="Are you sure?"
                    body="This action can't be undone."
                    onConfirm={() => {
                        alert('Confirmed.');
                        setIsDialogOpen(false);
                    }}
                    onCancel={() => setIsDialogOpen(false)}
                />
            )}
        </Fragment>
    );
}
```

---

### Dialog

• **Dialog**:

_Defined in
[src/ui/dialog.tsx:67](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L67)_

A styled modal dialog component.

**`example`**

```js
import {Button, Dialog} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';

function Block() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Fragment>
            <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                Open dialog
            </Button>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)}>
                    <Fragment>
                        <Dialog.CloseButton />
                        <h1
                            style={{
                                marginBottom: 8,
                                fontSize: 20,
                                fontWeight: 500,
                            }}
                        >
                            Dialog
                        </h1>
                        <p>This is the dialog content.</p>
                    </Fragment>
                </Dialog>
            )}
        </Fragment>
    );
}
```

### `Static` CloseButton

▪ **CloseButton**:
_RefForwardingComponent‹[DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton),
object & StyleProps &
RefAttributes‹[DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton)››_ =
DialogCloseButton

_Defined in
[src/ui/dialog.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L69)_

---

### DialogCloseButton

• **DialogCloseButton**:

_Defined in
[src/ui/dialog_close_button.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L82)_

A button that closes [Dialog](_airtable_blocks_ui__dialog.md#dialog).

**`alias`** Dialog.CloseButton

## Interfaces

### ConfirmationDialogProps

• **ConfirmationDialogProps**:

_Defined in
[src/ui/confirmation_dialog.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L24)_

**`typedef`** {object} ConfirmationDialogProps

**`property`** {string} title The title of the dialog.

**`property`** {React.ReactNode} [body] The body of the dialog.

**`property`** {string} [cancelButtonText='Cancel'] The label for the cancel button.

**`property`** {string} [confirmButtonText='Confirm'] The label for the confirm button.

**`property`** {boolean} [isConfirmActionDangerous=false] Whether the action is dangerous
(potentially destructive or not easily reversible).

**`property`** {string} [className] Extra `className`s to apply to the dialog element, separated by
spaces.

**`property`** {object} [style] Extra styles to apply to the dialog element.

**`property`** {string} [backgroundClassName] Extra `className`s to apply to the background element,
separated by spaces.

**`property`** {object} [backgroundStyle] Extra styles to apply to the background element.

**`property`** {Function} onCancel Cancel button event handler. Handles click events and Space/Enter
keypress events.

**`property`** {Function} onConfirm Confirm button event handler. Handles click events and
Space/Enter keypress events.

### `Optional` alignContent

• **alignContent**? : _Prop‹AlignContentProperty›_

_Inherited from
[AlignContentProps](_airtable_blocks_ui_system__flex_container.md#aligncontentprops).[alignContent](_airtable_blocks_ui_system__flex_container.md#optional-aligncontent)_

_Defined in
[src/ui/system/flex_container/align_content.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/align_content.ts#L10)_

Sets the alignment of a flex container's lines when there is extra space in the cross-axis. This
property has no effect on a single-line flex container.

### `Optional` alignItems

• **alignItems**? : _Prop‹AlignItemsProperty›_

_Inherited from
[AlignItemsProps](_airtable_blocks_ui_system__flex_container.md#alignitemsprops).[alignItems](_airtable_blocks_ui_system__flex_container.md#optional-alignitems)_

_Defined in
[src/ui/system/flex_container/align_items.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/align_items.ts#L10)_

Sets the alignment of flex items on the cross-axis of a flex container.

### `Optional` flexDirection

• **flexDirection**? : _Prop‹FlexDirectionProperty›_

_Inherited from
[FlexDirectionProps](_airtable_blocks_ui_system__flex_container.md#flexdirectionprops).[flexDirection](_airtable_blocks_ui_system__flex_container.md#optional-flexdirection)_

_Defined in
[src/ui/system/flex_container/flex_direction.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/flex_direction.ts#L10)_

Sets how flex items are placed in the flex container defining the main axis and the direction
(normal or reversed).

### `Optional` flexWrap

• **flexWrap**? : _Prop‹FlexWrapProperty›_

_Inherited from
[FlexWrapProps](_airtable_blocks_ui_system__flex_container.md#flexwrapprops).[flexWrap](_airtable_blocks_ui_system__flex_container.md#optional-flexwrap)_

_Defined in
[src/ui/system/flex_container/flex_wrap.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/flex_wrap.ts#L10)_

Sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is
allowed, it sets the direction that lines are stacked.

### `Optional` height

• **height**? : _Prop‹HeightProperty‹Length››_

_Inherited from
[HeightProps](_airtable_blocks_ui_system__dimensions.md#heightprops).[height](_airtable_blocks_ui_system__dimensions.md#optional-height)_

_Defined in
[src/ui/system/dimensions/height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/height.ts#L10)_

Specifies the height of an element.

### `Optional` justifyContent

• **justifyContent**? : _Prop‹JustifyContentProperty›_

_Inherited from
[JustifyContentProps](_airtable_blocks_ui_system__flex_container.md#justifycontentprops).[justifyContent](_airtable_blocks_ui_system__flex_container.md#optional-justifycontent)_

_Defined in
[src/ui/system/flex_container/justify_content.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/justify_content.ts#L10)_

Sets the alignment of flex items on the main axis of a flex container.

### `Optional` margin

• **margin**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[margin](_airtable_blocks_ui_system__spacing.md#optional-margin)_

_Defined in
[src/ui/system/spacing/margin.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L17)_

Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`,
`marginRight`, `marginBottom`, and `marginLeft`.

### `Optional` marginBottom

• **marginBottom**? : _Prop‹MarginBottomProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginBottom](_airtable_blocks_ui_system__spacing.md#optional-marginbottom)_

_Defined in
[src/ui/system/spacing/margin.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L23)_

Sets the margin area on the bottom of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginLeft

• **marginLeft**? : _Prop‹MarginLeftProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginLeft](_airtable_blocks_ui_system__spacing.md#optional-marginleft)_

_Defined in
[src/ui/system/spacing/margin.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L25)_

Sets the margin area on the left of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginRight

• **marginRight**? : _Prop‹MarginRightProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginRight](_airtable_blocks_ui_system__spacing.md#optional-marginright)_

_Defined in
[src/ui/system/spacing/margin.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L21)_

Sets the margin area on the right of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginTop

• **marginTop**? : _Prop‹MarginTopProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginTop](_airtable_blocks_ui_system__spacing.md#optional-margintop)_

_Defined in
[src/ui/system/spacing/margin.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L19)_

Sets the margin area on the top of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginX

• **marginX**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginX](_airtable_blocks_ui_system__spacing.md#optional-marginx)_

_Defined in
[src/ui/system/spacing/margin.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L27)_

Sets the margin area on the top and bottom of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` marginY

• **marginY**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginY](_airtable_blocks_ui_system__spacing.md#optional-marginy)_

_Defined in
[src/ui/system/spacing/margin.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L29)_

Sets the margin area on the left and right of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` maxHeight

• **maxHeight**? : _Prop‹MaxHeightProperty‹Length››_

_Inherited from
[MaxHeightProps](_airtable_blocks_ui_system__dimensions.md#maxheightprops).[maxHeight](_airtable_blocks_ui_system__dimensions.md#optional-maxheight)_

_Defined in
[src/ui/system/dimensions/max_height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_height.ts#L10)_

Sets the maximum height of an element. It prevents the used value of the `height` property from
becoming larger than the value specified for `maxHeight`.

### `Optional` maxWidth

• **maxWidth**? : _Prop‹MaxWidthProperty‹Length››_

_Inherited from
[MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops).[maxWidth](_airtable_blocks_ui_system__dimensions.md#optional-maxwidth)_

_Defined in
[src/ui/system/dimensions/max_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_width.ts#L10)_

Sets the maximum width of an element. It prevents the used value of the `width` property from
becoming larger than the value specified by `maxWidth`.

### `Optional` minHeight

• **minHeight**? : _Prop‹MinHeightProperty‹Length››_

_Inherited from
[MinHeightProps](_airtable_blocks_ui_system__dimensions.md#minheightprops).[minHeight](_airtable_blocks_ui_system__dimensions.md#optional-minheight)_

_Defined in
[src/ui/system/dimensions/min_height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_height.ts#L10)_

Sets the minimum height of an element. It prevents the used value of the `height` property from
becoming smaller than the value specified for `minHeight`.

### `Optional` minWidth

• **minWidth**? : _Prop‹MinWidthProperty‹Length››_

_Inherited from
[MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops).[minWidth](_airtable_blocks_ui_system__dimensions.md#optional-minwidth)_

_Defined in
[src/ui/system/dimensions/min_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_width.ts#L10)_

Sets the minimum width of an element. It prevents the used value of the `width` property from
becoming smaller than the value specified for `minWidth`.

### `Optional` padding

• **padding**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[padding](_airtable_blocks_ui_system__spacing.md#optional-padding)_

_Defined in
[src/ui/system/spacing/padding.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L17)_

Sets the padding area on all four sides of an element. It is a shorthand for `paddingTop`,
`paddingRight`, `paddingBottom`, and `paddingLeft`.

### `Optional` paddingBottom

• **paddingBottom**? : _Prop‹PaddingBottomProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingBottom](_airtable_blocks_ui_system__spacing.md#optional-paddingbottom)_

_Defined in
[src/ui/system/spacing/padding.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L23)_

Sets the height of the padding area on the bottom side of an element.

### `Optional` paddingLeft

• **paddingLeft**? : _Prop‹PaddingLeftProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingLeft](_airtable_blocks_ui_system__spacing.md#optional-paddingleft)_

_Defined in
[src/ui/system/spacing/padding.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L25)_

Sets the width of the padding area on the left side of an element.

### `Optional` paddingRight

• **paddingRight**? : _Prop‹PaddingRightProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingRight](_airtable_blocks_ui_system__spacing.md#optional-paddingright)_

_Defined in
[src/ui/system/spacing/padding.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L21)_

Sets the width of the padding area on the right side of an element.

### `Optional` paddingTop

• **paddingTop**? : _Prop‹PaddingTopProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingTop](_airtable_blocks_ui_system__spacing.md#optional-paddingtop)_

_Defined in
[src/ui/system/spacing/padding.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L19)_

Sets the height of the padding area on the top side of an element.

### `Optional` paddingX

• **paddingX**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingX](_airtable_blocks_ui_system__spacing.md#optional-paddingx)_

_Defined in
[src/ui/system/spacing/padding.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L27)_

Sets the width of the padding area on the left and right sides of an element.

### `Optional` paddingY

• **paddingY**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingY](_airtable_blocks_ui_system__spacing.md#optional-paddingy)_

_Defined in
[src/ui/system/spacing/padding.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L29)_

Sets the height of the padding area on the top and bottom sides of an element.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.

---

### DialogCloseButtonProps

• **DialogCloseButtonProps**:

_Defined in
[src/ui/dialog_close_button.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L40)_

**`typedef`** {object} DialogCloseButtonProps

**`property`** {string} [className] `className`s to apply to the close button, separated by spaces.

**`property`** {object} [style] Styles to apply to the dialog element.

**`property`** {number} [tabIndex] Indicates if the button can be focused and if/where it
participates in sequential keyboard navigation.

---

### DialogProps

• **DialogProps**:

_Defined in
[src/ui/dialog.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L17)_

**`typedef`** {object} DialogProps

**`property`** {Function} onClose Callback function to fire when the dialog is closed.

**`property`** {string} [className] Extra `className`s to apply to the dialog element, separated by
spaces.

**`property`** {object} [style] Extra styles to apply to the dialog element.

**`property`** {string} [backgroundClassName] Extra `className`s to apply to the background element,
separated by spaces.

**`property`** {object} [backgroundStyle] Extra styles to apply to the background element.

### `Optional` alignContent

• **alignContent**? : _Prop‹AlignContentProperty›_

_Inherited from
[AlignContentProps](_airtable_blocks_ui_system__flex_container.md#aligncontentprops).[alignContent](_airtable_blocks_ui_system__flex_container.md#optional-aligncontent)_

_Defined in
[src/ui/system/flex_container/align_content.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/align_content.ts#L10)_

Sets the alignment of a flex container's lines when there is extra space in the cross-axis. This
property has no effect on a single-line flex container.

### `Optional` alignItems

• **alignItems**? : _Prop‹AlignItemsProperty›_

_Inherited from
[AlignItemsProps](_airtable_blocks_ui_system__flex_container.md#alignitemsprops).[alignItems](_airtable_blocks_ui_system__flex_container.md#optional-alignitems)_

_Defined in
[src/ui/system/flex_container/align_items.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/align_items.ts#L10)_

Sets the alignment of flex items on the cross-axis of a flex container.

### `Optional` flexDirection

• **flexDirection**? : _Prop‹FlexDirectionProperty›_

_Inherited from
[FlexDirectionProps](_airtable_blocks_ui_system__flex_container.md#flexdirectionprops).[flexDirection](_airtable_blocks_ui_system__flex_container.md#optional-flexdirection)_

_Defined in
[src/ui/system/flex_container/flex_direction.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/flex_direction.ts#L10)_

Sets how flex items are placed in the flex container defining the main axis and the direction
(normal or reversed).

### `Optional` flexWrap

• **flexWrap**? : _Prop‹FlexWrapProperty›_

_Inherited from
[FlexWrapProps](_airtable_blocks_ui_system__flex_container.md#flexwrapprops).[flexWrap](_airtable_blocks_ui_system__flex_container.md#optional-flexwrap)_

_Defined in
[src/ui/system/flex_container/flex_wrap.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/flex_wrap.ts#L10)_

Sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is
allowed, it sets the direction that lines are stacked.

### `Optional` height

• **height**? : _Prop‹HeightProperty‹Length››_

_Inherited from
[HeightProps](_airtable_blocks_ui_system__dimensions.md#heightprops).[height](_airtable_blocks_ui_system__dimensions.md#optional-height)_

_Defined in
[src/ui/system/dimensions/height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/height.ts#L10)_

Specifies the height of an element.

### `Optional` justifyContent

• **justifyContent**? : _Prop‹JustifyContentProperty›_

_Inherited from
[JustifyContentProps](_airtable_blocks_ui_system__flex_container.md#justifycontentprops).[justifyContent](_airtable_blocks_ui_system__flex_container.md#optional-justifycontent)_

_Defined in
[src/ui/system/flex_container/justify_content.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/justify_content.ts#L10)_

Sets the alignment of flex items on the main axis of a flex container.

### `Optional` margin

• **margin**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[margin](_airtable_blocks_ui_system__spacing.md#optional-margin)_

_Defined in
[src/ui/system/spacing/margin.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L17)_

Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`,
`marginRight`, `marginBottom`, and `marginLeft`.

### `Optional` marginBottom

• **marginBottom**? : _Prop‹MarginBottomProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginBottom](_airtable_blocks_ui_system__spacing.md#optional-marginbottom)_

_Defined in
[src/ui/system/spacing/margin.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L23)_

Sets the margin area on the bottom of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginLeft

• **marginLeft**? : _Prop‹MarginLeftProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginLeft](_airtable_blocks_ui_system__spacing.md#optional-marginleft)_

_Defined in
[src/ui/system/spacing/margin.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L25)_

Sets the margin area on the left of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginRight

• **marginRight**? : _Prop‹MarginRightProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginRight](_airtable_blocks_ui_system__spacing.md#optional-marginright)_

_Defined in
[src/ui/system/spacing/margin.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L21)_

Sets the margin area on the right of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginTop

• **marginTop**? : _Prop‹MarginTopProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginTop](_airtable_blocks_ui_system__spacing.md#optional-margintop)_

_Defined in
[src/ui/system/spacing/margin.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L19)_

Sets the margin area on the top of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginX

• **marginX**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginX](_airtable_blocks_ui_system__spacing.md#optional-marginx)_

_Defined in
[src/ui/system/spacing/margin.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L27)_

Sets the margin area on the top and bottom of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` marginY

• **marginY**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginY](_airtable_blocks_ui_system__spacing.md#optional-marginy)_

_Defined in
[src/ui/system/spacing/margin.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L29)_

Sets the margin area on the left and right of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` maxHeight

• **maxHeight**? : _Prop‹MaxHeightProperty‹Length››_

_Inherited from
[MaxHeightProps](_airtable_blocks_ui_system__dimensions.md#maxheightprops).[maxHeight](_airtable_blocks_ui_system__dimensions.md#optional-maxheight)_

_Defined in
[src/ui/system/dimensions/max_height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_height.ts#L10)_

Sets the maximum height of an element. It prevents the used value of the `height` property from
becoming larger than the value specified for `maxHeight`.

### `Optional` maxWidth

• **maxWidth**? : _Prop‹MaxWidthProperty‹Length››_

_Inherited from
[MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops).[maxWidth](_airtable_blocks_ui_system__dimensions.md#optional-maxwidth)_

_Defined in
[src/ui/system/dimensions/max_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_width.ts#L10)_

Sets the maximum width of an element. It prevents the used value of the `width` property from
becoming larger than the value specified by `maxWidth`.

### `Optional` minHeight

• **minHeight**? : _Prop‹MinHeightProperty‹Length››_

_Inherited from
[MinHeightProps](_airtable_blocks_ui_system__dimensions.md#minheightprops).[minHeight](_airtable_blocks_ui_system__dimensions.md#optional-minheight)_

_Defined in
[src/ui/system/dimensions/min_height.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_height.ts#L10)_

Sets the minimum height of an element. It prevents the used value of the `height` property from
becoming smaller than the value specified for `minHeight`.

### `Optional` minWidth

• **minWidth**? : _Prop‹MinWidthProperty‹Length››_

_Inherited from
[MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops).[minWidth](_airtable_blocks_ui_system__dimensions.md#optional-minwidth)_

_Defined in
[src/ui/system/dimensions/min_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_width.ts#L10)_

Sets the minimum width of an element. It prevents the used value of the `width` property from
becoming smaller than the value specified for `minWidth`.

### `Optional` padding

• **padding**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[padding](_airtable_blocks_ui_system__spacing.md#optional-padding)_

_Defined in
[src/ui/system/spacing/padding.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L17)_

Sets the padding area on all four sides of an element. It is a shorthand for `paddingTop`,
`paddingRight`, `paddingBottom`, and `paddingLeft`.

### `Optional` paddingBottom

• **paddingBottom**? : _Prop‹PaddingBottomProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingBottom](_airtable_blocks_ui_system__spacing.md#optional-paddingbottom)_

_Defined in
[src/ui/system/spacing/padding.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L23)_

Sets the height of the padding area on the bottom side of an element.

### `Optional` paddingLeft

• **paddingLeft**? : _Prop‹PaddingLeftProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingLeft](_airtable_blocks_ui_system__spacing.md#optional-paddingleft)_

_Defined in
[src/ui/system/spacing/padding.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L25)_

Sets the width of the padding area on the left side of an element.

### `Optional` paddingRight

• **paddingRight**? : _Prop‹PaddingRightProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingRight](_airtable_blocks_ui_system__spacing.md#optional-paddingright)_

_Defined in
[src/ui/system/spacing/padding.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L21)_

Sets the width of the padding area on the right side of an element.

### `Optional` paddingTop

• **paddingTop**? : _Prop‹PaddingTopProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingTop](_airtable_blocks_ui_system__spacing.md#optional-paddingtop)_

_Defined in
[src/ui/system/spacing/padding.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L19)_

Sets the height of the padding area on the top side of an element.

### `Optional` paddingX

• **paddingX**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingX](_airtable_blocks_ui_system__spacing.md#optional-paddingx)_

_Defined in
[src/ui/system/spacing/padding.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L27)_

Sets the width of the padding area on the left and right sides of an element.

### `Optional` paddingY

• **paddingY**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingY](_airtable_blocks_ui_system__spacing.md#optional-paddingy)_

_Defined in
[src/ui/system/spacing/padding.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L29)_

Sets the height of the padding area on the top and bottom sides of an element.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.
