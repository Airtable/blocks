/** @module @airtable/blocks/ui: Dialog */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {baymax} from './baymax_utils';
import {stylePropTypes, StyleProps} from './modal';
import Dialog from './dialog';
import Button from './button';
import Box from './box';

/**
 * @typedef {object} ConfirmationDialogProps
 * @property {string} title The title of the dialog.
 * @property {React.ReactNode} [body] The body of the dialog.
 * @property {string} [cancelButtonText='Cancel'] The label for the cancel button.
 * @property {string} [confirmButtonText='Confirm'] The label for the confirm button.
 * @property {boolean} [isConfirmActionDangerous=false] Whether the action is dangerous (potentially destructive or not easily reversible).
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the background element, separated by spaces.
 * @property {object} [backgroundStyle] Extra styles to apply to the background element.
 * @property {Function} onCancel Cancel button event handler. Handles click events and Space/Enter keypress events.
 * @property {Function} onConfirm Confirm button event handler. Handles click events and Space/Enter keypress events.
 */
interface ConfirmationDialogProps extends StyleProps {
    style?: React.CSSProperties;
    title: string;
    cancelButtonText: string;
    confirmButtonText: string;
    isConfirmActionDangerous: boolean;
    className?: string;
    body?: React.ReactNode;
    backgroundClassName?: string;
    backgroundStyle?: React.CSSProperties;
    onCancel: () => unknown;
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
        ...stylePropTypes,
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
