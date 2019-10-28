/** @module @airtable/blocks/ui: Dialog */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
import {
    borderRadius,
    borderRadiusPropTypes,
    BorderRadiusProps,
    dimensionsSet,
    dimensionsSetPropTypes,
    DimensionsSetProps,
    display,
    displayPropTypes,
    DisplayProps,
    flexContainerSet,
    flexContainerSetPropTypes,
    FlexContainerSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import Icon from './icon';

/**
 * @typedef {object} DialogCloseButtonProps
 */
export interface DialogCloseButtonProps extends TooltipAnchorProps {
    /** `className`s to apply to the close button, separated by spaces. */
    className?: string;
    /** Styles to apply to the dialog element. */
    style?: React.CSSProperties;
    /** Indicates if the button can be focused and if/where it participates in sequential keyboard navigation. */
    tabIndex?: number;
    /** */
    children?: React.ReactNode;
}

/** */
export interface DialogCloseButtonStyleProps
    extends BorderRadiusProps,
        DimensionsSetProps,
        DisplayProps,
        FlexContainerSetProps,
        FlexItemSetProps,
        PositionSetProps,
        SpacingSetProps {}

const styleParser = compose(
    borderRadius,
    dimensionsSet,
    display,
    flexContainerSet,
    flexItemSet,
    positionSet,
    spacingSet,
);

const dialogCloseButtonStylePropTypes = {
    ...borderRadiusPropTypes,
    ...dimensionsSetPropTypes,
    ...displayPropTypes,
    ...flexContainerSetPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * A button that closes {@link Dialog}.
 *
 * @alias Dialog.CloseButton
 */
// TODO (stephen): convert into a prop in Dialog
export class DialogCloseButton extends React.Component<DialogCloseButtonProps> {
    /** @hidden */
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.number,
        children: PropTypes.node,
        ...tooltipAnchorPropTypes,
    };
    /** @hidden */
    static contextTypes = {
        onDialogClose: PropTypes.func,
    };
    /** @hidden */
    constructor(props: DialogCloseButtonProps) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    /** @internal */
    _onClick(e: React.MouseEvent<HTMLDivElement>) {
        // onClick should only be defined in the case of a tooltip.
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        this.context.onDialogClose();
    }
    /** @internal */
    _onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            this.context.onDialogClose();
        }
    }
    /** @hidden */
    render() {
        const {onMouseEnter, onMouseLeave, className, style, tabIndex, children} = this.props;
        return (
            <div
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={this._onClick}
                onKeyDown={this._onKeyDown}
                className={cx(baymax('darken1-hover darken1-focus no-outline pointer'), className)}
                style={style}
                tabIndex={tabIndex || 0}
                role="button"
                aria-label="Close dialog"
            >
                {children ? children : <Icon name="x" size={12} className={baymax('quieter')} />}
            </div>
        );
    }
}

export default withStyledSystem<
    DialogCloseButtonProps,
    DialogCloseButtonStyleProps,
    DialogCloseButton,
    {}
>(DialogCloseButton, styleParser, dialogCloseButtonStylePropTypes, {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 2,
    marginRight: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: 'circle',
});
