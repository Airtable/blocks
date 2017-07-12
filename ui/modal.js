// @flow
const React = require('client/blocks/sdk/ui/react');
const ReactDOM = require('client/blocks/sdk/ui/react-dom');
const Icon = require('client/blocks/sdk/ui/icon');
const classNames = require('classnames');
const invariant = require('invariant');

const {PropTypes} = React;

type ModalPropTypes = {
    onClose?: Function,
    className?: string,
    style?: Object,
    backgroundClassName?: string,
    backgroundStyle?: Object,
};

class Modal extends React.Component {
    static propTypes = {
        onClose: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
    };
    // automatically pass onClose to any descendants that are Modal.CloseButton
    static childContextTypes = {
        onModalClose: React.PropTypes.func,
    };
    _container: null | HTMLElement;
    _mouseDownOutsideModal: boolean;
    _onMouseDown: Event => void;
    _onMouseUp: Event => void;
    constructor(props: ModalPropTypes) {
        super(props);

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
        invariant(container, 'No modal container');

        container.className = 'fixed all-0';
        container.setAttribute('tabIndex', '0');
        container.style.zIndex = '99999';
        document.body.appendChild(container);

        this._refreshContainer();
        this._bindToInputEvents();

        // Focus the container. Next time the user presses tab, it will focus the first
        // focusable element in the modal.
        container.focus();
    }
    componentDidUpdate() {
        this._refreshContainer();
    }
    componentWillUnmount() {
        this._unbindFromInputEvents();

        const container = this._container;
        invariant(container, 'No modal container');
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    }
    _refreshContainer() {
        const backgroundClassName = classNames('absolute all-0 darken3 flex items-center noevents justify-center', this.props.backgroundClassName);
        const backgroundStyle = this.props.backgroundStyle;

        const contentClassName = classNames('white rounded-big overflow-auto light-scrollbar events width-full stroked1 animate-bounce-in', this.props.className);
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
            <div className={backgroundClassName} style={backgroundStyle}>
                <div className={contentClassName} style={contentStyle}>{this.props.children}</div>
            </div>,
            this._container,
        );
    }
    _bindToInputEvents() {
        const container = this._container;
        invariant(container, 'No modal container');

        container.addEventListener('mousedown', this._onMouseDown);
        container.addEventListener('mouseup', this._onMouseUp);
    }
    _unbindFromInputEvents() {
        const container = this._container;
        invariant(container, 'No modal container');

        container.removeEventListener('mousedown', this._onMouseDown);
        container.removeEventListener('mouseup', this._onMouseUp);
    }
    _onMouseDown(e: Event) {
        if (this._shouldClickingOnElementCloseModal(e.target)) {
            this._mouseDownOutsideModal = true;
        }
    }
    _onMouseUp(e: Event) {
        if (this._mouseDownOutsideModal && this.props.onClose && this._shouldClickingOnElementCloseModal(e.target)) {
            this.props.onClose();
        }
        this._mouseDownOutsideModal = false;
    }
    _shouldClickingOnElementCloseModal(element: EventTarget) {
        return element === this._container;
    }
    render() {
        return null;
    }
}

class ModalCloseButton extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static contextTypes = {
        onModalClose: React.PropTypes.func,
    };
    render() {
        return (
            <a
                onClick={this.context.onModalClose}
                className={this.props.className || 'pointer link-quiet'}
                style={this.props.style}
                tabIndex={-1}>
                {this.props.children ? this.props.children : <Icon name="x" size={12} />}
            </a>
        );
    }
}

Modal.CloseButton = ModalCloseButton;

module.exports = Modal;
