/** @module @airtable/blocks/ui: Dialog */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {baymax} from './baymax_utils';
import Modal from './modal';
import DialogCloseButton from './dialog_close_button';
import {
    dimensionsSetPropTypes,
    DimensionsSetProps,
    displayPropTypes,
    flexContainerSetPropTypes,
    FlexContainerSetProps,
    spacingSetPropTypes,
    SpacingSetProps,
} from './system';
import {OptionalResponsiveProp} from './system/utils/types';

/**
 * Style props shared between the {@link Dialog} and {@link ConfirmationDialog} components. Also accepts:
 * * {@link DimensionsSetProps}
 * * {@link FlexContainerSetProps}
 * * {@link SpacingSetProps}
 *
 * @noInheritDoc
 */
// This is equivalent to ModalStyleProps, but we include it separately since Modal is private.
export interface DialogStyleProps
    extends DimensionsSetProps,
        FlexContainerSetProps,
        SpacingSetProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'block' | 'flex'>;
}

export const dialogStylePropTypes = {
    ...dimensionsSetPropTypes,
    // TODO (stephen): currently, this will accept all values for display, not just block/flex
    ...displayPropTypes,
    ...flexContainerSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * Props for the {@link Dialog} component. Also accepts:
 * * {@link DialogStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/Dialog
 */
interface DialogProps extends DialogStyleProps {
    /** Callback function to fire when the dialog is closed. */
    onClose: () => unknown;
    /** Extra `className`s to apply to the dialog element, separated by spaces. */
    className?: string;
    /** Extra styles to apply to the dialog element. */
    style?: React.CSSProperties;
    /** Extra `className`s to apply to the background element, separated by spaces. */
    backgroundClassName?: string;
    /** Extra styles to apply to the background element. */
    backgroundStyle?: React.CSSProperties;
    /** The contents of the dialog element. */
    children: React.ReactNode;
}

/**
 * A styled modal dialog component.
 *
 * [[ Story id="dialog--example" title="Dialog example" ]]
 *
 * @docsPath UI/components/Dialog
 * @component
 */
// TODO (stephen): focus trapping
class Dialog extends React.Component<DialogProps> {
    /** @hidden */
    static CloseButton = DialogCloseButton;
    /** @hidden */
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
        children: PropTypes.node.isRequired,
        ...dialogStylePropTypes,
    };
    // automatically pass onClose to any descendants that are Dialog.CloseButton
    /** @hidden */
    static childContextTypes = {
        onDialogClose: PropTypes.func,
    };
    /** @hidden */
    constructor(props: DialogProps) {
        super(props);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    /** @hidden */
    getChildContext() {
        return {
            onDialogClose: this.props.onClose,
        };
    }
    /** @hidden */
    componentDidMount() {
        window.addEventListener('keydown', this._onKeyDown, false);
    }
    /** @hidden */
    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown, false);
    }
    /** @internal */
    _onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            this.props.onClose();
        }
    }
    /** @hidden */
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
