"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

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

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var didSizeChange = (prev, next) => (prev && prev.width) !== (next && next.width) || (prev && prev.height) !== (next && next.height);
/**
 * ViewportConstraint - when mounted, applies constraints to the viewport.
 *
 * @see sdk.viewport
 * @example
 * <UI.ViewportConstraint minSize={{width: 400}} />
 *
 * @example
 * <UI.ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
 *      <div>I need a max fullscreen size!</div>
 * </UI.ViewportConstraint>
 */


var ViewportConstraint =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ViewportConstraint, _React$Component);

  function ViewportConstraint() {
    var _this;

    (0, _classCallCheck2.default)(this, ViewportConstraint);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ViewportConstraint).call(this, ...args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_removeMinSizeConstraintFn", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_removeMaxFullscreenSizeConstrainFn", null);
    return _this;
  }

  (0, _createClass2.default)(ViewportConstraint, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._setMinSizeConstraint();

      this._setMaxFullscreenSizeConstraint();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.children !== nextProps.children || didSizeChange(this.props.minSize, nextProps.minSize) || didSizeChange(this.props.maxFullscreenSize, nextProps.maxFullscreenSize);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (didSizeChange(prevProps.minSize, this.props.minSize)) {
        this._setMinSizeConstraint();
      }

      if (didSizeChange(prevProps.maxFullscreenSize, this.props.maxFullscreenSize)) {
        this._setMaxFullscreenSizeConstraint();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._removeMinSizeConstraint();

      this._removeMaxFullscreenSizeConstraint();
    }
  }, {
    key: "_removeMinSizeConstraint",
    value: function _removeMinSizeConstraint() {
      if (this._removeMinSizeConstraintFn) {
        this._removeMinSizeConstraintFn();

        this._removeMinSizeConstraintFn = null;
      }
    }
  }, {
    key: "_removeMaxFullscreenSizeConstraint",
    value: function _removeMaxFullscreenSizeConstraint() {
      if (this._removeMaxFullscreenSizeConstrainFn) {
        this._removeMaxFullscreenSizeConstrainFn();

        this._removeMaxFullscreenSizeConstrainFn = null;
      }
    }
  }, {
    key: "_setMinSizeConstraint",
    value: function _setMinSizeConstraint() {
      this._removeMinSizeConstraint();

      var minSize = this.props.minSize;

      if (minSize) {
        this._removeMinSizeConstraintFn = (0, _get_sdk.default)().viewport.addMinSize(minSize);
      }
    }
  }, {
    key: "_setMaxFullscreenSizeConstraint",
    value: function _setMaxFullscreenSizeConstraint() {
      this._removeMaxFullscreenSizeConstraint();

      var maxFullscreenSize = this.props.maxFullscreenSize;

      if (maxFullscreenSize) {
        this._removeMaxFullscreenSizeConstrainFn = (0, _get_sdk.default)().viewport.addMaxFullscreenSize(maxFullscreenSize);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;

      if (children === null || children === undefined) {
        return null;
      } // In React 16+, Fragment is available, so we can allow this component
      // to accept one or more child. As we have to support React 15 as well,
      // we fall back to asserting there is only one child if Fragment is\
      // unavailable


      if (React.Fragment) {
        return React.createElement(React.Fragment, null, children);
      }

      return React.Children.only(children);
    }
  }]);
  return ViewportConstraint;
}(React.Component);

(0, _defineProperty2.default)(ViewportConstraint, "propTypes", {
  minSize: _propTypes.default.shape({
    width: _propTypes.default.number,
    height: _propTypes.default.number
  }),
  maxFullscreenSize: _propTypes.default.shape({
    width: _propTypes.default.number,
    height: _propTypes.default.number
  }),
  children: _propTypes.default.node
});
var _default = ViewportConstraint;
exports.default = _default;