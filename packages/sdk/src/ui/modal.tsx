/** @hidden */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {compose} from '@styled-system/core';
import {spawnInvariantViolationError} from '../error_utils';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
import {
    dimensionsSet,
    dimensionsSetPropTypes,
    DimensionsSetProps,
    display,
    displayPropTypes,
    flexContainerSet,
    flexContainerSetPropTypes,
    FlexContainerSetProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
} from './system';
import {OptionalResponsiveProp} from './system/utils/types';

/**
 * Props for the {@link Modal} component. Also accepts:
 * * {@link ModalStyleProps}
 *
 * @hidden
 */
// This doesn't actually extend ModalStyleProps since withStyledSystem
// expects non-style props and style props as separate generic type variables.
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

export const modalStylePropTypes = {
    ...dimensionsSetPropTypes,
    // TODO (stephen): currently, this will accept all values for display, not just block/flex
    ...displayPropTypes,
    ...flexContainerSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * Generic modal component with minimal styling.
 *
 * @hidden
 */
// TODO (stephen): refactor so Modal only includes the background element and renders the dialog via children
export class Modal extends React.Component<ModalProps> {
    /** @hidden */
    static propTypes = {
        onClose: PropTypes.func,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
    };
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
        // If we don't set `position: fixed`, the outline and box-shadow
        // of elements that are in theory underneath this element will cover
        // up the modal.
        container.style.position = 'fixed';
        if (!document.body) {
            throw spawnInvariantViolationError('no document body');
        }
        document.body.appendChild(container);

        // If the frame is focused, move focus to the modal's container.
        // Next time the user presses tab, it will focus the first focusable element in the modal.
        // We only do this if the document is focused to avoid the frame becoming
        // programmatically focused if a modal is displayed without user interaction.
        if (document.hasFocus()) {
            this._originalActiveElement = document.activeElement;
            container.focus();
        }
    }
    /** @hidden */
    componentWillUnmount() {
        if (!document.body) {
            throw spawnInvariantViolationError('no document body');
        }
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
                ref={el => (this._background = el)}
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
    modalStylePropTypes,
    // TODO (stephen): move these to Dialog
    {
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: 3,
        padding: 3,
    },
);
