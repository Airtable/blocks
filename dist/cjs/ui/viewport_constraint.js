"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

const didSizeChange = (prev, next) => (prev && prev.width) !== (next && next.width) || (prev && prev.height) !== (next && next.height);
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


class ViewportConstraint extends React.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "_removeMinSizeConstraintFn", null);
    (0, _defineProperty2.default)(this, "_removeMaxFullscreenSizeConstrainFn", null);
  }

  componentDidMount() {
    this._setMinSizeConstraint();

    this._setMaxFullscreenSizeConstraint();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.children !== nextProps.children || didSizeChange(this.props.minSize, nextProps.minSize) || didSizeChange(this.props.maxFullscreenSize, nextProps.maxFullscreenSize);
  }

  componentDidUpdate(prevProps) {
    if (didSizeChange(prevProps.minSize, this.props.minSize)) {
      this._setMinSizeConstraint();
    }

    if (didSizeChange(prevProps.maxFullscreenSize, this.props.maxFullscreenSize)) {
      this._setMaxFullscreenSizeConstraint();
    }
  }

  componentWillUnmount() {
    this._removeMinSizeConstraint();

    this._removeMaxFullscreenSizeConstraint();
  }

  _removeMinSizeConstraint() {
    if (this._removeMinSizeConstraintFn) {
      this._removeMinSizeConstraintFn();

      this._removeMinSizeConstraintFn = null;
    }
  }

  _removeMaxFullscreenSizeConstraint() {
    if (this._removeMaxFullscreenSizeConstrainFn) {
      this._removeMaxFullscreenSizeConstrainFn();

      this._removeMaxFullscreenSizeConstrainFn = null;
    }
  }

  _setMinSizeConstraint() {
    this._removeMinSizeConstraint();

    const {
      minSize
    } = this.props;

    if (minSize) {
      this._removeMinSizeConstraintFn = (0, _get_sdk.default)().viewport.addMinSize(minSize);
    }
  }

  _setMaxFullscreenSizeConstraint() {
    this._removeMaxFullscreenSizeConstraint();

    const {
      maxFullscreenSize
    } = this.props;

    if (maxFullscreenSize) {
      this._removeMaxFullscreenSizeConstrainFn = (0, _get_sdk.default)().viewport.addMaxFullscreenSize(maxFullscreenSize);
    }
  }

  render() {
    const children = this.props.children;

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

}

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