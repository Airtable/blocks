// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {baymax} from './baymax_utils';
import {stylePropTypes, type StyleProps} from './modal';
import Dialog from './dialog';
import Button from './button';
import Box from './box';

/**
 * @typedef {Object} ConfirmationDialogProps
 * @property {string} title The title of the dialog.
 * @property {React.Node} [body] The body of the dialog.
 * @property {string} [cancelButtonText='Cancel'] The label for the cancel button.
 * @property {string} [confirmButtonText='Confirm'] The label for the confirm button.
 * @property {boolean} [isConfirmActionDangerous=false] Whether the action is dangerous (potentially destructive or not easily reversible).
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the background element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the background element.
 * @property {function} onCancel Cancel button event handler. Handles click events and Space/Enter keypress events.
 * @property {function} onConfirm Confirm button event handler. Handles click events and Space/Enter keypress events.
 */
type ConfirmationDialogProps = {|
    title: string,
    body?: React.Node,
    cancelButtonText: string,
    confirmButtonText: string,
    isConfirmActionDangerous: boolean,
    className?: string,
    style?: {[string]: mixed},
    backgroundClassName?: string,
    backgroundStyle?: {[string]: mixed},
    onCancel: () => mixed,
    onConfirm: () => mixed,
    ...StyleProps,
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
        ...stylePropTypes,
    };
    static defaultProps = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        isConfirmActionDangerous: false,
        width: '400px',
    };
    _onConfirm: () => void;
    _onCancel: () => void;
    _confirmButtonRef: React.ElementRef<typeof Button> | null;
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
                onClose={this._onCancel}
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
                        ref={el => (this._confirmButtonRef = el)}
                        onClick={onConfirm}
                        theme={isConfirmActionDangerous ? Button.themes.RED : Button.themes.BLUE}
                    >
                        {confirmButtonText}
                    </Button>
                    <Button
                        onClick={onCancel}
                        theme={Button.themes.TRANSPARENT}
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
