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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _table_picker = _interopRequireDefault(require("./table_picker"));

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _synced = _interopRequireDefault(require("./synced"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

/** */
var TablePickerSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(TablePickerSynced, _React$Component);

  function TablePickerSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, TablePickerSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TablePickerSynced).call(this, props));
    _this._tablePicker = null;
    return _this;
  }

  (0, _createClass2.default)(TablePickerSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to focus');

      this._tablePicker.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to blur');

      this._tablePicker.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._tablePicker, 'No table picker to click');

      this._tablePicker.click();
    }
  }, {
    key: "_getTableFromGlobalConfigValue",
    value: function _getTableFromGlobalConfigValue(tableId) {
      return typeof tableId === 'string' ? (0, _get_sdk.default)().base.getTableById(tableId) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
      return React.createElement(_synced.default, {
        globalConfigKey: this.props.globalConfigKey,
        render: (_ref) => {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_table_picker.default, (0, _extends2.default)({
            ref: el => this._tablePicker = el,
            table: this._getTableFromGlobalConfigValue(value),
            disabled: this.props.disabled || !canSetValue,
            onChange: table => {
              setValue(table ? table.id : null);

              if (this.props.onChange) {
                this.props.onChange(table);
              }
            }
          }, restOfProps));
        }
      });
    }
  }]);
  return TablePickerSynced;
}(React.Component);

(0, _defineProperty2.default)(TablePickerSynced, "propTypes", {
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to TablePicker.
  shouldAllowPickingNone: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});

var _default = (0, _create_data_container.default)(TablePickerSynced, props => {
  return [{
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;