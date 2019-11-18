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
-   [DialogStyleProps](_airtable_blocks_ui__dialog.md#dialogstyleprops)

## Classes

### ConfirmationDialog

• **ConfirmationDialog**:

_Defined in
[src/ui/confirmation_dialog.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L76)_

A styled modal dialog component that prompts the user to confirm or cancel an action. By default,
this component will focus the "Confirm" button on mount, so that pressing the Enter key will confirm
the action.

**Example:**

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
[src/ui/dialog.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L106)_

A styled modal dialog component.

**Example:**

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

---

### DialogCloseButton

• **DialogCloseButton**:

_Defined in
[src/ui/dialog_close_button.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L97)_

A button that closes [Dialog](_airtable_blocks_ui__dialog.md#dialog). Accessed via
`Dialog.CloseButton`.

## Interfaces

### ConfirmationDialogProps

• **ConfirmationDialogProps**:

_Defined in
[src/ui/confirmation_dialog.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L15)_

Props for the [ConfirmationDialog](_airtable_blocks_ui__dialog.md#confirmationdialog) component.
Also accepts:

-   [DialogStyleProps](_airtable_blocks_ui__dialog.md#dialogstyleprops)

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L31)_

Extra `className`s to apply to the background element, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _React.CSSProperties_

_Defined in
[src/ui/confirmation_dialog.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L33)_

Extra styles to apply to the background element.

### `Optional` body

• **body**? : _React.ReactNode_

_Defined in
[src/ui/confirmation_dialog.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L29)_

The body of the dialog.

### `Optional` cancelButtonText

• **cancelButtonText**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L21)_

The label for the cancel button. Defaults to 'Cancel'.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L27)_

Extra `className`s to apply to the dialog element, separated by spaces.

### `Optional` confirmButtonText

• **confirmButtonText**? : _undefined | string_

_Defined in
[src/ui/confirmation_dialog.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L23)_

The label for the confirm button. Defaults to 'Confirm'.

### isConfirmActionDangerous

• **isConfirmActionDangerous**: _boolean_

_Defined in
[src/ui/confirmation_dialog.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L25)_

Whether the action is dangerous (potentially destructive or not easily reversible). Defaults to
`false`.

### onCancel

• **onCancel**: _function_

_Defined in
[src/ui/confirmation_dialog.tsx:35](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L35)_

Cancel button event handler. Handles click events and Space/Enter keypress events.

#### Type declaration:

▸ (): _unknown_

### onConfirm

• **onConfirm**: _function_

_Defined in
[src/ui/confirmation_dialog.tsx:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L37)_

Confirm button event handler. Handles click events and Space/Enter keypress events.

#### Type declaration:

▸ (): _unknown_

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/confirmation_dialog.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L17)_

Extra styles to apply to the dialog element.

### title

• **title**: _string_

_Defined in
[src/ui/confirmation_dialog.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/confirmation_dialog.tsx#L19)_

The title of the dialog.

---

### DialogCloseButtonProps

• **DialogCloseButtonProps**:

_Defined in
[src/ui/dialog_close_button.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L40)_

Props for the [DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton) component. Also
accepts:

-   [DialogCloseButtonStyleProps](_airtable_blocks_ui__dialog.md#dialogclosebuttonstyleprops)

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/dialog_close_button.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L48)_

The contents of the close button.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/dialog_close_button.tsx:42](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L42)_

`className`s to apply to the close button, separated by spaces.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/dialog_close_button.tsx:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L44)_

Styles to apply to the close button.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/dialog_close_button.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L46)_

Indicates if the button can be focused and if/where it participates in sequential keyboard
navigation.

---

### DialogCloseButtonStyleProps

• **DialogCloseButtonStyleProps**:

_Defined in
[src/ui/dialog_close_button.tsx:63](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog_close_button.tsx#L63)_

Style props for the [DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton) component.
Accepts:

-   [BorderRadiusProps](_airtable_blocks_ui_system__appearance.md#borderradiusprops)
-   [DimensionsSetProps](_airtable_blocks_ui_system__dimensions.md#dimensionssetprops)
-   [DisplayProps](_airtable_blocks_ui_system__display.md#displayprops)
-   [FlexContainerSetProps](_airtable_blocks_ui_system__flex_container.md#flexcontainersetprops)
-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)

---

### DialogProps

• **DialogProps**:

_Defined in
[src/ui/dialog.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L50)_

Props for the [Dialog](_airtable_blocks_ui__dialog.md#dialog) component. Also accepts:

-   [DialogStyleProps](_airtable_blocks_ui__dialog.md#dialogstyleprops)

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/dialog.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L58)_

Extra `className`s to apply to the background element, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _React.CSSProperties_

_Defined in
[src/ui/dialog.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L60)_

Extra styles to apply to the background element.

### children

• **children**: _React.ReactNode_

_Defined in
[src/ui/dialog.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L62)_

The contents of the dialog element.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/dialog.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L54)_

Extra `className`s to apply to the dialog element, separated by spaces.

### onClose

• **onClose**: _function_

_Defined in
[src/ui/dialog.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L52)_

Callback function to fire when the dialog is closed.

#### Type declaration:

▸ (): _unknown_

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/dialog.tsx:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L56)_

Extra styles to apply to the dialog element.

---

### DialogStyleProps

• **DialogStyleProps**:

_Defined in
[src/ui/dialog.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L28)_

Style props shared between the [Dialog](_airtable_blocks_ui__dialog.md#dialog) and
[ConfirmationDialog](_airtable_blocks_ui__dialog.md#confirmationdialog) components. Also accepts:

-   [DimensionsSetProps](_airtable_blocks_ui_system__dimensions.md#dimensionssetprops)
-   [FlexContainerSetProps](_airtable_blocks_ui_system__flex_container.md#flexcontainersetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"block"
| "flex"›_

_Defined in
[src/ui/dialog.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/dialog.tsx#L33)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.
