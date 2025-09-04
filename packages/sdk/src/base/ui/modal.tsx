/** @hidden */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {compose} from '@styled-system/core';
import {invariant} from '../../shared/error_utils';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
import {
    dimensionsSet,
    DimensionsSetProps,
    display,
    flexContainerSet,
    FlexContainerSetProps,
    spacingSet,
    SpacingSetProps,
} from './system';
import {OptionalResponsiveProp} from './system/utils/types';

/**
 * Props for the {@link Modal} component. Also accepts:
 * * {@link ModalStyleProps}
 *
 * @hidden
 */

interface ModalProps {
    /** Callback function to fire when the modal is closed. */
    onClose?: () => unknown;
    /** Extra `className`s to apply to the modal element, separated by spaces. */
    className?: string;
    /** Extra styles to apply to the modal element. */
    style?: React.CSSProperties;
    /** Extra `className`s to apply to the background element, separated by spaces. */
    backgroundClassName?: string;
    /** Extra styles to apply to the background element. */
    backgroundStyle?: React.CSSProperties;
    /** */
    children: React.ReactNode;
}

/**
 * Style props shared between the {@link Modal}, {@link Dialog}, and {@link ConfirmationDialog} components. Also accepts:
 * * {@link DimensionsSetProps}
 * * {@link FlexContainerSetProps}
 * * {@link SpacingSetProps}
 *
 * @hidden
 * @noInheritDoc
 */
export interface ModalStyleProps
    extends DimensionsSetProps,
        FlexContainerSetProps,
        SpacingSetProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'block' | 'flex'>;
}

const styleParser = compose(dimensionsSet, display, flexContainerSet, spacingSet);

/**
 * Generic modal component with minimal styling.
 *
 * @hidden
 */

export class Modal extends React.Component<ModalProps> {
    /** @internal */
    _background: HTMLDivElement | null;
    /** @internal */
    _container: HTMLDivElement;
    /** @internal */
    _originalActiveElement: Element | null;
    /** @internal */
    _mouseDownOutsideModal: boolean;
    /** @hidden */
    constructor(props: ModalProps) {
        super(props);

        this._background = null;
        this._container = document.createElement('div');
        this._originalActiveElement = null;
        this._mouseDownOutsideModal = false;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
    }
    /** @hidden */
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
    /** @hidden */
    componentWillUnmount() {
        invariant(document.body, 'no document body');
        document.body.removeChild(this._container);
        if (this._originalActiveElement !== null) {
            (this._originalActiveElement as HTMLElement).focus();
        }
    }
    /** @internal */
    _onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (this._shouldClickingOnElementCloseModal(e.target)) {
            this._mouseDownOutsideModal = true;
        }
    }
    /** @internal */
    _onMouseUp(e: React.MouseEvent<HTMLDivElement>) {
        if (
            this._mouseDownOutsideModal &&
            this.props.onClose &&
            this._shouldClickingOnElementCloseModal(e.target)
        ) {
            this.props.onClose();
        }
        this._mouseDownOutsideModal = false;
    }
    /** @internal */
    _shouldClickingOnElementCloseModal(el: EventTarget | null) {
        return el === this._background;
    }
    /** @hidden */
    render() {
        const {className, style, backgroundClassName, backgroundStyle, children} = this.props;

        return ReactDOM.createPortal(
            <div
                ref={el => {
                    this._background = el;
                }}
                className={cx(
                    baymax('fixed all-0 darken3 flex items-center justify-center'),
                    backgroundClassName,
                )}
                style={backgroundStyle}
                onMouseDown={this._onMouseDown}
                onMouseUp={this._onMouseUp}
            >
                <div
                    className={cx(
                        baymax(
                            'relative overflow-auto light-scrollbar white stroked1 rounded-big animate-bounce-in',
                        ),
                        className,
                    )}
                    style={style}
                >
                    {children}
                </div>
            </div>,
            this._container,
        );
    }
}

export default withStyledSystem<ModalProps, ModalStyleProps, Modal, {}>(
    Modal,
    styleParser,
    {
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: 3,
        padding: 3,
    },
);
