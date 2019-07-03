// @flow

import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from './dialog';
import Button from './button';

/**
 * @typedef {Object} ConfirmationDialogProps
 * @property {string} title The title of the dialog.
 * @property {React.Node} [body] The body of the dialog.
 * @property {string} [cancelButtonText='Cancel'] The label for the cancel button.
 * @property {string} [confirmButtonText='Confirm'] The label for the confirm button.
 * @property {boolean} [isConfirmActionDangerous=false] Whether the action is dangerous (potentially destructive or not easily reversible).
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the lightbox element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the lightbox element.
 * @property {function} onCancel Cancel button event handler. Handles click events and Space and Enter keypress events.
 * @property {function} onConfirm Confirm button event handler. Handles click events and Space and Enter keypress events.
 */
type ConfirmationDialogProps = {|
    title: string,
    body?: React.Node,
    cancelButtonText: string,
    confirmButtonText: string,
    isConfirmActionDangerous: boolean,
    className?: string,
    style?: Object,
    backgroundClassName?: string,
    backgroundStyle?: Object,
    onCancel: () => mixed,
    onConfirm: () => mixed,
|};

/**
 * A styled modal dialog component that prompts the user to confirm or cancel an action.
 * By default, this component will focus the "Confirm" button on mount, so that pressing
 * the Enter key will confirm the action.
 *
 * @example
 * import {Button, Dialog, ConfirmationDialog} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     const [isDialogOpen, setIsDialogOpen] = useState(false);
 *     return (
 *         <Fragment>
 *             <Button
 *                 theme={Button.themes.BLUE}
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
 */
class ConfirmationDialog extends React.Component<ConfirmationDialogProps> {
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
    };
    static defaultProps = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        isConfirmActionDangerous: false,
    };
    _onConfirm: () => void;
    _onCancel: () => void;
    _confirmButtonRef: Button | null;
    constructor(props: ConfirmationDialogProps) {
        super(props);
        this._onConfirm = this._onConfirm.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._confirmButtonRef = null;
    }
    componentDidMount() {
        if (this._confirmButtonRef !== null) {
            this._confirmButtonRef.focus();
        }
    }
    _onCancel() {
        this.props.onCancel();
    }
    _onConfirm() {
        this.props.onConfirm();
    }
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
        } = this.props;

        return (
            <Dialog
                onClose={this._onCancel}
                className={className}
                style={{
                    width: 400, 
                    ...style,
                }}
                backgroundClassName={backgroundClassName}
                backgroundStyle={backgroundStyle}
            >
                <Dialog.CloseButton />
                <h1 className="mb1 strong" style={{fontSize: 20}}>
                    {title}
                </h1>
                {body}
                <div className="width-full flex flex-reverse items-center justify-start mt2">
                    <Button
                        ref={el => (this._confirmButtonRef = el)}
                        onClick={this._onConfirm}
                        theme={isConfirmActionDangerous ? Button.themes.RED : Button.themes.BLUE}
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        onClick={this._onCancel}
                        theme={Button.themes.TRANSPARENT}
                        className="self-end mr1 border-transparent quiet link-unquiet-focusable text-blue-focus"
                    >
                        {cancelButtonText}
                    </Button>
                </div>
            </Dialog>
        );
    }
}

export default ConfirmationDialog;
