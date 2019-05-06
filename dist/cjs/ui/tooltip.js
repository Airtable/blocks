"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _valuesInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/values");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _popover = _interopRequireDefault(require("./popover"));

var FADE_IN_ANIMATION_DURATION = 150;

/** */
var Tooltip =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Tooltip, _React$Component);

  function Tooltip(props) {
    var _context, _context2, _context3, _context4, _context5, _context6;

    var _this;

    (0, _classCallCheck2.default)(this, Tooltip);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Tooltip).call(this, props));
    _this.state = {
      isShowingTooltip: false
    };
    _this._onMouseEnter = (0, _bind.default)(_context = _this._onMouseEnter).call(_context, (0, _assertThisInitialized2.default)(_this));
    _this._onMouseLeave = (0, _bind.default)(_context2 = _this._onMouseLeave).call(_context2, (0, _assertThisInitialized2.default)(_this));
    _this._onClick = (0, _bind.default)(_context3 = _this._onClick).call(_context3, (0, _assertThisInitialized2.default)(_this));
    _this._showTooltip = (0, _bind.default)(_context4 = _this._showTooltip).call(_context4, (0, _assertThisInitialized2.default)(_this));
    _this._hideTooltip = (0, _bind.default)(_context5 = _this._hideTooltip).call(_context5, (0, _assertThisInitialized2.default)(_this));
    _this._renderTooltipContent = (0, _bind.default)(_context6 = _this._renderTooltipContent).call(_context6, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Tooltip, [{
    key: "_onMouseEnter",
    value: function _onMouseEnter(e) {
      this._showTooltip();

      var originalOnMouseEnter = this.props.children.props.onMouseEnter;

      if (originalOnMouseEnter) {
        originalOnMouseEnter(e);
      }
    }
  }, {
    key: "_onMouseLeave",
    value: function _onMouseLeave(e) {
      this._hideTooltip();

      var originalOnMouseLeave = this.props.children.props.onMouseLeave;

      if (originalOnMouseLeave) {
        originalOnMouseLeave(e);
      }
    }
  }, {
    key: "_onClick",
    value: function _onClick(e) {
      if (this.props.shouldHideTooltipOnClick) {
        this._hideTooltip();
      }

      var originalOnClick = this.props.children.props.onClick;

      if (originalOnClick) {
        originalOnClick(e);
      }
    }
  }, {
    key: "_showTooltip",
    value: function _showTooltip() {
      this.setState({
        isShowingTooltip: true
      });
    }
  }, {
    key: "_hideTooltip",
    value: function _hideTooltip() {
      this.setState({
        isShowingTooltip: false
      });
    }
  }, {
    key: "_renderTooltipContent",
    value: function _renderTooltipContent() {
      var _this$props = this.props,
          renderContent = _this$props.renderContent,
          content = _this$props.content,
          className = _this$props.className,
          style = _this$props.style;
      var renderedContent;
      var isContentAFunction;

      if (renderContent) {
        renderedContent = renderContent();
        isContentAFunction = true;
      } else if (typeof content === 'function') {
        renderedContent = content();
        isContentAFunction = true;
      } else {
        renderedContent = content;
        isContentAFunction = false;
      }

      return React.createElement("div", {
        className: (0, _classnames.default)('relative white rounded stroked1 overflow-hidden', {
          // Add padding only when using content.
          p1: !isContentAFunction
        }, className),
        style: style
      }, renderedContent);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          renderContent = _this$props2.renderContent,
          content = _this$props2.content,
          disabled = _this$props2.disabled;

      if (disabled || !renderContent && !content) {
        // The tooltip will never show, so just return the children.
        return children;
      }

      var popoverAnchor = React.cloneElement(children, {
        onMouseEnter: this._onMouseEnter,
        onMouseLeave: this._onMouseLeave,
        onClick: this._onClick
      });
      return React.createElement(_popover.default, {
        renderContent: this._renderTooltipContent,
        placementX: this.props.placementX,
        placementY: this.props.placementY,
        placementOffsetX: this.props.placementOffsetX,
        placementOffsetY: this.props.placementOffsetY,
        fitInWindowMode: this.props.fitInWindowMode,
        isOpen: this.state.isShowingTooltip,
        backgroundStyle: {
          // Override the background style of the popover so that it doesn't
          // take up any space. If we don't do this, the mouseEnter and mouseLeave
          // handlers won't work, since showing the Popover would place a div over
          // the content that we care about.
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          animationName: 'opacityFadeIn',
          animationDuration: "".concat(FADE_IN_ANIMATION_DURATION, "ms"),
          animationTimingFunction: 'ease-out'
        }
      }, popoverAnchor);
    }
  }]);
  return Tooltip;
}(React.Component);

(0, _defineProperty2.default)(Tooltip, "placements", _popover.default.placements);
(0, _defineProperty2.default)(Tooltip, "fitInWindowModes", _popover.default.fitInWindowModes);
(0, _defineProperty2.default)(Tooltip, "propTypes", {
  children: _propTypes.default.element.isRequired,
  // TODO(jb): remove renderContent in favor of just content.
  renderContent: _propTypes.default.func,
  content: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  placementX: _propTypes.default.oneOf([_popover.default.placements.LEFT, _popover.default.placements.CENTER, _popover.default.placements.RIGHT]),
  placementY: _propTypes.default.oneOf([_popover.default.placements.TOP, _popover.default.placements.CENTER, _popover.default.placements.BOTTOM]),
  placementOffsetX: _propTypes.default.number,
  placementOffsetY: _propTypes.default.number,
  fitInWindowMode: _propTypes.default.oneOf((0, _valuesInstanceProperty(_private_utils))(_popover.default.fitInWindowModes)),
  shouldHideTooltipOnClick: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object
});
(0, _defineProperty2.default)(Tooltip, "defaultProps", {
  placementX: _popover.default.placements.RIGHT,
  placementY: _popover.default.placements.CENTER,
  placementOffsetX: 12,
  placementOffsetY: 0,
  fitInWindowMode: _popover.default.fitInWindowModes.FLIP
});
var _default = Tooltip;
exports.default = _default;