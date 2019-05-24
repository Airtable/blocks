"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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
    var _this;

    (0, _classCallCheck2.default)(this, Tooltip);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Tooltip).call(this, props));
    _this.state = {
      isShowingTooltip: false
    };
    _this._onMouseEnter = _this._onMouseEnter.bind((0, _assertThisInitialized2.default)(_this));
    _this._onMouseLeave = _this._onMouseLeave.bind((0, _assertThisInitialized2.default)(_this));
    _this._onClick = _this._onClick.bind((0, _assertThisInitialized2.default)(_this));
    _this._showTooltip = _this._showTooltip.bind((0, _assertThisInitialized2.default)(_this));
    _this._hideTooltip = _this._hideTooltip.bind((0, _assertThisInitialized2.default)(_this));
    _this._renderTooltipContent = _this._renderTooltipContent.bind((0, _assertThisInitialized2.default)(_this));
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
  fitInWindowMode: _propTypes.default.oneOf((0, _private_utils.values)(_popover.default.fitInWindowModes)),
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