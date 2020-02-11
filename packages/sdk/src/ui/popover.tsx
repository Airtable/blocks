/** @module @airtable/blocks/ui: Popover */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import ReactDOM from 'react-dom';
import * as React from 'react';
import {values, ObjectValues, FlowAnyObject, FlowAnyFunction} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import {baymax} from './baymax_utils';
import createDetectElementResize from './create_detect_element_resize';
import * as Geometry from './geometry/geometry';


/**
 * Dictates how a {@link Popover} or {@link Tooltip} component should be positioned relative
 * to the anchor element. Accessed via `Popover.placements` or `Tooltip.placements`.
 */

export enum PopoverPlacements {
    /** Positions the popover above the anchor element. */
    TOP = 'top',
    /** Positions the popover below the anchor element. */
    BOTTOM = 'bottom',
    /** Positions the popover so it's center aligned with the anchor element. */
    CENTER = 'center',
    /** Positions the popover left of the anchor element. */
    LEFT = 'left',
    /** Positions the popover right of the anchor element. */
    RIGHT = 'right',
}
/**
 * Any of the supported {@link PopoverPlacements} for horizontal positioning.
 */
export type PopoverPlacementX =
    | PopoverPlacements.LEFT
    | PopoverPlacements.CENTER
    | PopoverPlacements.RIGHT;
/**
 * Any of the supported {@link PopoverPlacements} for vertical positioning.
 */
export type PopoverPlacementY =
    | PopoverPlacements.TOP
    | PopoverPlacements.CENTER
    | PopoverPlacements.BOTTOM;

/**
 * Dictates how a {@link Popover} or {@link Tooltip} component should be kept within the viewport. Accessed via `Popover.fitInWindowModes` or `Tooltip.fitInWindowModes`.
 */

export enum FitInWindowModes {
    /** Allow the popover to be placed offscreen. */
    NONE = 'none',
    /**  If the popover would be placed offscreen, flip the placement to the other side.  */
    FLIP = 'flip',
    /** If the popover would be placed offscreen, nudge the popover just enough so that it stays in the viewport. */
    NUDGE = 'nudge',
}

/**
 * Any of the supported {@link FitInWindowModes}.
 */
export type FitInWindowMode = ObjectValues<typeof FitInWindowModes>;

/**
 * Props for the {@link Popover} component.
 *
 * @hidden
 */
interface PopoverProps {
    /** Child elements to render. */
    children: React.ReactElement;
    /** The horizontal placement of the popover. Defaults to {@link PopoverPlacements.RIGHT}. */
    placementX: PopoverPlacementX;
    /** The vertical placement of the popover. Defaults to {@link PopoverPlacements.CENTER}. */
    placementY: PopoverPlacementY;
    /** The horizontal offset, in pixels, of the popover. If `placementX` is set to {@link PopoverPlacements.LEFT}, a higher number will move the popover to the left. If `placementX` is set to {@link PopoverPlacements.RIGHT}, a higher number moves the popover to the right. If `placementX` is set to {@link PopoverPlacements.CENTER}, this value has no effect. Defaults to 0. */
    placementOffsetX: number;
    /** The vertical offset, in pixels, of the popover. If `placementY` is set to {@link PopoverPlacements.TOP}, a higher number will move the popover upward. If `placementY` is set to {@link PopoverPlacements.BOTTOM}, a higher number moves the popover downard. If `placementY` is set to {@link PopoverPlacements.CENTER}, this value has no effect. Defaults to 0. */
    placementOffsetY: number;
    /** A function that returns the contents of the popover as React elements. */
    renderContent: () => React.ReactElement;
    /** Dictates the behavior when the "normal" placement of the popover would be outside of the viewport. Defaults to {@link FitInWindowModes.FLIP}. */
    fitInWindowMode: FitInWindowMode;
    /** A function that will be called when the popover closes. */
    onClose?: () => void;
    /** A boolean that dictates whether the popover is open. */
    isOpen: boolean;
    /** Extra class names for the background of the popover, separated by spaces. */
    backgroundClassName?: string;
    /** Extra styles for the background of the popover. */
    backgroundStyle?: FlowAnyObject;
}

/**
 * A popover component, which is used to "float" some content above some other content.
 *
 * @docsPath UI/components/Popover
 * @component
 */
class Popover extends React.Component<PopoverProps> {
    /** @hidden */
    static placements = PopoverPlacements;
    /** @hidden */
    static fitInWindowModes = FitInWindowModes;

