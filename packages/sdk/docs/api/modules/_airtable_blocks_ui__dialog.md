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
-   [DialogCloseButtonStyleProps](_airtable_blocks_ui__dialog.md#dialogclosebuttonstyleprops)
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
[src/ui/dialog.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L68)_

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
object & [DialogCloseButtonStyleProps](_airtable_blocks_ui__dialog.md#dialogclosebuttonstyleprops) &
RefAttributes‹[DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton)››_ =
DialogCloseButton

_Defined in
[src/ui/dialog.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L70)_

---

### DialogCloseButton

• **DialogCloseButton**:

_Defined in
[src/ui/dialog_close_button.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L84)_

A button that closes [Dialog](_airtable_blocks_ui__dialog.md#dialog).

**`alias`** Dialog.CloseButton

## Interfaces

### ConfirmationDialogProps

• **ConfirmationDialogProps**:

_Defined in
[src/ui/confirmation_dialog.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L13)_

**`typedef`** {object} ConfirmationDialogProps

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

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L29)_

Extra `className`s to apply to the background element, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _React.CSSProperties_

_Defined in
[src/ui/confirmation_dialog.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L31)_

Extra styles to apply to the background element.

### `Optional` body

• **body**? : _React.ReactNode_

_Defined in
[src/ui/confirmation_dialog.tsx:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L27)_

The body of the dialog.

### `Optional` cancelButtonText

• **cancelButtonText**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L19)_

The label for the cancel button. Defaults to 'Cancel'.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L25)_

Extra `className`s to apply to the dialog element, separated by spaces.

### `Optional` confirmButtonText

• **confirmButtonText**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L21)_

The label for the confirm button. Defaults to 'Confirm'.

### `Optional` display

• **display**? : _Prop‹"block" | "flex"›_

_Inherited from
[ModalStyleProps](_airtable_blocks_ui__modal.md#modalstyleprops).[display](_airtable_blocks_ui__modal.md#optional-display)_

_Defined in
[src/ui/modal.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/modal.tsx#L50)_

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

### isConfirmActionDangerous

• **isConfirmActionDangerous**: _boolean_

_Defined in
[src/ui/confirmation_dialog.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L23)_

Whether the action is dangerous (potentially destructive or not easily reversible). Defaults to
`false`.

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

### onCancel

• **onCancel**: _Object_

_Defined in
[src/ui/confirmation_dialog.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L33)_

Cancel button event handler. Handles click events and Space/Enter keypress events.

### onConfirm

• **onConfirm**: _Object_

_Defined in
[src/ui/confirmation_dialog.tsx:35](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L35)_

Confirm button event handler. Handles click events and Space/Enter keypress events.

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

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/confirmation_dialog.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L15)_

Extra styles to apply to the dialog element.

### title

• **title**: _string_

_Defined in
[src/ui/confirmation_dialog.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L17)_

The title of the dialog.

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
[src/ui/dialog_close_button.tsx:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L37)_

**`typedef`** {object} DialogCloseButtonProps

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/dialog_close_button.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L45)_

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/dialog_close_button.tsx:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L39)_

`className`s to apply to the close button, separated by spaces.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/dialog_close_button.tsx:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L41)_

Styles to apply to the dialog element.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/dialog_close_button.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L43)_

Indicates if the button can be focused and if/where it participates in sequential keyboard
navigation.

---

### DialogCloseButtonStyleProps

• **DialogCloseButtonStyleProps**:

_Defined in
[src/ui/dialog_close_button.tsx:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L49)_

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

### `Optional` alignSelf

• **alignSelf**? : _Prop‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### `Optional` borderRadius

• **borderRadius**? : _Prop‹BorderRadiusProperty‹Length››_

