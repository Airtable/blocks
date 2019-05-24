"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _create_detect_element_resize = _interopRequireDefault(require("./create_detect_element_resize"));

var Geometry = window.__requirePrivateModuleFromAirtable('client/geometry/geometry');

var PopoverPlacements = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};
var FitInWindowModes = {
  NONE: 'none',
  FLIP: 'flip',
  NUDGE: 'nudge'
};

/** */
class Popover extends React.Component {
  constructor(props) {
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
    var container = this._container;
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
    var container = this._container;

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

  _refreshContainerAsync() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var anchor, anchorBoundingClientRect, anchorRect, viewportRect, measurementPopover, measurementPopoverBoundingRect, popoverSize, popoverRect, placementX, placementY, flippedPopoverRect;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this._container) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              anchor = _this._anchor;
              (0, _invariant.default)(anchor instanceof Element, 'No anchor');
              anchorBoundingClientRect = anchor.getBoundingClientRect();
              anchorRect = new Geometry.Rect(anchorBoundingClientRect.left, anchorBoundingClientRect.top, anchorBoundingClientRect.width, anchorBoundingClientRect.height);
              viewportRect = new Geometry.Rect(0, 0, window.innerWidth, window.innerHeight); // Render the tooltip to measure its size. Render it to the right of the anchor element
              // to start. Wait for the async render to complete before measuring. Otherwise, the

              _context.next = 9;
              return _this._renderPopoverAtPositionAsync(anchorRect.right(), anchorRect.top());

            case 9:
              measurementPopover = _this._popoverContent;
              (0, _invariant.default)(measurementPopover, 'No popover after render');
              measurementPopoverBoundingRect = measurementPopover.getBoundingClientRect();
              popoverSize = new Geometry.Size(measurementPopoverBoundingRect.width, measurementPopoverBoundingRect.height);
              popoverRect = _this._getPlacedPopoverRect(popoverSize, anchorRect, _this.props.placementX, _this.props.placementY);

              if (_this.props.fitInWindowMode === FitInWindowModes.FLIP && !_this._isRectContainedWithinViewportRect(popoverRect, viewportRect)) {
                // Popover rect is outside the viewport rect, and fitInWindowMode is flip, so
                // let's try flipping the popover.
                placementX = _this.props.placementX;
                placementY = _this.props.placementY;

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

                flippedPopoverRect = _this._getPlacedPopoverRect(popoverSize, anchorRect, placementX, placementY); // Check if the flipped rect is within the viewport before using it. If the flipped rect
                // is also outside the viewport, we might as well just use the original one and then nudge it.

                if (_this._isRectContainedWithinViewportRect(flippedPopoverRect, viewportRect)) {
                  popoverRect = flippedPopoverRect;
                }
              }

              if (_this.props.fitInWindowMode !== FitInWindowModes.NONE) {
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

              _context.next = 18;
              return _this._renderPopoverAtPositionAsync(popoverRect.left(), popoverRect.top());

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }

  _isRectContainedWithinViewportRect(rect, viewportRect) {
    if (rect.left() < viewportRect.left() || rect.right() > viewportRect.right() || rect.top() < viewportRect.top() || rect.bottom() > viewportRect.bottom()) {
      return false;
    }

    return true;
  }

  _getPlacedPopoverRect(popoverSize, anchorRect, placementX, placementY) {
    var anchorCenterPoint = anchorRect.centerPoint();
    var x;

    if (placementX === PopoverPlacements.LEFT) {
      x = anchorRect.left() - popoverSize.width - this.props.placementOffsetX;
    } else if (placementX === PopoverPlacements.RIGHT) {
      x = anchorRect.right() + this.props.placementOffsetX;
    } else {
      x = anchorCenterPoint.x - popoverSize.width / 2;
    }

    var y;

    if (placementY === PopoverPlacements.TOP) {
      y = anchorRect.top() - popoverSize.height - this.props.placementOffsetY;
    } else if (placementY === PopoverPlacements.BOTTOM) {
      y = anchorRect.bottom() + this.props.placementOffsetY;
    } else {
      y = anchorCenterPoint.y - popoverSize.height / 2;
    }

    return new Geometry.Rect(x, y, popoverSize.width, popoverSize.height);
  }

  _renderPopoverAtPositionAsync(left, top) {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2() {
      var content, backgroundClassName, backgroundStyle;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              content = _this2.props.renderContent();
              content = React.cloneElement(content, {
                ref: el => _this2._popoverContent = el,
                style: (0, _objectSpread2.default)({}, content.props.style, {
                  position: 'absolute',
                  top,
                  left
                })
              });
              backgroundClassName = (0, _classnames.default)('fixed all-0', _this2.props.backgroundClassName);
              backgroundStyle = _this2.props.backgroundStyle;
              return _context2.abrupt("return", new Promise((resolve, reject) => {
                // TODO(jb): we'll need to change this to support all versions of ReactDOM.
                // Probably shouldn't be using unstable methods like this when we release the
                // editor.
                _reactDom.default.unstable_renderSubtreeIntoContainer(_this2, React.createElement("div", {
                  ref: el => _this2._background = el,
                  className: backgroundClassName,
                  style: backgroundStyle,
                  onMouseDown: _this2._onMouseDown,
                  onMouseUp: _this2._onMouseUp
                }, content), _this2._container, resolve);
              }));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
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
  fitInWindowMode: _propTypes.default.oneOf((0, _private_utils.values)(FitInWindowModes)),
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