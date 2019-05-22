"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _field = require("../types/field");

var _global_config_synced_component_helpers = _interopRequireDefault(require("./global_config_synced_component_helpers"));

var _field_picker = _interopRequireDefault(require("./field_picker"));

var _synced = _interopRequireDefault(require("./synced"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
var FieldPickerSynced =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(FieldPickerSynced, _React$Component);

  function FieldPickerSynced(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FieldPickerSynced);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FieldPickerSynced).call(this, props));
    _this._fieldPicker = null;
    return _this;
  }

  (0, _createClass2.default)(FieldPickerSynced, [{
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to focus');

      this._fieldPicker.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to blur');

      this._fieldPicker.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._fieldPicker, 'No field picker to click');

      this._fieldPicker.click();
    }
  }, {
    key: "_getFieldFromGlobalConfigValue",
    value: function _getFieldFromGlobalConfigValue(fieldId) {
      var table = this.props.table;

      if (!table || table.isDeleted) {
        return null;
      }

      return typeof fieldId === 'string' && table ? table.getFieldById(fieldId) : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
      return React.createElement(_synced.default, {
        globalConfigKey: this.props.globalConfigKey,
        render: function render(_ref) {
          var value = _ref.value,
              canSetValue = _ref.canSetValue,
              setValue = _ref.setValue;
          return React.createElement(_field_picker.default, (0, _extends2.default)({
            ref: function ref(el) {
              return _this2._fieldPicker = el;
            },
            disabled: _this2.props.disabled || !canSetValue,
            field: _this2._getFieldFromGlobalConfigValue(value),
            onChange: function onChange(field) {
              setValue(field ? field.id : null);

              if (_this2.props.onChange) {
                _this2.props.onChange(field);
              }
            }
          }, restOfProps));
        }
      });
    }
  }]);
  return FieldPickerSynced;
}(React.Component);

(0, _defineProperty2.default)(FieldPickerSynced, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  globalConfigKey: _global_config_synced_component_helpers.default.globalConfigKeyPropType,
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  // Passed through to FieldPicker:
  shouldAllowPickingNone: _propTypes.default.bool,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _values.default)(u).call(u, _field.FieldTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string
});

var _default = (0, _create_data_container.default)(FieldPickerSynced, function (props) {
  return [{
    watch: props.table,
    key: 'fields'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;