"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _modal = _interopRequireDefault(require("./modal"));

var _loader = _interopRequireDefault(require("./loader"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

var BlockWrapper =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(BlockWrapper, _React$Component);

  function BlockWrapper(props) {
    var _this;

    (0, _classCallCheck2.default)(this, BlockWrapper);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BlockWrapper).call(this, props)); // We watch globalAlert in constructor, instead of using createDataContainer,
    // because createDataContainer starts watching after the component is mounted.
    // If we used createDataContainer and some child component in its constructor or
    // componentDidMount called globalAlert.showReloadPrompt, this component
    // would not update.
    // TODO(kasra): maybe change createDataContainer to handle this case
    // without having to special case it.

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_minSizeBeforeRender", null);
    (0, _get_sdk.default)().UI.globalAlert.watch('__alertInfo', () => _this.forceUpdate());
    return _this;
  }

  (0, _createClass2.default)(BlockWrapper, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this._snapshotMinSizeBeforeRender();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._checkMinSizeConstraintUnchangedAfterRender();
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate() {
      this._snapshotMinSizeBeforeRender();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._checkMinSizeConstraintUnchangedAfterRender();
    } // usually createDataContainer handles re-rendering when watchable values
    // change. As minSize can be changed by child components though, it can
    // change before createDataContainer has a chance to set up watches. To get
    // around this, we take a snapshot of the minSize before render and call
    // .forceUpdate() if its changed after render

  }, {
    key: "_snapshotMinSizeBeforeRender",
    value: function _snapshotMinSizeBeforeRender() {
      this._minSizeBeforeRender = (0, _get_sdk.default)().viewport.minSize;
    }
  }, {
    key: "_checkMinSizeConstraintUnchangedAfterRender",
    value: function _checkMinSizeConstraintUnchangedAfterRender() {
      var prevMinSize = this._minSizeBeforeRender;
      (0, _invariant.default)(prevMinSize, 'prevMinSize must be set');
      var currentMinSize = (0, _get_sdk.default)().viewport.minSize;

      if (currentMinSize.width !== prevMinSize.width || currentMinSize.height !== prevMinSize.height) {
        this.forceUpdate();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _getSdk = (0, _get_sdk.default)(),
          UI = _getSdk.UI,
          viewport = _getSdk.viewport;

      var globalAlertInfo = UI.globalAlert.__alertInfo;

      if (globalAlertInfo) {
        return React.createElement(_modal.default, {
          className: "absolute all-0 flex items-center justify-center p2",
          style: {
            animation: 'none',
            maxWidth: null,
            maxHeight: null,
            borderRadius: 0,
            boxShadow: 'none'
          }
        }, globalAlertInfo.content);
      }

      return React.createElement(React.Fragment, null, React.createElement(React.Suspense, {
        fallback: React.createElement("div", {
          className: "absolute all-0 flex items-center justify-center"
        }, React.createElement(_loader.default, null))
      }, this.props.children), viewport.isSmallerThanMinSize && React.createElement("div", {
        className: "absolute all-0 flex items-center justify-center p2 white",
        style: {
          zIndex: 2147483647 // largest 32-bit signed integer (maximum z-index)

        }
      }, React.createElement("span", {
        className: "center line-height-4 quiet strong"
      }, React.createElement("span", null, "Please make this block bigger or "), React.createElement("span", {
        className: "pointer understroke link-unquiet",
        onClick: () => viewport.enterFullscreenIfPossible()
      }, "fullscreen"))));
    }
  }]);
  return BlockWrapper;
}(React.Component);

var _default = (0, _with_hooks.default)(BlockWrapper, () => {
  (0, _use_watchable.default)((0, _get_sdk.default)().viewport, ['size', 'minSize']);
  return {};
});

exports.default = _default;