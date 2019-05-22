"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var React = _interopRequireWildcard(require("react"));

var _create_detect_element_resize = _interopRequireDefault(require("./create_detect_element_resize"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const Geometry = window.__requirePrivateModuleFromAirtable('client/geometry/geometry');

const PopoverPlacements = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};
const FitInWindowModes = {
  NONE: 'none',
  FLIP: 'flip',
  NUDGE: 'nudge'
};

/** */
class Popover extends React.Component {
  constructor(props) {
    var _context, _context2, _context3;

    super(props);
    this._container = null;
    this._background = null;
    this._popoverContent = null;
    this._mouseDownOutsidePopover = false;
    this._onMouseDown = (0, _bind.default)(_context = this._onMouseDown).call(_context, this);
    this._onMouseUp = (0, _bind.default)(_context2 = this._onMouseUp).call(_context2, this);
    this._refreshContainerAsync = (0, _bind.default)(_context3 = this._refreshContainerAsync).call(_context3, this);
  }

  componentDidMount() {
    if (this.props.isOpen) {
      this._createContainer();
    }

    this._refreshContainerAsync();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    (0, _invariant.default)(document.body, 'no document body');
    document.body.appendChild(container);
    window.addEventListener('scroll', this._refreshContainerAsync);
    this._detectElementResize = (0, _create_detect_element_resize.default)();

    this._detectElementResize.addResizeListener(this._anchor, this._refreshContainerAsync);
  }

  _destroyContainer() {
    const container = this._container;

    if (!container) {
      return;
    }

    window.removeEventListener('scroll', this._refreshContainerAsync);

    if (this._detectElementResize) {
      this._detectElementResize.removeResizeListener(this._anchor, this._refreshContainerAsync);
    }

    _reactDom.default.unmountComponentAtNode(container);

    container.remove();
    this._container = null;
  }

  get _anchor() {
    // TODO: use a ref
    // eslint-disable-next-line react/no-find-dom-node
    return _reactDom.default.findDOMNode(this);
  }

  async _refreshContainerAsync() {
    if (!this._container) {
      return;
    }

    const anchor = this._anchor;
    (0, _invariant.default)(anchor instanceof Element, 'No anchor');
    const anchorBoundingClientRect = anchor.getBoundingClientRect();
    const anchorRect = new Geometry.Rect(anchorBoundingClientRect.left, anchorBoundingClientRect.top, anchorBoundingClientRect.width, anchorBoundingClientRect.height);
    const viewportRect = new Geometry.Rect(0, 0, window.innerWidth, window.innerHeight); // Render the tooltip to measure its size. Render it to the right of the anchor element
    // to start. Wait for the async render to complete before measuring. Otherwise, the

    await this._renderPopoverAtPositionAsync(anchorRect.right(), anchorRect.top());
    const measurementPopover = this._popoverContent;
    (0, _invariant.default)(measurementPopover, 'No popover after render');
    const measurementPopoverBoundingRect = measurementPopover.getBoundingClientRect();
    const popoverSize = new Geometry.Size(measurementPopoverBoundingRect.width, measurementPopoverBoundingRect.height);

    let popoverRect = this._getPlacedPopoverRect(popoverSize, anchorRect, this.props.placementX, this.props.placementY);

    if (this.props.fitInWindowMode === FitInWindowModes.FLIP && !this._isRectContainedWithinViewportRect(popoverRect, viewportRect)) {
      // Popover rect is outside the viewport rect, and fitInWindowMode is flip, so
      // let's try flipping the popover.
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

      const flippedPopoverRect = this._getPlacedPopoverRect(popoverSize, anchorRect, placementX, placementY); // Check if the flipped rect is within the viewport before using it. If the flipped rect
      // is also outside the viewport, we might as well just use the original one and then nudge it.


      if (this._isRectContainedWithinViewportRect(flippedPopoverRect, viewportRect)) {
        popoverRect = flippedPopoverRect;
      }
    }

    if (this.props.fitInWindowMode !== FitInWindowModes.NONE) {
      // Check again. If flipping didn't bring it inside viewport bounds,
      // nudge it until it's within the viewport.
      if (popoverRect.left() < viewportRect.left()) {
        popoverRect = new Geometry.Rect(viewportRect.left(), popoverRect.y, popoverRect.width, popoverRect.height);
      } else if (popoverRect.right() > viewportRect.right()) {
        popoverRect = new Geometry.Rect(viewportRect.right() - popoverRect.width, popoverRect.y, popoverRect.width, popoverRect.height);
      }

      if (popoverRect.top() < viewportRect.top()) {
        popoverRect = new Geometry.Rect(popoverRect.x, viewportRect.top(), popoverRect.width, popoverRect.height);
      } else if (popoverRect.bottom() > viewportRect.bottom()) {
        popoverRect = new Geometry.Rect(popoverRect.x, viewportRect.bottom() - popoverRect.height, popoverRect.width, popoverRect.height);
      }
    }

    await this._renderPopoverAtPositionAsync(popoverRect.left(), popoverRect.top());
  }

  _isRectContainedWithinViewportRect(rect, viewportRect) {
    if (rect.left() < viewportRect.left() || rect.right() > viewportRect.right() || rect.top() < viewportRect.top() || rect.bottom() > viewportRect.bottom()) {
      return false;
    }

    return true;
  }

  _getPlacedPopoverRect(popoverSize, anchorRect, placementX, placementY) {
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

  async _renderPopoverAtPositionAsync(left, top) {
    let content = this.props.renderContent();
    content = React.cloneElement(content, {
      ref: el => this._popoverContent = el,
      style: { ...content.props.style,
        position: 'absolute',
        top,
        left
      }
    });
    const backgroundClassName = (0, _classnames.default)('fixed all-0', this.props.backgroundClassName);
    const backgroundStyle = this.props.backgroundStyle;
    return new _promise.default((resolve, reject) => {
      // TODO(jb): we'll need to change this to support all versions of ReactDOM.
      // Probably shouldn't be using unstable methods like this when we release the
      // editor.
      _reactDom.default.unstable_renderSubtreeIntoContainer(this, React.createElement("div", {
        ref: el => this._background = el,
        className: backgroundClassName,
        style: backgroundStyle,
        onMouseDown: this._onMouseDown,
        onMouseUp: this._onMouseUp
      }, content), this._container, resolve);
    });
  }

  _onMouseDown(e) {
    if (this._shouldClickingOnElementClosePopover(e.target)) {
      this._mouseDownOutsidePopover = true;
    }
  }

  _onMouseUp(e) {
    if (this._mouseDownOutsidePopover && this.props.onClose && this._shouldClickingOnElementClosePopover(e.target)) {
      this.props.onClose();
    }

    this._mouseDownOutsidePopover = false;
  }

  _shouldClickingOnElementClosePopover(element) {
    return element === this._background;
  }

  render() {
    // TODO: if children is not a component (e.g. just string), wrap it in a div?
    return this.props.children;
  }

}

(0, _defineProperty2.default)(Popover, "placements", PopoverPlacements);
(0, _defineProperty2.default)(Popover, "fitInWindowModes", FitInWindowModes);
(0, _defineProperty2.default)(Popover, "propTypes", {
  children: _propTypes.default.element.isRequired,
  renderContent: _propTypes.default.func.isRequired,
  placementX: _propTypes.default.oneOf([PopoverPlacements.LEFT, PopoverPlacements.CENTER, PopoverPlacements.RIGHT]),
  placementY: _propTypes.default.oneOf([PopoverPlacements.TOP, PopoverPlacements.CENTER, PopoverPlacements.BOTTOM]),
  placementOffsetX: _propTypes.default.number,
  placementOffsetY: _propTypes.default.number,
  fitInWindowMode: _propTypes.default.oneOf((0, _values.default)(u).call(u, FitInWindowModes)),
  onClose: _propTypes.default.func,
  isOpen: _propTypes.default.bool,
  backgroundClassName: _propTypes.default.string,
  backgroundStyle: _propTypes.default.object
});
(0, _defineProperty2.default)(Popover, "defaultProps", {
  placementX: PopoverPlacements.CENTER,
  placementY: PopoverPlacements.BOTTOM,
  placementOffsetX: 0,
  placementOffsetY: 0,
  fitInWindowMode: FitInWindowModes.FLIP,
  isOpen: true
});
var _default = Popover;
exports.default = _default;