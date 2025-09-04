/** @module @airtable/blocks/ui: Dialog */ /** */
import * as React from 'react';
import Dialog, {DialogStyleProps} from './dialog';
import Heading from './heading';
import Text from './text';
import Button from './button';
import Box from './box';

/**
 * Props for the {@link ConfirmationDialog} component. Also accepts:
 * * {@link DialogStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/ConfirmationDialog
 */
interface ConfirmationDialogProps extends DialogStyleProps {
    /** Extra styles to apply to the dialog element. */
    style?: React.CSSProperties;
    /** The title of the dialog. */
    title: string;
    /** The label for the cancel button. Defaults to 'Cancel'. */
    cancelButtonText?: string;
    /** The label for the confirm button. Defaults to 'Confirm'. */
    confirmButtonText?: string;
    /** Whether the action is dangerous (potentially destructive or not easily reversible). Defaults to `false`. */
    isConfirmActionDangerous: boolean;
    /** Extra `className`s to apply to the dialog element, separated by spaces. */
    className?: string;
    /** The body of the dialog. When it’s a string it will automatically be wrapped in a Text component. */
    body?: React.ReactNode | string;
    /** Extra `className`s to apply to the background element, separated by spaces. */
    backgroundClassName?: string;
    /** Extra styles to apply to the background element. */
    backgroundStyle?: React.CSSProperties;
    /** Cancel button event handler. Handles click events and Space/Enter keypress events. */
    onCancel: () => unknown;
    /** Confirm button event handler. Handles click events and Space/Enter keypress events. */
    onConfirm: () => unknown;
    /** Whether the cancel button can be interacted with. Defaults to `false`. */
    isCancelButtonDisabled?: boolean;
    /** Whether the confirm button can be interacted with. Defaults to `false`. */
    isConfirmButtonDisabled?: boolean;
}

/**
 * A styled modal dialog component that prompts the user to confirm or cancel an action.
 *
 * [[ Story id="confirmationdialog--example" title="Confirmation dialog example" ]]
 *
 * By default, this component will focus the "Confirm" button on mount, so that pressing
 * the Enter key will confirm the action.
 *
 * @component
 * @docsPath UI/components/ConfirmationDialog
 */
class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {
    /** @hidden */
    static defaultProps = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        isConfirmActionDangerous: false,
        isCancelButtonDisabled: false,
        isConfirmButtonDisabled: false,
        width: '400px',
    };
    /** @internal */
    _confirmButtonRef = React.createRef<HTMLButtonElement>();
    /** @hidden */
    componentDidMount() {
        if (this._confirmButtonRef.current !== null) {
            this._confirmButtonRef.current.focus();
        }
    }
    /** @hidden */
    render() {
        const {
            title,
            body,
            cancelButtonText,
            confirmButtonText,
            isConfirmActionDangerous,
            className,
            style,
            backgroundClassName,
            backgroundStyle,
            onCancel,
            onConfirm,
            isCancelButtonDisabled,
            isConfirmButtonDisabled,
            ...restOfProps
        } = this.props;

        return (
            <Dialog
                onClose={onCancel}
                className={className}
                style={style}
                backgroundClassName={backgroundClassName}
                backgroundStyle={backgroundStyle}
                {...restOfProps}
            >
                <Dialog.CloseButton />
                <Heading size="small">{title}</Heading>
                {typeof body === 'string' ? <Text variant="paragraph">{body}</Text> : body}
                <Box
                    display="flex"
                    flexDirection="row-reverse"
                    alignItems="center"
                    justifyContent="start"
                    width="100%"
                    marginTop={3}
                >
                    <Button
                        ref={this._confirmButtonRef}
                        onClick={onConfirm}
                        variant={isConfirmActionDangerous ? 'danger' : 'primary'}
                        disabled={isConfirmButtonDisabled}
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        alignSelf="end"
                        marginRight={2}
                        disabled={isCancelButtonDisabled}
                    >
                        {cancelButtonText}
                    </Button>
                </Box>
            </Dialog>
        );
    }
}

export default ConfirmationDialog;
