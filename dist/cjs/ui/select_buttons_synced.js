"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _select_buttons = _interopRequireDefault(require("./select_buttons"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var _synced = _interopRequireDefault(require("./synced"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;
/** */


var SelectButtonsSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(SelectButtonsSynced, _React$Component);

  function SelectButtonsSynced() {
    (0, _classCallCheck2.default)(this, SelectButtonsSynced);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SelectButtonsSynced).apply(this, arguments));
  }

  (0, _createClass2.default)(SelectButtonsSynced, [{
    key: "render",
    value: function render() {
      var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
      return React.createElement(_synced.default, {
        globalConfigKey: this.props.globalConfigKey,
        render: (_ref) => {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_select_buttons.default, (0, _extends2.default)({
            disabled: this.props.disabled || !canSetValue,
            value: value,
            onChange: newValue => {
              setValue(newValue);

              if (this.props.onChange) {
                this.props.onChange(newValue);
              }
            } // NOTE: blocks rely on being able to override `value` because
            // of this implementation detail. It's helpful when you want the
            // reads to go through some getter instead of using the raw globalConfig
            // value (e.g. to respect defaults).

          }, restOfProps));
        }
      });
    }
  }]);
  return SelectButtonsSynced;
}(React.Component);

(0, _defineProperty2.default)(SelectButtonsSynced, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsSyncedPropTypes);
var _default = SelectButtonsSynced;
exports.default = _default;