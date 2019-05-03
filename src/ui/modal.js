// @flow
import React from './react';

import ReactDOM from './react-dom';
import PropTypes from 'prop-types';
import Icon from './icon';
import classNames from 'classnames';
import invariant from 'invariant';

type ModalCloseButtonProps = {|
    className?: string,
    style?: Object,
    children?: React.Node,
|};

class ModalCloseButton extends React.Component<ModalCloseButtonProps> {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static contextTypes = {
        onModalClose: PropTypes.func,
    };
    render() {
        return (
            <a
                onClick={this.context.onModalClose}
                className={this.props.className || 'pointer link-quiet'}
                style={this.props.style}
                tabIndex={-1}
            >
                {this.props.children !== null && this.props.children !== undefined ? (
                    this.props.children
                ) : (
                    <Icon name="x" size={12} />
                )}
            </a>
        );
    }
}

type ModalProps = {
    onClose?: Function,
    className?: string,
    style?: Object,
    backgroundClassName?: string,
    backgroundStyle?: Object,
    children: React.Node,
};

/** */
class Modal extends React.Component<ModalProps> {
    static CloseButton = ModalCloseButton;
    static propTypes = {
        onClose: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
    };
    // automatically pass onClose to any descendants that are Modal.CloseButton
    static childContextTypes = {
        onModalClose: PropTypes.func,
    };
    _background: HTMLDivElement | null;
    _container: null | HTMLElement;
    _mouseDownOutsideModal: boolean;
    _onMouseDown: Event => void;
    _onMouseUp: Event => void;
    constructor(props: ModalProps) {
        super(props);

        this._background = null;
        this._container = null;
        this._mouseDownOutsideModal = false;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
    }
    getChildContext() {
        return {
            onModalClose: this.props.onClose,
        };
    }
    componentDidMount() {
        this._container = document.createElement('div');
        const container = this._container;

        container.setAttribute('tabIndex', '0');
        container.style.zIndex = '99999';
        // If we don't set `position: fixed`, the outline and box-shadow
        // of elements that are in theory underneath this element will cover
        // up the modal.
        container.style.position = 'fixed';
        invariant(document.body, 'no document body');
        document.body.appendChild(container);

        this._refreshContainer();

        // Focus the container. Next time the user presses tab, it will focus the first
        // focusable element in the modal.
        container.focus();
    }
    componentDidUpdate() {
        this._refreshContainer();
    }
    componentWillUnmount() {
        const container = this._container;
        invariant(container, 'No modal container');
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    }
    _refreshContainer() {
        const backgroundClassName = classNames(
            'fixed all-0 darken3 flex items-center justify-center',
            this.props.backgroundClassName,
        );
        const backgroundStyle = this.props.backgroundStyle;

        const contentClassName = classNames(
            'white rounded-big overflow-auto light-scrollbar width-full stroked1 animate-bounce-in',
            this.props.className,
        );
        const contentStyle = {
            maxWidth: '95vw',
            maxHeight: '95vh',
            ...this.props.style,
        };

        // TODO(jb): we'll need to change this to support all versions of ReactDOM.
        // Probably shouldn't be using unstable methods like this when we release the
        // editor.
        ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            <div
                ref={el => (this._background = el)}
                className={backgroundClassName}
                style={backgroundStyle}
                onMouseDown={this._onMouseDown}
                onMouseUp={this._onMouseUp}
            >
                <div className={contentClassName} style={contentStyle}>
                    {this.props.children}
                </div>
            </div>,
            this._container,
        );
    }
    _onMouseDown(e: Event) {
        if (this._shouldClickingOnElementCloseModal(e.target)) {
            this._mouseDownOutsideModal = true;
        }
    }
    _onMouseUp(e: Event) {
        if (
            this._mouseDownOutsideModal &&
            this.props.onClose &&
            this._shouldClickingOnElementCloseModal(e.target)
        ) {
            this.props.onClose();
        }
        this._mouseDownOutsideModal = false;
    }
    _shouldClickingOnElementCloseModal(element: EventTarget) {
        return element === this._background;
    }
    render() {
        return null;
    }
}

export default Modal;
