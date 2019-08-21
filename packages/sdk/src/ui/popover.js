// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import ReactDOM from 'react-dom';
import * as React from 'react';
import {values} from '../private_utils';
import {invariant} from '../error_utils';
import {baymax} from './baymax_utils';
import createDetectElementResize from './create_detect_element_resize';

const Geometry = window.__requirePrivateModuleFromAirtable('client/geometry/geometry');


/**
 * An enum describing popover placements. One of `Popover.placements.TOP`, `Popover.placements.CENTER`, `Popover.placements.BOTTOM`, `Popover.placements.LEFT`, `Popover.placements.RIGHT`.
 *
 * @alias Popover.placements
 */
const PopoverPlacements = Object.freeze({
    TOP: ('top': 'top'),
    CENTER: ('center': 'center'),
    BOTTOM: ('bottom': 'bottom'),
    LEFT: ('left': 'left'),
    RIGHT: ('right': 'right'),
});
export type PopoverPlacementX = 'left' | 'center' | 'right';
export type PopoverPlacementY = 'top' | 'center' | 'bottom';

/**
 * An enum describing the fit-in-window mode. One of `Popover.fitInWindowModes.NONE`, `Popover.fitInWindowModes.FLIP`, `Popover.fitInWindowModes.NUDGE`.
 *
 * @alias Popover.fitInWindowModes
 */
const FitInWindowModes = Object.freeze({
    NONE: ('none': 'none'),
    FLIP: ('flip': 'flip'),
    NUDGE: ('nudge': 'nudge'),
});
export type FitInWindowMode = $Values<typeof FitInWindowModes>;

/**
 * @type {object}
 * @property {React$Element<*>} children Child components to render.
 * @property {function} renderContent A function that returns the contents of the popover as React elements.
 * @property {Popover.placements.LEFT|Popover.placements.CENTER|Popover.placements.RIGHT} [placementX=Popover.placements.RIGHT] The horizontal placement of the popover.
 * @property {Popover.placements.TOP|Popover.placements.CENTER|Popover.placements.BOTTOM} [placementY=Popover.placements.CENTER] The vertical placement of the popover.
 * @property {number} [placementOffsetX=0] The horizontal offset, in pixels, of the popover. If `placementX` is set to `Popover.placements.LEFT`, a higher number will move the popover to the left. If `placementX` is set to `Popover.placements.RIGHT`, a higher number moves the popover to the right. If `placementX` is set to `Popover.placements.CENTER`, this value has no effect.
 * @property {number} [placementOffsetY=0] The vertical offset, in pixels, of the popover. If `placementY` is set to `Popover.placements.TOP`, a higher number will move the popover upward. If `placementY` is set to `Popover.placements.BOTTOM`, a higher number moves the popover downard. If `placementY` is set to `Popover.placements.CENTER`, this value has no effect.
 * @property {Popover.fitInWindowModes.FLIP|Popover.fitInWindowModes.NUDGE|Popover.fitInWindowModes.NONE} [fitInWindowMode=Popover.fitInWindowModes.FLIP] Dictates the behavior when the "normal" placement of the popover would be outside of the viewport. If `NONE`, this has no effect, and the popover may be placed off-screen. If `FLIP`, we'll switch the placement to the other side (for example, moving the popover from the left to the right). If `NUDGE`, the popover will be "nudged" just enough to fit on screen.
 * @property {function} [onClose] A function that will be called when the popover closes.
 * @property {boolean} isOpen A boolean that dictates whether the popover is open.
 * @property {string} [backgroundClassName=''] Extra class names for the background of the popover, separated by spaces.
 * @property {object} [backgroundStyle={}] Extra styles for the background of the popover.
 */
type PopoverProps = {
    children: React$Element<*>,
    renderContent: () => React$Element<*>,
    placementX: PopoverPlacementX,
    placementY: PopoverPlacementY,
    placementOffsetX: number,
    placementOffsetY: number,
    fitInWindowMode: FitInWindowMode,
    onClose?: () => void,
    isOpen: boolean,
    backgroundClassName?: string,
    backgroundStyle?: Object,
};

