// @flow

import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {baymax} from './baymax_utils';
import Icon from './icon';
import Modal from './modal';

/**
 * @typedef {object} DialogCloseButtonProps
 * @property {string} [className] `className`s to apply to the close button, separated by spaces.
 * @property {object} [style] Styles to apply to the dialog element.
 * @property {number | string} [tabIndex] Indicates if the button can be focused and if/where it participates in sequential keyboard navigation.
 */
type DialogCloseButtonProps = {|
    className?: string,
    style?: Object,
    tabIndex?: number | string,
    children?: React.Node,
|};

/**
 * A button that closes {@link Dialog}.
 *
 * @alias Dialog.CloseButton
 */
class DialogCloseButton extends React.Component<DialogCloseButtonProps> {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        children: PropTypes.node,
    };
    static contextTypes = {
        onDialogClose: PropTypes.func,
    };
    _onKeyDown: (e: SyntheticKeyboardEvent<HTMLDivElement>) => void;
    constructor(props: DialogCloseButtonProps) {
        super(props);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    _onKeyDown(e: SyntheticKeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            this.context.onDialogClose();
        }
    }
    render() {
        const {className, style, tabIndex, children} = this.props;
        const shouldUseDefaultStyling = !children;
        const defaultClassName =
            'absolute top-0 right-0 mt1 mr1 flex items-center justify-center circle darken1-hover darken1-focus no-outline pointer';
        const defaultStyle = {width: 24, height: 24};

        return (
            <div
                onClick={this.context.onDialogClose}
                onKeyDown={this._onKeyDown}
                className={cx(
                    {
                        [baymax(defaultClassName)]: shouldUseDefaultStyling,
                    },
                    className,
                )}
                style={{
                    ...(shouldUseDefaultStyling ? defaultStyle : {}),
                    ...style,
                }}
                tabIndex={tabIndex || 0}
                role="button"
                aria-label="Close dialog"
            >
                {children ? children : <Icon name="x" size={12} className={baymax('quieter')} />}
            </div>
        );
    }
}

/**
 * @typedef {object} DialogProps
 * @property {function} onClose Callback function to fire when the dialog is closed.
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the lightbox element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the lightbox element.
 */
type DialogProps = {
    onClose: () => mixed,
    className?: string,
    style?: Object,
    backgroundClassName?: string,
    backgroundStyle?: Object,
    children: React.Node,
};

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
        } = this.props;
        return (
            <Modal
                onClose={onClose}
                className={cx(baymax('relative p2 big line-height-4'), className)}
                style={style}
                backgroundClassName={backgroundClassName}
                backgroundStyle={backgroundStyle}
            >
                {children}
            </Modal>
        );
    }
}

export default Dialog;
