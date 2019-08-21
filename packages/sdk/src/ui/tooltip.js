// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {values} from '../private_utils';
import {baymax} from './baymax_utils';
import Popover, {
    type PopoverPlacementX,
    type PopoverPlacementY,
    type FitInWindowMode,
} from './popover';

const FADE_IN_ANIMATION_DURATION = 150;

/**
 * @type {object}
 * @property {React$Element<*>} children Child components to render.
 * @property {string|function} content A string representing the contents. Alternatively, you can include a function that returns a React node to place into the tooltip, which is useful for things like italicization in the tooltip.
 * @property {UI.Tooltip.placements.LEFT|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.RIGHT} [placementX=UI.Tooltip.placements.RIGHT] The horizontal placement of the tooltip.
 * @property {UI.Tooltip.placements.TOP|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.BOTTOM} [placementY=UI.Tooltip.placements.CENTER] The vertical placement of the tooltip.
 * @property {number} [placementOffsetX=0] The horizontal offset, in pixels, of the tooltip. If `placementX` is set to `UI.Tooltip.placements.LEFT`, a higher number will move the tooltip to the left. If `placementX` is set to `UI.Tooltip.placements.RIGHT`, a higher number moves the tooltip to the right. If `placementX` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.
 * @property {number} [placementOffsetY=0] The vertical offset, in pixels, of the tooltip. If `placementY` is set to `UI.Tooltip.placements.TOP`, a higher number will move the tooltip upward. If `placementY` is set to `UI.Tooltip.placements.BOTTOM`, a higher number moves the tooltip downard. If `placementY` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.
 * @property {UI.Tooltip.fitInWindowModes.FLIP|UI.Tooltip.fitInWindowModes.NUDGE|UI.Tooltip.fitInWindowModes.NONE} [fitInWindowMode=UI.Tooltip.fitInWindowModes.FLIP] Dictates the behavior when the "normal" placement of the tooltip would be outside of the viewport. If `NONE`, this has no effect, and the tooltip may be placed off-screen. If `FLIP`, we'll switch the placement to the other side (for example, moving the tooltip from the left to the right). If `NUDGE`, the tooltip will be "nudged" just enough to fit on screen.
 * @property {boolean} [shouldHideTooltipOnClick=false] Should the tooltip be hidden when clicked?
 * @property {boolean} [disabled=false] If set to `true`, this tooltip will not be shown. Useful when trying to disable the tooltip dynamically.
 * @property {string} [className=''] Additional class names to attach to the tooltip, separated by spaces.
 * @property {object} [style={}] Additional styles names to attach to the tooltip.
 */
type TooltipProps = {
    children: React$Element<*>,
    content?: string | (() => React$Element<*>),
    placementX?: PopoverPlacementX,
    placementY?: PopoverPlacementY,
    placementOffsetX?: number,
    placementOffsetY?: number,
    fitInWindowMode?: FitInWindowMode,
    shouldHideTooltipOnClick?: boolean,
    disabled?: boolean,
    className?: string,
    style?: Object,
};
type TooltipState = {|
    isShowingTooltip: boolean,
|};

/**
 * A component that shows a tooltip. Wraps its children.
 *
 * @example
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
 */
class Tooltip extends React.Component<TooltipProps, TooltipState> {
    static placements = Popover.placements;
    static fitInWindowModes = Popover.fitInWindowModes;

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
    static defaultProps = {
        placementX: Popover.placements.RIGHT,
        placementY: Popover.placements.CENTER,
        placementOffsetX: 12,
        placementOffsetY: 0,
        fitInWindowMode: Popover.fitInWindowModes.FLIP,
    };
    props: TooltipProps;
    _onMouseEnter: (SyntheticMouseEvent<>) => void;
    _onMouseLeave: (SyntheticMouseEvent<>) => void;
    _onClick: (SyntheticMouseEvent<>) => void;
    _showTooltip: () => void;
    _hideTooltip: () => void;
    _renderTooltipContent: () => React$Element<*>;
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
    _onMouseEnter(e: SyntheticMouseEvent<>) {
        this._showTooltip();
        const originalOnMouseEnter = this.props.children.props.onMouseEnter;
        if (originalOnMouseEnter) {
            originalOnMouseEnter(e);
        }
    }
    _onMouseLeave(e: SyntheticMouseEvent<>) {
        this._hideTooltip();
        const originalOnMouseLeave = this.props.children.props.onMouseLeave;
        if (originalOnMouseLeave) {
            originalOnMouseLeave(e);
        }
    }
    _onClick(e: SyntheticMouseEvent<>) {
        if (this.props.shouldHideTooltipOnClick) {
            this._hideTooltip();
        }
        const originalOnClick = this.props.children.props.onClick;
        if (originalOnClick) {
            originalOnClick(e);
        }
    }
    _showTooltip() {
        this.setState({isShowingTooltip: true});
    }
    _hideTooltip() {
        this.setState({isShowingTooltip: false});
    }
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
            <div
                className={cx(
                    baymax('relative dark text-white rounded stroked1 overflow-hidden nowrap'),
                    {
                        [baymax('p1')]: !isContentAFunction,
                    },
                    className,
                )}
                style={style}
            >
                {renderedContent}
            </div>
        );
    }
    render() {
        const {children, content, disabled} = this.props;

        if (disabled || !content) {
            return children;
        }

        const popoverAnchor = React.cloneElement(children, {
            onMouseEnter: this._onMouseEnter,
            onMouseLeave: this._onMouseLeave,
            onClick: this._onClick,
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
