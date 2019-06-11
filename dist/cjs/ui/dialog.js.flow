// @flow

import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import Icon from './icon';
import Modal from './modal';

/**
 * @typedef
 * @alias Dialog.CloseButtonProps
 */
type DialogCloseButtonProps = {|
    className?: string,
    style?: Object,
    tabIndex?: number,
    children?: React.Node,
|};

/**
 * @alias Dialog.CloseButton
 */
class DialogCloseButton extends React.Component<DialogCloseButtonProps> {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.number,
        children: PropTypes.node,
    };
    static contextTypes = {
        onDialogClose: PropTypes.func,
    };
    _onKeyDown: (event: SyntheticKeyboardEvent<HTMLDivElement>) => void;
    constructor(props: DialogCloseButtonProps) {
        super(props);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    _onKeyDown(event: SyntheticKeyboardEvent<HTMLDivElement>) {
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
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
                className={classNames(
                    {
                        [defaultClassName]: shouldUseDefaultStyling,
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
                {children ? children : <Icon name="x" size={12} className="quieter" />}
            </div>
        );
    }
}

/**
 * @typedef
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
// TODO (stephen): focus trapping
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
    // automatically pass onClose to any descendants that are Dialog.CloseButton
    static childContextTypes = {
        onDialogClose: PropTypes.func,
    };
    _onKeyDown: (event: SyntheticKeyboardEvent<HTMLElement>) => void;
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
    _onKeyDown(event: SyntheticKeyboardEvent<HTMLElement>) {
        if (event.key === 'Escape') {
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
                className={classNames('relative p2 line-height-4', className)}
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
