// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {baymax} from './baymax_utils';
import Modal, {stylePropTypes, type StyleProps} from './modal';
import DialogCloseButton from './dialog_close_button';

/**
 * @typedef {object} DialogProps
 * @property {function} onClose Callback function to fire when the dialog is closed.
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the background element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the background element.
 */
type DialogProps = {|
    onClose: () => mixed,
    className?: string,
    style?: {[string]: mixed},
    backgroundClassName?: string,
    backgroundStyle?: {[string]: mixed},
    children: React.Node,
    ...StyleProps,
|};

/**
 * A styled modal dialog component.
 *
 * @example
 * import {Button, Dialog} from '@airtable/blocks/ui';
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
 *                 <Dialog onClose={() => setIsDialogOpen(false)}>
 *                     <Fragment>
 *                         <Dialog.CloseButton />
 *                         <h1
 *                             style={{
 *                                 marginBottom: 8,
 *                                 fontSize: 20,
 *                                 fontWeight: 500,
 *                             }}
 *                         >
 *                             Dialog
 *                         </h1>
 *                         <p>This is the dialog content.</p>
 *                     </Fragment>
 *                 </Dialog>
 *             )}
 *         </Fragment>
 *     );
 * }
 */

class Dialog extends React.Component<DialogProps> {
    static CloseButton = DialogCloseButton;
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
        children: PropTypes.node.isRequired,
        ...stylePropTypes,
    };
    static childContextTypes = {
        onDialogClose: PropTypes.func,
    };
    _onKeyDown: (e: SyntheticKeyboardEvent<HTMLElement>) => void;
    constructor(props: DialogProps) {
        super(props);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    getChildContext() {
        return {
            onDialogClose: this.props.onClose,
        };
    }
    componentDidMount() {
        window.addEventListener('keydown', this._onKeyDown, false);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown, false);
    }
    _onKeyDown(e: SyntheticKeyboardEvent<HTMLElement>) {
        if (e.key === 'Escape') {
            this.props.onClose();
        }
    }
    render() {
        const {
            onClose,
            className,
            style,
            backgroundClassName,
            backgroundStyle,
            children,
            ...restOfProps
        } = this.props;

        return (
            <Modal
                onClose={onClose}
                className={cx(baymax('big line-height-4'), className)}
                style={style}
                backgroundClassName={backgroundClassName}
                backgroundStyle={backgroundStyle}
                {...restOfProps}
            >
                {children}
            </Modal>
        );
    }
}

export default Dialog;
