// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {type SVGElement} from '../types/svg_element';
import {invariant} from '../error_utils';

/**
 * @memberof Modal
 * @typedef {Object} ModalProps
 * @property {function} [onClose] Callback function to fire when the modal is closed.
 * @property {string} [className] Extra `className`s to apply to the modal element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the modal element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the lightbox element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the lightbox element.
 */
type ModalProps = {
    onClose?: () => mixed,
    className?: string,
    style?: Object,
    backgroundClassName?: string,
    backgroundStyle?: Object,
    children: React.Node,
};

/**
 * Generic modal component with minimal styling.
 *
 * @private
 */
class Modal extends React.Component<ModalProps> {
    static propTypes = {
        onClose: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
    };
    _background: HTMLDivElement | null;
    _container: HTMLDivElement;
    _originalActiveElement: HTMLElement | SVGElement | null;
    _mouseDownOutsideModal: boolean;
    _onMouseDown: MouseEvent => void;
    _onMouseUp: MouseEvent => void;
    constructor(props: ModalProps) {
        super(props);

        this._background = null;
        this._container = document.createElement('div');
        this._originalActiveElement = null;
        this._mouseDownOutsideModal = false;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
    }
    componentDidMount() {
        const container = this._container;

        container.setAttribute('tabIndex', '0');
        container.style.zIndex = '99999';
        container.style.position = 'fixed';
        invariant(document.body, 'no document body');
        document.body.appendChild(container);

        if (document.hasFocus()) {
            this._originalActiveElement = document.activeElement;
            container.focus();
        }
    }
    componentWillUnmount() {
        invariant(document.body, 'no document body');
        document.body.removeChild(this._container);
        if (this._originalActiveElement !== null) {
            this._originalActiveElement.focus();
        }
    }
    _onMouseDown(e: MouseEvent) {
        if (this._shouldClickingOnElementCloseModal(e.target)) {
            this._mouseDownOutsideModal = true;
        }
    }
    _onMouseUp(e: MouseEvent) {
        if (
            this._mouseDownOutsideModal &&
            this.props.onClose &&
            this._shouldClickingOnElementCloseModal(e.target)
        ) {
            this.props.onClose();
        }
        this._mouseDownOutsideModal = false;
    }
    _shouldClickingOnElementCloseModal(el: EventTarget) {
        return el === this._background;
    }
    render() {
        const backgroundClassName = classNames(
            'fixed all-0 darken3 flex items-center justify-center',
            this.props.backgroundClassName,
        );
        const backgroundStyle = this.props.backgroundStyle;

        const contentClassName = classNames(
            'width-full m2 overflow-auto light-scrollbar white stroked1 rounded-big animate-bounce-in',
            this.props.className,
        );
        const contentStyle = {
            maxWidth: '100vw',
            maxHeight: '100vh',
            ...this.props.style,
        };

        return ReactDOM.createPortal(
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
}

export default Modal;