    /** @hidden */
    static propTypes = {
        children: PropTypes.element.isRequired,
        renderContent: PropTypes.func.isRequired,
        placementX: PropTypes.oneOf([
            PopoverPlacements.LEFT,
            PopoverPlacements.CENTER,
            PopoverPlacements.RIGHT,
        ]),
        placementY: PropTypes.oneOf([
            PopoverPlacements.TOP,
            PopoverPlacements.CENTER,
            PopoverPlacements.BOTTOM,
        ]),
        placementOffsetX: PropTypes.number,
        placementOffsetY: PropTypes.number,
        fitInWindowMode: PropTypes.oneOf(values(FitInWindowModes)),
        onClose: PropTypes.func,
        isOpen: PropTypes.bool,
        backgroundClassName: PropTypes.string,
        backgroundStyle: PropTypes.object,
    };
    /** @hidden */
    static defaultProps = {
        placementX: PopoverPlacements.CENTER,
        placementY: PopoverPlacements.BOTTOM,
        placementOffsetX: 0,
        placementOffsetY: 0,
        fitInWindowMode: FitInWindowModes.FLIP,
        isOpen: true,
    };
    /** @internal */
    _container: null | HTMLElement;
    /** @internal */
    _background: null | HTMLDivElement;
    /** @internal */
    _popoverContent: null | HTMLElement;
    /** @internal */
    _mouseDownOutsidePopover: boolean;
    /** @internal */
    _detectElementResize:
        | {addResizeListener: FlowAnyFunction; removeResizeListener: FlowAnyFunction}
        | null
        | undefined;
    /** @hidden */
    constructor(props: PopoverProps) {
        super(props);

        this._container = null;
        this._background = null;
        this._popoverContent = null;
        this._mouseDownOutsidePopover = false;

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._refreshContainerAsync = this._refreshContainerAsync.bind(this);
    }
    /** @hidden */
    componentDidMount() {
        if (this.props.isOpen) {
            this._createContainer();
        }

        this._refreshContainerAsync();
    }
    /** @hidden */
    UNSAFE_componentWillReceiveProps(nextProps: PopoverProps) {
        if (nextProps.isOpen) {
            this._createContainer();
        } else {
            this._destroyContainer();
        }
    }
    /** @hidden */
    componentDidUpdate() {
        this._refreshContainerAsync();
    }
    /** @hidden */
    componentWillUnmount() {
        this._destroyContainer();
    }
    /** @internal */
    _createContainer() {
        if (this._container) {
            return;
        }

        this._container = document.createElement('div');
        const container = this._container;

        container.setAttribute('tabIndex', '0');
        container.style.zIndex = '99999';
        container.style.position = 'relative';
        if (!document.body) {
            throw spawnInvariantViolationError('no document body');
        }
        document.body.appendChild(container);

        window.addEventListener('scroll', this._refreshContainerAsync);

        this._detectElementResize = createDetectElementResize();
        this._detectElementResize.addResizeListener(this._anchor, this._refreshContainerAsync);
    }
    /** @internal */
    _destroyContainer() {
        const container = this._container;
        if (!container) {
            return;
        }

        window.removeEventListener('scroll', this._refreshContainerAsync);

        if (this._detectElementResize) {
            this._detectElementResize.removeResizeListener(
                this._anchor,
                this._refreshContainerAsync,
            );
        }

        ReactDOM.unmountComponentAtNode(container);
        container.remove();

        this._container = null;
    }
    /** @internal */
    get _anchor() {
        // eslint-disable-next-line react/no-find-dom-node
        return ReactDOM.findDOMNode(this);
    }
    /** @internal */
    async _refreshContainerAsync() {
        if (!this._container) {
            return;
        }

        const anchor = this._anchor;
        if (!(anchor instanceof Element)) {
            throw spawnInvariantViolationError('No anchor');
        }
        const anchorBoundingClientRect = anchor.getBoundingClientRect();
        const anchorRect = new Geometry.Rect(
            anchorBoundingClientRect.left,
            anchorBoundingClientRect.top,
            anchorBoundingClientRect.width,
            anchorBoundingClientRect.height,
        );
        const viewportRect = new Geometry.Rect(0, 0, window.innerWidth, window.innerHeight);

        await this._renderPopoverAtPositionAsync(anchorRect.right(), anchorRect.top());

        const measurementPopover = this._popoverContent;
        if (!measurementPopover) {
            requestAnimationFrame(this._refreshContainerAsync);
            return;
        }
        const measurementPopoverBoundingRect = measurementPopover.getBoundingClientRect();
        const popoverSize = new Geometry.Size(
            measurementPopoverBoundingRect.width,
            measurementPopoverBoundingRect.height,
        );

        let popoverRect = this._getPlacedPopoverRect(
            popoverSize,
            anchorRect,
            this.props.placementX,
            this.props.placementY,
        );

        if (
            this.props.fitInWindowMode === FitInWindowModes.FLIP &&
            !this._isRectContainedWithinViewportRect(popoverRect, viewportRect)
        ) {
            let placementX = this.props.placementX;
            let placementY = this.props.placementY;
            if (popoverRect.left() < viewportRect.left()) {
                placementX = PopoverPlacements.RIGHT;
            } else if (popoverRect.right() > viewportRect.right()) {
                placementX = PopoverPlacements.LEFT;
            }
            if (popoverRect.top() < viewportRect.top()) {
                placementY = PopoverPlacements.BOTTOM;
            } else if (popoverRect.bottom() > viewportRect.bottom()) {
                placementY = PopoverPlacements.TOP;
            }
            const flippedPopoverRect = this._getPlacedPopoverRect(
                popoverSize,
                anchorRect,
                placementX,
                placementY,
            );

            if (this._isRectContainedWithinViewportRect(flippedPopoverRect, viewportRect)) {
                popoverRect = flippedPopoverRect;
            }
        }

        if (this.props.fitInWindowMode !== FitInWindowModes.NONE) {
            if (popoverRect.left() < viewportRect.left()) {
                popoverRect = new Geometry.Rect(
                    viewportRect.left(),
                    popoverRect.y,
                    popoverRect.width,
                    popoverRect.height,
                );
            } else if (popoverRect.right() > viewportRect.right()) {
                popoverRect = new Geometry.Rect(
                    viewportRect.right() - popoverRect.width,
                    popoverRect.y,
                    popoverRect.width,
                    popoverRect.height,
                );
            }

            if (popoverRect.top() < viewportRect.top()) {
                popoverRect = new Geometry.Rect(
                    popoverRect.x,
                    viewportRect.top(),
                    popoverRect.width,
                    popoverRect.height,
                );
            } else if (popoverRect.bottom() > viewportRect.bottom()) {
                popoverRect = new Geometry.Rect(
                    popoverRect.x,
                    viewportRect.bottom() - popoverRect.height,
                    popoverRect.width,
                    popoverRect.height,
                );
            }
        }

        await this._renderPopoverAtPositionAsync(popoverRect.left(), popoverRect.top());
    }
    /** @internal */
    _isRectContainedWithinViewportRect(rect: Geometry.Rect, viewportRect: Geometry.Rect): boolean {
        if (
            rect.left() < viewportRect.left() ||
            rect.right() > viewportRect.right() ||
            rect.top() < viewportRect.top() ||
            rect.bottom() > viewportRect.bottom()
        ) {
            return false;
        }
        return true;
    }
    /** @internal */
    _getPlacedPopoverRect(
        popoverSize: Geometry.Size,
        anchorRect: Geometry.Rect,
        placementX: PopoverPlacementX,
        placementY: PopoverPlacementY,
    ): Geometry.Rect {
        const anchorCenterPoint = anchorRect.centerPoint();

        let x;
        if (placementX === PopoverPlacements.LEFT) {
            x = anchorRect.left() - popoverSize.width - this.props.placementOffsetX;
        } else if (placementX === PopoverPlacements.RIGHT) {
            x = anchorRect.right() + this.props.placementOffsetX;
        } else {
            x = anchorCenterPoint.x - popoverSize.width / 2;
        }

        let y;
        if (placementY === PopoverPlacements.TOP) {
            y = anchorRect.top() - popoverSize.height - this.props.placementOffsetY;
        } else if (placementY === PopoverPlacements.BOTTOM) {
            y = anchorRect.bottom() + this.props.placementOffsetY;
        } else {
            y = anchorCenterPoint.y - popoverSize.height / 2;
        }

        return new Geometry.Rect(x, y, popoverSize.width, popoverSize.height);
    }
    /** @internal */
    async _renderPopoverAtPositionAsync(left: number, top: number) {
        let content = this.props.renderContent();
        content = React.cloneElement(content, {
            ref: (el: HTMLElement | null) => (this._popoverContent = el),
            style: {
                ...content.props.style,
                position: 'absolute',
                top,
                left,
            },
        });

        const backgroundClassName = cx(baymax('fixed all-0'), this.props.backgroundClassName);
        const backgroundStyle = this.props.backgroundStyle;

        return new Promise(resolve => {
            const container = this._container;
            if (!container) {
                throw spawnInvariantViolationError('container must exist');
            }
            ReactDOM.unstable_renderSubtreeIntoContainer(
                this,
                (
                    <div
                        ref={el => (this._background = el)}
                        className={backgroundClassName}
                        style={backgroundStyle}
                        onMouseDown={this._onMouseDown}
                        onMouseUp={this._onMouseUp}
                    >
                        {content}
                    </div>
                ) as any,
                container,
                resolve,
            );
        });
    }
    /** @internal */
    _onMouseDown(e: React.MouseEvent) {
        if (this._shouldClickingOnElementClosePopover(e.target)) {
            this._mouseDownOutsidePopover = true;
        }
    }
    /** @internal */
    _onMouseUp(e: React.MouseEvent) {
        if (
            this._mouseDownOutsidePopover &&
            this.props.onClose &&
            this._shouldClickingOnElementClosePopover(e.target)
        ) {
            this.props.onClose();
        }
        this._mouseDownOutsidePopover = false;
    }
    /** @internal */
    _shouldClickingOnElementClosePopover(element: EventTarget) {
        return element === this._background;
    }
    /** @hidden */
    render() {
        return this.props.children;
    }
}

export default Popover;
