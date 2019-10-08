[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Dialog](_airtable_blocks_ui__dialog.md)

# External module: @airtable/blocks/ui: Dialog

## Index

### Classes

-   [ConfirmationDialog](_airtable_blocks_ui__dialog.md#confirmationdialog)
-   [Dialog](_airtable_blocks_ui__dialog.md#dialog)
-   [DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton)

### Type aliases

-   [ConfirmationDialogProps](_airtable_blocks_ui__dialog.md#confirmationdialogprops)
-   [DialogCloseButtonProps](_airtable_blocks_ui__dialog.md#dialogclosebuttonprops)
-   [DialogProps](_airtable_blocks_ui__dialog.md#dialogprops)

## Classes

### ConfirmationDialog

• **ConfirmationDialog**:

_Defined in
[src/ui/confirmation_dialog.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L75)_

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
            <Button theme={Button.themes.BLUE} onClick={() => setIsDialogOpen(true)}>
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
            <Button theme={Button.themes.BLUE} onClick={() => setIsDialogOpen(true)}>
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
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object &
RefAttributes‹[DialogCloseButton](_airtable_blocks_ui__dialog.md#dialogclosebutton)››_ =
DialogCloseButton

_Defined in
[src/ui/dialog.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog.tsx#L69)_

---

### DialogCloseButton

• **DialogCloseButton**:

_Defined in
[src/ui/dialog_close_button.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L81)_

A button that closes [Dialog](_airtable_blocks_ui__dialog.md#dialog).

**`alias`** Dialog.CloseButton

## Type aliases

### ConfirmationDialogProps

Ƭ **ConfirmationDialogProps**: _object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object_

_Defined in
[src/ui/confirmation_dialog.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/confirmation_dialog.tsx#L25)_

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

---

### DialogCloseButtonProps

Ƭ **DialogCloseButtonProps**: _object & TooltipAnchorProps_

_Defined in
[src/ui/dialog_close_button.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/dialog_close_button.tsx#L40)_

**`typedef`** {object} DialogCloseButtonProps

**`property`** {string} [className] `className`s to apply to the close button, separated by spaces.

**`property`** {object} [style] Styles to apply to the dialog element.

**`property`** {number} [tabIndex] Indicates if the button can be focused and if/where it
participates in sequential keyboard navigation.

---

### DialogProps

Ƭ **DialogProps**: _object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object_

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
