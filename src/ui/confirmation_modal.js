// @flow
import React from './react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Modal from './modal';
import Button from './button';
const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

type ConfirmationModalProps = {|
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

const isReactNodeRenderable = node => {
    return node !== null && node !== undefined && node !== false;
};

class ConfirmationModal extends React.Component<ConfirmationModalProps> {
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

    _hasBeenAutoFocused = false;

    componentDidMount() {
        window.addEventListener('keydown', this._onKeyDown, false);
    }

    UNSAFE_componentWillMount() {
        window.removeEventListener('keydown', this._onKeyDown, false);
    }

    _onCancel = () => {
        this.props.onCancel();
    };

    _onConfirm = () => {
        this.props.onConfirm();
    };

    _onKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === KeyCodes.ESCAPE) {
            this._onCancel();
        }
    };

    _autoFocusButtonOnce(button: Button | null) {
        if (button && !this._hasBeenAutoFocused) {
            button.focus();
            this._hasBeenAutoFocused = true;
        }
    }

    // usually, auto-focusing the button would be something we'd want to do in
    // componentDidMount. Unfortunately, because of the way UI.Modal works
    // (with unstable_renderSubtreeIntoContainer instead of createPortal),
    // componentDidMount gets called *before* the modal is actually rendered.
    // to get around this, we trigger auto focus in the button refs instead.
    _confirmButtonRef = (confirmButton: Button | null) => {
        if (!this.props.isConfirmActionDangerous) {
            this._autoFocusButtonOnce(confirmButton);
        }
    };

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
            <Modal
                onClose={this._onCancel}
                className={classNames('p2', className)}
                style={{width: 400, ...style}}
            >
                <div className="mb1 strong big line-height-4">{title}</div>
                {isReactNodeRenderable(body) && <div className="mb2">{body}</div>}
                <div className="flex items-center justify-end">
                    <Button
                        onClick={this._onCancel}
                        theme={Button.themes.TRANSPARENT}
                        className="mr1 border-transparent text-blue-focus"
                    >
                        {cancelButtonText}
                    </Button>
                    <Button
                        ref={this._confirmButtonRef}
                        onClick={this._onConfirm}
                        theme={isConfirmActionDangerous ? Button.themes.RED : Button.themes.BLUE}
                    >
                        {confirmButtonText}
                    </Button>
                </div>
            </Modal>
        );
    }
}

export default ConfirmationModal;
