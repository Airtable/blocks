"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _modal = _interopRequireDefault(require("./modal"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

class BlockWrapper extends React.Component {
  constructor(props) {
    super(props); // We watch globalAlert in constructor, instead of using createDataContainer,
    // because createDataContainer starts watching after the component is mounted.
    // If we used createDataContainer and some child component in its constructor or
    // componentDidMount called globalAlert.showReloadPrompt, this component
    // would not update.
    // TODO(kasra): maybe change createDataContainer to handle this case
    // without having to special case it.

    (0, _defineProperty2.default)(this, "_minSizeBeforeRender", null);
    (0, _get_sdk.default)().UI.globalAlert.watch('__alertInfo', () => this.forceUpdate());
  }

  UNSAFE_componentWillMount() {
    this._snapshotMinSizeBeforeRender();
  }

  componentDidMount() {
    this._checkMinSizeConstraintUnchangedAfterRender();
  }

  UNSAFE_componentWillUpdate() {
    this._snapshotMinSizeBeforeRender();
  }

  componentDidUpdate() {
    this._checkMinSizeConstraintUnchangedAfterRender();
  } // usually createDataContainer handles re-rendering when watchable values
  // change. As minSize can be changed by child components though, it can
  // change before createDataContainer has a chance to set up watches. To get
  // around this, we take a snapshot of the minSize before render and call
  // .forceUpdate() if its changed after render


  _snapshotMinSizeBeforeRender() {
    this._minSizeBeforeRender = (0, _get_sdk.default)().viewport.minSize;
  }

  _checkMinSizeConstraintUnchangedAfterRender() {
    var prevMinSize = this._minSizeBeforeRender;
    (0, _invariant.default)(prevMinSize, 'prevMinSize must be set');
    var currentMinSize = (0, _get_sdk.default)().viewport.minSize;

    if (currentMinSize.width !== prevMinSize.width || currentMinSize.height !== prevMinSize.height) {
      this.forceUpdate();
    }
  }

  render() {
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

    return React.createElement(React.Fragment, null, this.props.children, viewport.isSmallerThanMinSize && React.createElement("div", {
      className: "absolute all-0 flex items-center justify-center p2 white",
      style: {
        zIndex: 2147483647 // largest 32-bit signed integer (maximum z-index)

      }
    }, React.createElement("span", {
      className: "center line-height-4 quiet strong"
    }, React.createElement("span", null, "Please make this block bigger or "), React.createElement("span", {
      className: "pointer understroke link-unquiet",
      onClick: () => viewport.enterFullscreen()
    }, "fullscreen"))));
  }

}

var _default = (0, _create_data_container.default)(BlockWrapper, () => [{
  watch: (0, _get_sdk.default)().viewport,
  key: ['size', 'minSize']
}]);

exports.default = _default;