_Inherited from
[BorderRadiusProps](_airtable_blocks_ui_system__appearance.md#borderradiusprops).[borderRadius](_airtable_blocks_ui_system__appearance.md#optional-borderradius)_

_Defined in
[src/ui/system/appearance/border_radius.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/appearance/border_radius.ts#L10)_

Rounds the corners of an element's outer border edge. You can set a single radius to make circular
corners, or two radii to make elliptical corners.

### `Optional` bottom

• **bottom**? : _Prop‹BottomProperty‹Length››_

_Inherited from
[BottomProps](_airtable_blocks_ui_system__position.md#bottomprops).[bottom](_airtable_blocks_ui_system__position.md#optional-bottom)_

_Defined in
[src/ui/system/position/bottom.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/bottom.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` display

• **display**? : _Prop‹DisplayProperty›_

_Inherited from
[DisplayProps](_airtable_blocks_ui_system__display.md#displayprops).[display](_airtable_blocks_ui_system__display.md#optional-display)_

_Defined in
[src/ui/system/display.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/display.ts#L10)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

### `Optional` flex

• **flex**? : _Prop‹FlexProperty‹Length››_

_Inherited from
[FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops).[flex](_airtable_blocks_ui_system__flex_item.md#optional-flex)_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

### `Optional` flexBasis

• **flexBasis**? : _Prop‹FlexBasisProperty‹Length››_

_Inherited from
[FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops).[flexBasis](_airtable_blocks_ui_system__flex_item.md#optional-flexbasis)_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

### `Optional` flexDirection

• **flexDirection**? : _Prop‹FlexDirectionProperty›_

_Inherited from
[FlexDirectionProps](_airtable_blocks_ui_system__flex_container.md#flexdirectionprops).[flexDirection](_airtable_blocks_ui_system__flex_container.md#optional-flexdirection)_

_Defined in
[src/ui/system/flex_container/flex_direction.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_container/flex_direction.ts#L10)_

Sets how flex items are placed in the flex container defining the main axis and the direction
(normal or reversed).

### `Optional` flexGrow

• **flexGrow**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops).[flexGrow](_airtable_blocks_ui_system__flex_item.md#optional-flexgrow)_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

### `Optional` flexShrink

• **flexShrink**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops).[flexShrink](_airtable_blocks_ui_system__flex_item.md#optional-flexshrink)_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

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

### `Optional` left

• **left**? : _Prop‹LeftProperty‹Length››_

_Inherited from
[LeftProps](_airtable_blocks_ui_system__position.md#leftprops).[left](_airtable_blocks_ui_system__position.md#optional-left)_

_Defined in
[src/ui/system/position/left.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/left.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

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

### `Optional` order

• **order**? : _Prop‹GlobalsNumber›_

_Inherited from
[OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops).[order](_airtable_blocks_ui_system__flex_item.md#optional-order)_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.

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

### `Optional` position

• **position**? : _Prop‹PositionProperty›_

_Inherited from
[PositionProps](_airtable_blocks_ui_system__position.md#positionprops).[position](_airtable_blocks_ui_system__position.md#optional-position)_

_Defined in
[src/ui/system/position/position.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/position.ts#L10)_

Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties
determine the final location of positioned elements.

### `Optional` right

• **right**? : _Prop‹RightProperty‹Length››_

_Inherited from
[RightProps](_airtable_blocks_ui_system__position.md#rightprops).[right](_airtable_blocks_ui_system__position.md#optional-right)_

_Defined in
[src/ui/system/position/right.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/right.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` top

• **top**? : _Prop‹TopProperty‹Length››_

_Inherited from
[TopProps](_airtable_blocks_ui_system__position.md#topprops).[top](_airtable_blocks_ui_system__position.md#optional-top)_

_Defined in
[src/ui/system/position/top.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/top.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.

### `Optional` zIndex

• **zIndex**? : _Prop‹ZIndexProperty›_

_Inherited from
[ZIndexProps](_airtable_blocks_ui_system__position.md#zindexprops).[zIndex](_airtable_blocks_ui_system__position.md#optional-zindex)_

_Defined in
[src/ui/system/position/z_index.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/z_index.ts#L10)_

Sets the z-order of a positioned element and its descendants or flex items. Overlapping elements
with larger z-indexes cover those with smaller ones.

---

### DialogProps

• **DialogProps**:

_Defined in
[src/ui/dialog.tsx:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L12)_

**`typedef`** {object} DialogProps

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

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/dialog.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L20)_

Extra `className`s to apply to the background element, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _React.CSSProperties_

_Defined in
[src/ui/dialog.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L22)_

Extra styles to apply to the background element.

### children

• **children**: _React.ReactNode_

_Defined in
[src/ui/dialog.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L24)_

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/dialog.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L16)_

Extra `className`s to apply to the dialog element, separated by spaces.

### `Optional` display

• **display**? : _Prop‹"block" | "flex"›_

_Inherited from
[ModalStyleProps](_airtable_blocks_ui__modal.md#modalstyleprops).[display](_airtable_blocks_ui__modal.md#optional-display)_

_Defined in
[src/ui/modal.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/modal.tsx#L50)_

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

### onClose

• **onClose**: _Object_

_Defined in
[src/ui/dialog.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L14)_

Callback function to fire when the dialog is closed.

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

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/dialog.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L18)_

Extra styles to apply to the dialog element.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.
