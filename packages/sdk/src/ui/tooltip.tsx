/** @module @airtable/blocks/ui: Tooltip */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {values} from '../private_utils';
import {baymax} from './baymax_utils';
import Popover, {PopoverPlacementX, PopoverPlacementY, FitInWindowMode} from './popover';
import Box from './box';
import {TooltipAnchorProps} from './types/tooltip_anchor_props';

const FADE_IN_ANIMATION_DURATION = 150;

/**
 * @type {object}
 * @property {React$Element<*>} children Child components to render.
 * @property {string|Function} content A string representing the contents. Alternatively, you can include a function that returns a React node to place into the tooltip, which is useful for things like italicization in the tooltip.
 * @property {UI.Tooltip.placements.LEFT|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.RIGHT} [placementX=UI.Tooltip.placements.RIGHT] The horizontal placement of the tooltip.
 * @property {UI.Tooltip.placements.TOP|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.BOTTOM} [placementY=UI.Tooltip.placements.CENTER] The vertical placement of the tooltip.
 * @property {number} [placementOffsetX=12] The horizontal offset, in pixels, of the tooltip. If `placementX` is set to `UI.Tooltip.placements.LEFT`, a higher number will move the tooltip to the left. If `placementX` is set to `UI.Tooltip.placements.RIGHT`, a higher number moves the tooltip to the right. If `placementX` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.
 * @property {number} [placementOffsetY=0] The vertical offset, in pixels, of the tooltip. If `placementY` is set to `UI.Tooltip.placements.TOP`, a higher number will move the tooltip upward. If `placementY` is set to `UI.Tooltip.placements.BOTTOM`, a higher number moves the tooltip downard. If `placementY` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.
 * @property {UI.Tooltip.fitInWindowModes.FLIP|UI.Tooltip.fitInWindowModes.NUDGE|UI.Tooltip.fitInWindowModes.NONE} [fitInWindowMode=UI.Tooltip.fitInWindowModes.FLIP] Dictates the behavior when the "normal" placement of the tooltip would be outside of the viewport. If `NONE`, this has no effect, and the tooltip may be placed off-screen. If `FLIP`, we'll switch the placement to the other side (for example, moving the tooltip from the left to the right). If `NUDGE`, the tooltip will be "nudged" just enough to fit on screen.
 * @property {boolean} [shouldHideTooltipOnClick=false] Should the tooltip be hidden when clicked?
 * @property {boolean} [disabled] If set to `true`, this tooltip will not be shown. Useful when trying to disable the tooltip dynamically.
 * @property {string} [className] Additional class names to attach to the tooltip, separated by spaces.
 * @property {object} [style] Additional styles names to attach to the tooltip.
 */
type TooltipProps = {
    placementOffsetY?: number;
    children: React.ReactElement<TooltipAnchorProps>;
    placementX?: PopoverPlacementX;
    placementY?: PopoverPlacementY;
    placementOffsetX?: number;
    content?: string | (() => React.ReactElement<any>);
    fitInWindowMode?: FitInWindowMode;
    shouldHideTooltipOnClick?: boolean;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
};
type TooltipState = {
    isShowingTooltip: boolean;
};

/**
 * A component that shows a tooltip. Wraps its children.
 *
 * @example
 * ```js
 * import {UI} from '@airtable/blocks';
 *
 * function MyComponent() {
 *     return (
 *         <UI.Tooltip
 *             content="Clicking this button will be a lot of fun!"
 *             placementX={UI.Tooltip.placements.CENTER}
 *             placementY={UI.Tooltip.placements.TOP}
 *         >
 *             <UI.Button onClick={() => alert('Clicked!')}>
 *                 Click here!
 *             </UI.Button>
 *         </UI.Tooltip>
 *     );
 * }
 * ```
 */
class Tooltip extends React.Component<TooltipProps, TooltipState> {
    /** */
    static placements = Popover.placements;
    /** */
    static fitInWindowModes = Popover.fitInWindowModes;

    /** @hidden */
    static propTypes = {
        children: PropTypes.element.isRequired,
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        placementX: PropTypes.oneOf([
            Popover.placements.LEFT,
            Popover.placements.CENTER,
            Popover.placements.RIGHT,
        ]),
        placementY: PropTypes.oneOf([
            Popover.placements.TOP,
            Popover.placements.CENTER,
            Popover.placements.BOTTOM,
        ]),
        placementOffsetX: PropTypes.number,
        placementOffsetY: PropTypes.number,
        fitInWindowMode: PropTypes.oneOf(values(Popover.fitInWindowModes)),
        shouldHideTooltipOnClick: PropTypes.bool,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    /** @hidden */
    static defaultProps = {
        placementX: Popover.placements.RIGHT,
        placementY: Popover.placements.CENTER,
        placementOffsetX: 12,
        placementOffsetY: 0,
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
    _onMouseEnter(e: React.MouseEvent) {
        this._showTooltip();
        const originalOnMouseEnter = this.props.children.props.onMouseEnter;
        if (originalOnMouseEnter) {
            originalOnMouseEnter(e);
        }
    }
    /** @internal */
    _onMouseLeave(e: React.MouseEvent) {
        this._hideTooltip();
        const originalOnMouseLeave = this.props.children.props.onMouseLeave;
        if (originalOnMouseLeave) {
            originalOnMouseLeave(e);
        }
    }
    /** @internal */
    _onClick(e: React.MouseEvent | React.KeyboardEvent) {
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
            <Box
                className={cx(baymax('nowrap'), className)}
                style={style}
                position="relative"
                // Add padding only when using content.
                padding={isContentAFunction ? null : 2}
                backgroundColor="dark"
                textColor="white"
                borderRadius="default"
                overflow="hidden"
            >
                {renderedContent}
            </Box>
        );
    }
    /** @hidden */
    render() {
        const {children, content, disabled} = this.props;

        if (disabled || !content) {
            // The tooltip will never show, so just return the children.
            return children;
        }

        const popoverAnchor = React.cloneElement(React.Children.only(children), {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            onClick: this._onClick,
            // Specifically for RecordCard, which needs to know if onClick is defined.
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
                    // Override the background style of the popover so that it doesn't
                    // take up any space. If we don't do this, the mouseEnter and mouseLeave
                    // handlers won't work, since showing the Popover would place a div over
                    // the content that we care about.
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