/**
 * A popover component, which is used to "float" some content above some other content.
 *
 * @see {@link Tooltip}
 */
class Popover extends React.Component<PopoverProps> {
    static placements = PopoverPlacements;
    static fitInWindowModes = FitInWindowModes;

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
    static defaultProps = {
        placementX: PopoverPlacements.CENTER,
        placementY: PopoverPlacements.BOTTOM,
        placementOffsetX: 0,
        placementOffsetY: 0,
        fitInWindowMode: FitInWindowModes.FLIP,
        isOpen: true,
    };
    _container: null | HTMLElement;
    _background: null | HTMLDivElement;
    _popoverContent: null | HTMLElement;
    _mouseDownOutsidePopover: boolean;
    _onMouseDown: Event => void;
    _onMouseUp: Event => void;
    _refreshContainerAsync: () => void;
    _detectElementResize: ?{addResizeListener: Function, removeResizeListener: Function};
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
    componentDidMount() {
        if (this.props.isOpen) {
            this._createContainer();
        }

        this._refreshContainerAsync();
    }
    UNSAFE_componentWillReceiveProps(nextProps: PopoverProps) {
        if (nextProps.isOpen) {
            this._createContainer();
        } else {
            this._destroyContainer();
        }
    }
    componentDidUpdate() {
        this._refreshContainerAsync();
    }
    componentWillUnmount() {
        this._destroyContainer();
    }
    _createContainer() {
        if (this._container) {
            return;
        }

        this._container = document.createElement('div');
        const container = this._container;

        container.setAttribute('tabIndex', '0');
        container.style.zIndex = '99999';
        container.style.position = 'relative';
        invariant(document.body, 'no document body');
        document.body.appendChild(container);

        window.addEventListener('scroll', this._refreshContainerAsync);

        this._detectElementResize = createDetectElementResize();
        this._detectElementResize.addResizeListener(this._anchor, this._refreshContainerAsync);
    }
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
    get _anchor() {
        // eslint-disable-next-line react/no-find-dom-node
        return ReactDOM.findDOMNode(this);
    }
    async _refreshContainerAsync() {
        if (!this._container) {
            return;
        }

        const anchor = this._anchor;
        invariant(anchor instanceof Element, 'No anchor');
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
        invariant(measurementPopover, 'No popover after render');
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
    async _renderPopoverAtPositionAsync(left: number, top: number) {
        let content = this.props.renderContent();
        content = React.cloneElement(content, {
            ref: el => (this._popoverContent = el),
            style: {
                ...content.props.style,
                position: 'absolute',
                top,
                left,
            },
        });

        const backgroundClassName = cx(baymax('fixed all-0'), this.props.backgroundClassName);
        const backgroundStyle = this.props.backgroundStyle;

        return new Promise((resolve, reject) => {
            ReactDOM.unstable_renderSubtreeIntoContainer(
                this,
                <div
                    ref={el => (this._background = el)}
                    className={backgroundClassName}
                    style={backgroundStyle}
                    onMouseDown={this._onMouseDown}
                    onMouseUp={this._onMouseUp}
                >
                    {content}
                </div>,
                this._container,
                resolve,
            );
        });
    }
    _onMouseDown(e: Event) {
        if (this._shouldClickingOnElementClosePopover(e.target)) {
            this._mouseDownOutsidePopover = true;
        }
    }
    _onMouseUp(e: Event) {
        if (
            this._mouseDownOutsidePopover &&
            this.props.onClose &&
            this._shouldClickingOnElementClosePopover(e.target)
        ) {
            this.props.onClose();
        }
        this._mouseDownOutsidePopover = false;
    }
    _shouldClickingOnElementClosePopover(element: EventTarget) {
        return element === this._background;
    }
    render() {
        return this.props.children;
    }
}

export default Popover;
