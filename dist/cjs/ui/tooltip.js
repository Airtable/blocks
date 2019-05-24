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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _popover = _interopRequireDefault(require("./popover"));

var FADE_IN_ANIMATION_DURATION = 150;

/** */
class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingTooltip: false
    };
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onClick = this._onClick.bind(this);
    this._showTooltip = this._showTooltip.bind(this);
    this._hideTooltip = this._hideTooltip.bind(this);
    this._renderTooltipContent = this._renderTooltipContent.bind(this);
  }

  _onMouseEnter(e) {
    this._showTooltip();

    var originalOnMouseEnter = this.props.children.props.onMouseEnter;

    if (originalOnMouseEnter) {
      originalOnMouseEnter(e);
    }
  }

  _onMouseLeave(e) {
    this._hideTooltip();

    var originalOnMouseLeave = this.props.children.props.onMouseLeave;

    if (originalOnMouseLeave) {
      originalOnMouseLeave(e);
    }
  }

  _onClick(e) {
    if (this.props.shouldHideTooltipOnClick) {
      this._hideTooltip();
    }

    var originalOnClick = this.props.children.props.onClick;

    if (originalOnClick) {
      originalOnClick(e);
    }
  }

  _showTooltip() {
    this.setState({
      isShowingTooltip: true
    });
  }

  _hideTooltip() {
    this.setState({
      isShowingTooltip: false
    });
  }

  _renderTooltipContent() {
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

  render() {
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

}

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