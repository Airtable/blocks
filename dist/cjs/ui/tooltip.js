"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _popover = _interopRequireDefault(require("./popover"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const FADE_IN_ANIMATION_DURATION = 150;

/** */
class Tooltip extends React.Component {
  constructor(props) {
    var _context, _context2, _context3, _context4, _context5, _context6;

    super(props);
    this.state = {
      isShowingTooltip: false
    };
    this._onMouseEnter = (0, _bind.default)(_context = this._onMouseEnter).call(_context, this);
    this._onMouseLeave = (0, _bind.default)(_context2 = this._onMouseLeave).call(_context2, this);
    this._onClick = (0, _bind.default)(_context3 = this._onClick).call(_context3, this);
    this._showTooltip = (0, _bind.default)(_context4 = this._showTooltip).call(_context4, this);
    this._hideTooltip = (0, _bind.default)(_context5 = this._hideTooltip).call(_context5, this);
    this._renderTooltipContent = (0, _bind.default)(_context6 = this._renderTooltipContent).call(_context6, this);
  }

  _onMouseEnter(e) {
    this._showTooltip();

    const originalOnMouseEnter = this.props.children.props.onMouseEnter;

    if (originalOnMouseEnter) {
      originalOnMouseEnter(e);
    }
  }

  _onMouseLeave(e) {
    this._hideTooltip();

    const originalOnMouseLeave = this.props.children.props.onMouseLeave;

    if (originalOnMouseLeave) {
      originalOnMouseLeave(e);
    }
  }

  _onClick(e) {
    if (this.props.shouldHideTooltipOnClick) {
      this._hideTooltip();
    }

    const originalOnClick = this.props.children.props.onClick;

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
    const {
      renderContent,
      content,
      className,
      style
    } = this.props;
    let renderedContent;
    let isContentAFunction;

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
    const {
      children,
      renderContent,
      content,
      disabled
    } = this.props;

    if (disabled || !renderContent && !content) {
      // The tooltip will never show, so just return the children.
      return children;
    }

    const popoverAnchor = React.cloneElement(children, {
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
        animationDuration: `${FADE_IN_ANIMATION_DURATION}ms`,
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
  fitInWindowMode: _propTypes.default.oneOf((0, _values.default)(u).call(u, _popover.default.fitInWindowModes)),
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