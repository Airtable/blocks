/** @module @airtable/blocks/ui: Dialog */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {baymax} from './baymax_utils';
import Dialog, {DialogStyleProps, dialogStylePropTypes} from './dialog';
import Button from './button';
import Box from './box';

/**
 * Props for the {@link ConfirmationDialog} component. Also accepts:
 * * {@link DialogStyleProps}
 *
 * @noInheritDoc
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
    /** The body of the dialog. */
    body?: React.ReactNode;
    /** Extra `className`s to apply to the background element, separated by spaces. */
    backgroundClassName?: string;
    /** Extra styles to apply to the background element. */
    backgroundStyle?: React.CSSProperties;
    /** Cancel button event handler. Handles click events and Space/Enter keypress events. */
    onCancel: () => unknown;
    /** Confirm button event handler. Handles click events and Space/Enter keypress events. */
    onConfirm: () => unknown;
}

/**
 * A styled modal dialog component that prompts the user to confirm or cancel an action.
 * By default, this component will focus the "Confirm" button on mount, so that pressing
 * the Enter key will confirm the action.
 *
 * @example
 * ```js
 * import {Button, Dialog, ConfirmationDialog} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     const [isDialogOpen, setIsDialogOpen] = useState(false);
 *     return (
 *         <Fragment>
 *             <Button
 *                 variant="primary"
 *                 onClick={() => setIsDialogOpen(true)}
 *             >
 *                 Open dialog
 *             </Button>
 *             {isDialogOpen && (
 *                 <ConfirmationDialog
 *                     title="Are you sure?"
 *                     body="This action can't be undone."
 *                     onConfirm={() => {
 *                         alert('Confirmed.');
 *                         setIsDialogOpen(false);
 *                     }}
 *                     onCancel={() => setIsDialogOpen(false)}
 *                 />
 *             )}
 *         </Fragment>
 *     );
 * }
 * ```
 */
class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {
    /** @hidden */
    static propTypes = {
        title: PropTypes.string.isRequired,
        body: PropTypes.node,
        cancelButtonText: PropTypes.string,
        confirmButtonText: PropTypes.string,
        isConfirmActionDangerous: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
        onCancel: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
        ...dialogStylePropTypes,
    };
    /** @hidden */
    static defaultProps = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        isConfirmActionDangerous: false,
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
                <h1 className={baymax('mt0 mb1 strong')} style={{fontSize: 20}}>
                    {title}
                </h1>
                {body}
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
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        alignSelf="end"
                        marginRight={2}
                        className={baymax('quiet link-unquiet-focusable text-blue-focus')}
                    >
                        {cancelButtonText}
                    </Button>
                </Box>
            </Dialog>
        );
    }
}

export default ConfirmationDialog;
