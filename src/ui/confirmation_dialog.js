// @flow

import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from './dialog';
import Button from './button';

/**
 * @typedef
 * @memberof ConfirmationDialog
 */
type ConfirmationDialogProps = {|
    title: string,
    body?: React.Node,
    cancelButtonText: string,
    confirmButtonText: string,
    isConfirmActionDangerous: boolean,
    className?: string,
    style?: Object,
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
        onCancel: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
    };
    static defaultProps = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Okay',
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
        } = this.props;

        return (
            <Dialog onClose={this._onCancel} className={className} style={{width: 400, ...style}}>
                <Dialog.CloseButton />
                <h1 className="mb1 strong" style={{fontSize: 20}}>
                    {title}
                </h1>
                {body}
                <div className="width-full flex flex-reverse items-center justify-start mt2">
                    <Button
                        ref={element => (this._confirmButtonRef = element)}
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
