/** @module @airtable/blocks/ui: Tooltip */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import {baymax} from './baymax_utils';
import Popover, {PopoverPlacementX, PopoverPlacementY, FitInWindowMode} from './popover';
import Text from './text';
import {TooltipAnchorProps} from './types/tooltip_anchor_props';

const FADE_IN_ANIMATION_DURATION = 150;

/**
 * Props for the {@link Tooltip} component.
 *
 * @docsPath UI/components/Tooltip
 */
interface TooltipProps {
    /** Child components to render. */
    children: React.ReactElement<TooltipAnchorProps>;
    /** The horizontal placement of the tooltip. Defaults to {@link PopoverPlacements.RIGHT}. */
    placementX?: PopoverPlacementX;
    /** The vertical placement of the tooltip. Defaults to {@link PopoverPlacements.CENTER}. */
    placementY?: PopoverPlacementY;
    /** The horizontal offset, in pixels, of the tooltip. If `placementX` is set to {@link PopoverPlacements.LEFT}, a higher number will move the tooltip to the left. If `placementX` is set to {@link PopoverPlacements.RIGHT}, a higher number moves the tooltip to the right. If `placementX` is set to {@link PopoverPlacements.CENTER}, this value has no effect. Defaults to 12. */
    placementOffsetX?: number;
    /** The vertical offset, in pixels, of the tooltip. If `placementY` is set to {@link PopoverPlacements.TOP}, a higher number will move the tooltip upward. If `placementY` is set to {@link PopoverPlacements.BOTTOM}, a higher number moves the tooltip downard. If `placementY` is set to {@link PopoverPlacements.CENTER}, this value has no effect. Defaults to 0. */
    placementOffsetY?: number;
    /** A string representing the contents. Alternatively, you can include a function that returns a React node to place into the tooltip, which is useful for things like italicization in the tooltip. */
    content?: string | (() => React.ReactElement<any>);
    /** Dictates the behavior when the "normal" placement of the tooltip would be outside of the viewport. Defaults to {@link FitInWindowModes.FLIP}. */
    fitInWindowMode?: FitInWindowMode;
    /** Should the tooltip be hidden when clicked? Defaults to `false`. */
    shouldHideTooltipOnClick?: boolean;
    /** If set to `true`, this tooltip will not be shown. Useful when trying to disable the tooltip dynamically. */
    disabled?: boolean;
    /** Additional class names to attach to the tooltip, separated by spaces. */
    className?: string;
    /** Additional styles names to attach to the tooltip. */
    style?: React.CSSProperties;
}

/** @hidden */
interface TooltipState {
    isShowingTooltip: boolean;
}

/**
 * A component that renders a tooltip on hover. Wraps its children.
 *
 * [[ Story id="tooltip--example" title="Tooltip example" ]]
 *
 * @docsPath UI/components/Tooltip
 * @component
 */
class Tooltip extends React.Component<TooltipProps, TooltipState> {
    /** @hidden */
    static placements = Popover.placements;
    /** @hidden */
    static fitInWindowModes = Popover.fitInWindowModes;

    /** @hidden */
    static defaultProps = {
        placementX: Popover.placements.RIGHT,
        placementY: Popover.placements.CENTER,
        placementOffsetX: 8,
        placementOffsetY: 8,
        fitInWindowMode: Popover.fitInWindowModes.FLIP,
    };
    /** @hidden */
    constructor(props: TooltipProps) {
        super(props);

        this.state = {
            isShowingTooltip: false,
        };

        this._onMouseEnter = this._onMouseEnter.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onClick = this._onClick.bind(this);
        this._showTooltip = this._showTooltip.bind(this);
        this._hideTooltip = this._hideTooltip.bind(this);
        this._renderTooltipContent = this._renderTooltipContent.bind(this);
    }
    /** @internal */
    _onMouseEnter(e: React.MouseEvent<HTMLElement>) {
        this._showTooltip();
        const originalOnMouseEnter = this.props.children.props.onMouseEnter;
        if (originalOnMouseEnter) {
            originalOnMouseEnter(e);
        }
    }
    /** @internal */
    _onMouseLeave(e: React.MouseEvent<HTMLElement>) {
        this._hideTooltip();
        const originalOnMouseLeave = this.props.children.props.onMouseLeave;
        if (originalOnMouseLeave) {
            originalOnMouseLeave(e);
        }
    }
    /** @internal */
    _onClick(e: React.MouseEvent<HTMLElement>) {
        const {shouldHideTooltipOnClick, children} = this.props;
        if (shouldHideTooltipOnClick) {
            this._hideTooltip();
        }
        const originalOnClick = children.props.onClick;
        if (originalOnClick) {
            originalOnClick(e);
        }
    }
    /** @internal */
    _showTooltip() {
        this.setState({isShowingTooltip: true});
    }
    /** @internal */
    _hideTooltip() {
        this.setState({isShowingTooltip: false});
    }
    /** @internal */
    _renderTooltipContent() {
        const {content, className, style} = this.props;
        let renderedContent;
        let isContentAFunction;
        if (typeof content === 'function') {
            renderedContent = content();
            isContentAFunction = true;
        } else {
            renderedContent = content;
            isContentAFunction = false;
        }
        return (
            <Text
                className={cx(baymax('nowrap'), className)}
                style={style}
                position="relative"
                padding={isContentAFunction ? null : 2}
                backgroundColor="dark"
                textColor="white"
                borderRadius="default"
                overflow="hidden"
            >
                {renderedContent}
            </Text>
        );
    }
    /** @hidden */
    render() {
        const {children, content, disabled} = this.props;

        if (disabled || !content) {
            return children;
        }

        const popoverAnchor = React.cloneElement(React.Children.only(children), {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            onClick: this._onClick,
            hasOnClick: children.props.onClick !== undefined,
        });

        return (
            <Popover
                renderContent={this._renderTooltipContent}
                placementX={this.props.placementX}
                placementY={this.props.placementY}
                placementOffsetX={this.props.placementOffsetX}
                placementOffsetY={this.props.placementOffsetY}
                fitInWindowMode={this.props.fitInWindowMode}
                isOpen={this.state.isShowingTooltip}
                backgroundStyle={{
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    animationName: 'opacityFadeIn',
                    animationDuration: `${FADE_IN_ANIMATION_DURATION}ms`,
                    animationTimingFunction: 'ease-out',
                }}
            >
                {popoverAnchor}
            </Popover>
        );
    }
}

export default Tooltip;
